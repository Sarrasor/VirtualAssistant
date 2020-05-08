package com.example.virtual_assistant;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;
import android.view.MotionEvent;
import android.view.PixelCopy;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import com.google.android.material.snackbar.Snackbar;
import com.google.ar.core.Anchor;
import com.google.ar.core.AugmentedImage;
import com.google.ar.core.AugmentedImageDatabase;
import com.google.ar.core.Config;
import com.google.ar.core.Frame;
import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.core.Session;
import com.google.ar.core.Trackable;
import com.google.ar.core.TrackingState;
import com.google.ar.core.exceptions.UnavailableApkTooOldException;
import com.google.ar.core.exceptions.UnavailableArcoreNotInstalledException;
import com.google.ar.core.exceptions.UnavailableDeviceNotCompatibleException;
import com.google.ar.core.exceptions.UnavailableSdkTooOldException;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.ArSceneView;
import com.google.ar.sceneform.FrameTime;
import com.google.ar.sceneform.assets.RenderableSource;
import com.google.ar.sceneform.math.Quaternion;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.rendering.ViewRenderable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import virtual_assistant.VirtualAssistantGrpc;
import virtual_assistant.VirtualAssistantOuterClass.Asset;
import virtual_assistant.VirtualAssistantOuterClass.Chunk;
import virtual_assistant.VirtualAssistantOuterClass.InstructionRequest;
import virtual_assistant.VirtualAssistantOuterClass.InstructionResponse;
import virtual_assistant.VirtualAssistantOuterClass.Media;
import virtual_assistant.VirtualAssistantOuterClass.MediaRequest;
import virtual_assistant.VirtualAssistantOuterClass.Step;
import virtual_assistant.VirtualAssistantOuterClass.Transform;

public class InstructionDisplay extends AppCompatActivity {
    private static final String TAG = InstructionDisplay.class.getSimpleName();
    private static final double MIN_OPENGL_VERSION = 3.0;
    Session mSession;
    private AugmentedImageDatabase imageDatabase;
    private ArSceneView arSceneView;
    File instructionDir;
    Anchor anchor;
    List<AnchorNode> assetNodesList;
    Context context;
    Activity displayActivity;
    private boolean foundAnchor;
    private Button nextBtn;
    private Button prevBtn;
    private int stepNumber;
    private List<Step> steps;
    private WritingArFragment arFragment;
    private ImageView stepImgView;
    private TextView stepTxtView;
    private ViewRenderable imgRenderable;
    private ViewRenderable textRenderable;
    private HashMap<String, ModelRenderable> modelsMap;
    private int modelCount;
    private boolean gotInstruction;
    private String media_folder = "/media/";

    /**
     * Function that checks if user's device supports ARCore and stuff.
     * Took if from the ARCore tutorial
     *
     * @param activity current activity
     * @return bool
     */
    public static boolean checkIsSupportedDeviceOrFinish(final Activity activity) {
        String openGlVersionString =
                ((ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE))
                        .getDeviceConfigurationInfo()
                        .getGlEsVersion();
        if (Double.parseDouble(openGlVersionString) < MIN_OPENGL_VERSION) {
            Log.e(TAG, "Sceneform requires OpenGL ES 3.0 later");
            Toast.makeText(activity, "Sceneform requires OpenGL ES 3.0 or later", Toast.LENGTH_LONG)
                    .show();
            activity.finish();
            return false;
        }
        return true;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (!checkIsSupportedDeviceOrFinish(this)) {
            return;
        }

        context = getApplicationContext();
        setContentView(R.layout.activity_instruction_display);

        nextBtn = findViewById(R.id.nextButton);
        prevBtn = findViewById(R.id.prevButton);
        nextBtn.setEnabled(false);
        prevBtn.setEnabled(false);

        displayActivity = this;
        gotInstruction = false;

        // Get data from the previous view
        Bundle bundle = getIntent().getExtras();
        String id = "";
        long lastModified = 0;
        if (bundle != null) {
            id = bundle.getString("id");
            lastModified = bundle.getLong("lastModified");
        }

//         String host = "0.tcp.ngrok.io";
//        int port = 16117;
//         String host = "10.90.138.132";
//        int port = 50051;

        String host = context.getString(R.string.host);
        int port = context.getResources().getInteger(R.integer.port);

        try {
            File file = new File(context.getFilesDir().toString() + "/" + id + "/index.json");
            StringBuilder text = new StringBuilder();
            BufferedReader br = new BufferedReader(new FileReader(file));
            String line;
            while ((line = br.readLine()) != null) {
                text.append(line);
                text.append('\n');
            }
            br.close();

            JSONObject index_file = new JSONObject(text.toString());
            long localLastModified = index_file.getLong("last_modified");

            if (localLastModified < lastModified) {
                getInstruction(id, host, port, nextBtn.getRootView());
            } else {
                loadInstruction(id, nextBtn.getRootView());
            }
        } catch (JSONException | IOException e) {
            getInstruction(id, host, port, nextBtn.getRootView());
        }
    }

    private void loadInstruction(String id, View view) {
        steps = new LinkedList<>();
        File directory = context.getFilesDir();
        instructionDir = new File(directory, id);

        new Thread(() -> {
            try {
                File file = new File(instructionDir + "/steps.json");
                StringBuilder text = new StringBuilder();
                BufferedReader br = new BufferedReader(new FileReader(file));
                String line;
                while ((line = br.readLine()) != null) {
                    text.append(line);
                    text.append('\n');
                }
                br.close();

                JSONArray jsonSteps = new JSONArray(text.toString());
                JSONArray jsonAssets;

                Step.Builder stepBuilder;
                Asset.Builder assetBuilder;
                Media.Builder mediaBuilder;
                Transform.Builder transformBuilder;
                Transform.Vector3.Builder vectorBuilder;

                JSONObject jsonStep;
                JSONObject jsonAsset;
                JSONObject jsonMedia;
                JSONObject jsonTransform;
                JSONObject jsonPosition;
                JSONObject jsonOrientation;

                for (int i = 0; i < jsonSteps.length(); i++) {
                    jsonStep = jsonSteps.getJSONObject(i);
                    stepBuilder = Step.newBuilder().setName(jsonStep.getString("name"));
                    stepBuilder.setDescription(jsonStep.getString("description"));
                    stepBuilder.setPreviewUrl(jsonStep.getString("preview_url"));

                    jsonAssets = jsonStep.getJSONArray("assets");

                    for (int j = 0; j < jsonAssets.length(); j++) {
                        jsonAsset = jsonAssets.getJSONObject(j);
                        assetBuilder = Asset.newBuilder().setName(jsonAsset.getString("name"));

                        jsonMedia = jsonAsset.getJSONObject("media");
                        mediaBuilder = Media.newBuilder().setType(Media.MediaType.values()[jsonMedia.getInt("type")]);
                        mediaBuilder.setUrl(jsonMedia.getString("url"));
                        mediaBuilder.setDescription(jsonMedia.getString("description"));
                        assetBuilder.setMedia(mediaBuilder);

                        jsonTransform = jsonAsset.getJSONObject("transform");
                        transformBuilder = Transform.newBuilder().setScale((float) jsonTransform.getDouble("scale"));

                        jsonPosition = jsonTransform.getJSONObject("position");
                        vectorBuilder = Transform.Vector3.newBuilder();
                        vectorBuilder.setX((float) jsonPosition.getDouble("x"));
                        vectorBuilder.setY((float) jsonPosition.getDouble("y"));
                        vectorBuilder.setZ((float) jsonPosition.getDouble("z"));
                        transformBuilder.setPosition(vectorBuilder.build());

                        jsonOrientation = jsonTransform.getJSONObject("orientation");
                        vectorBuilder = Transform.Vector3.newBuilder();
                        vectorBuilder.setX((float) jsonOrientation.getDouble("x"));
                        vectorBuilder.setY((float) jsonOrientation.getDouble("y"));
                        vectorBuilder.setZ((float) jsonOrientation.getDouble("z"));
                        transformBuilder.setOrientation(vectorBuilder.build());

                        assetBuilder.setTransform(transformBuilder);

                        assetBuilder.setBillboard(jsonAsset.getBoolean("billboard"));
                        assetBuilder.setHidden(jsonAsset.getBoolean("hidden"));

                        stepBuilder.addAssets(assetBuilder);
                    }

                    steps.add(stepBuilder.build());
                }

                gotInstruction = true;
            } catch (Exception e) {
                gotInstruction = false;
            }

            view.post(() ->
            {
                if (gotInstruction) {
                    findViewById(R.id.loadingInstructionProgressBar).setVisibility(View.GONE);
                    loadingModelsScreen(view);
                } else {
                    findViewById(R.id.loadingInstructionProgressBar).setVisibility(View.GONE);
                    findViewById(R.id.loadingText).setVisibility(View.GONE);
                    findViewById(R.id.loadingError).setVisibility(View.VISIBLE);
                }
            });
        }).start();
    }

    private void getInstruction(String id, String host, int port, View view) {
        new Thread(() -> {
            try {
                // Create gRPC stub
                ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
                VirtualAssistantGrpc.VirtualAssistantBlockingStub stub = VirtualAssistantGrpc.newBlockingStub(channel);

                // Request the instruction
                InstructionRequest instructionRequest = InstructionRequest.newBuilder().setId(id).build();
                InstructionResponse instructionResponse = stub.getInstruction(instructionRequest);

                // Extract info from instructionResponse
                steps = instructionResponse.getStepsList();

                // Request media folder for the instruction
                MediaRequest mediaRequest = MediaRequest.newBuilder().setId(id).build();
                Iterator<Chunk> media_chunks = stub.downloadMedia(mediaRequest);

                // Create a directory for the instruction with id as name
                File directory = context.getFilesDir();
                instructionDir = new File(directory, id);
                instructionDir.mkdirs();

                // Concatenate the received chunks to media.zip
                File zip_file = new File(instructionDir, "media.zip");
                try (FileOutputStream zipFile = new FileOutputStream(zip_file)) {
                    while (media_chunks.hasNext()) {
                        Chunk chunk = media_chunks.next();
                        zipFile.write(chunk.getBuffer().toByteArray());
                    }
                }

                gotInstruction = true;

                // Unpack media.zip and delete it
                Utils.unpackZip(instructionDir.getPath(), "/media.zip");
                zip_file.delete();

                // Close the connection
                channel.shutdown();

            } catch (Exception e) {
                gotInstruction = false;
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                e.printStackTrace(pw);
                pw.flush();
                System.out.println(String.format("%s", sw));
            }

            view.post(() ->
            {
                if (gotInstruction) {
                    Toast.makeText(this, "Steps size: " + steps.size(), Toast.LENGTH_LONG).show();
                    findViewById(R.id.loadingInstructionProgressBar).setVisibility(View.GONE);
                    loadingModelsScreen(view);
                } else {
                    findViewById(R.id.loadingInstructionProgressBar).setVisibility(View.GONE);
                    findViewById(R.id.loadingText).setVisibility(View.GONE);
                    findViewById(R.id.loadingError).setVisibility(View.VISIBLE);
                }
            });
        }).start();
    }

    private void loadingModelsScreen(View view)
    {
        ProgressBar pgsBar = findViewById(R.id.loadingModelsProgressBar);
        pgsBar.setVisibility(View.VISIBLE);
        TextView text = findViewById(R.id.loadingText);
        text.setText("Loading steps");
        preloadModels();

        new Thread(() ->
        {
            try
            {
                synchronized(modelsMap)
                {
                    while(modelsMap.size() != modelCount)
                    {
                        int progress = (int)(((double)modelsMap.size() / modelCount) * pgsBar.getMax());
                        pgsBar.setProgress(progress);
//                        ProgressBarAnimation anim = new ProgressBarAnimation(pgsBar, pgsBar.getProgress(), progress);
//                        anim.setDuration(1000);
//                        anim.setAnimationListener(new Animation.AnimationListener() {
//                            public void onAnimationEnd(Animation animation) {
//                                if (pgsBar.getProgress() == pgsBar.getMax())
//                                {
//                                    pgsBar.setVisibility(View.GONE);
//                                    findViewById(R.id.loadingBackground).setVisibility(View.GONE);
//                                }
//                            }
//
//                            @Override
//                            public void onAnimationRepeat(Animation animation) {
//
//                            }
//
//                            public void onAnimationStart(Animation animation) {
//                            }
//                        });
//                        pgsBar.startAnimation(anim);

                        modelsMap.wait();
                    }
                }
            }
            catch (InterruptedException e)
            {

            }

            view.post(() ->
            {
                pgsBar.setVisibility(View.GONE);
                findViewById(R.id.loadingBackground).setVisibility(View.GONE);
                findViewById(R.id.loadingText).setVisibility(View.GONE);
                findViewById(R.id.prevButton).setVisibility(View.VISIBLE);
                findViewById(R.id.nextButton).setVisibility(View.VISIBLE);
                findViewById(R.id.photoButton).setVisibility(View.VISIBLE);
                displayInstruction();
            });
        }).start();
    }

    private void preloadModels()
    {
        modelCount = 0;
        HashMap<String, Integer> modelNames = new HashMap<>();
        modelsMap = new HashMap<>();
        for (Step step : steps)
        {
            List<Asset> assets = step.getAssetsList();
            for (Asset asset : assets)
            {
                if (asset.getHidden()) continue;

                if(modelNames.containsKey(media_folder + asset.getMedia().getUrl())) continue;

                if (asset.getMedia().getType() == Media.MediaType.MODEL)
                {
                    modelCount++;
                    modelNames.put(media_folder + asset.getMedia().getUrl(), 1);

                    RenderableSource.SourceType sourceType;
                    if (asset.getMedia().getUrl().contains(".glb")) {
                        sourceType = RenderableSource.SourceType.GLB;
                    } else {
                        sourceType = RenderableSource.SourceType.GLTF2;
                    }

                    ModelRenderable.builder()
                            .setSource(this, RenderableSource.builder().setSource(
                                    this,
                                    Uri.parse(instructionDir.getPath() + media_folder + asset.getMedia().getUrl()), sourceType)
                                    .setScale(1.0f)
                                    .setRecenterMode(RenderableSource.RecenterMode.ROOT)
                                    .build())
                            .setRegistryId(instructionDir.getPath() + media_folder + asset.getMedia().getUrl())
                            .build()
                            .thenAccept(renderable ->
                            {
//                                Toast.makeText(this, "Loaded " +
//                                        asset.getMedia().getUrl(), Toast.LENGTH_LONG).show();

                                synchronized (modelsMap)
                                {
                                    modelsMap.put(media_folder + asset.getMedia().getUrl(), renderable);
                                    modelsMap.notifyAll();
                                }
                            })
                            .exceptionally(
                                    throwable -> {
                                        Toast.makeText(this, "Unable to load " +
                                                asset.getMedia().getUrl(), Toast.LENGTH_LONG).show();
                                        return null;
                                    });
                }
            }
        }
    }


    private void displayInstruction() {
        if (steps.size() == 0) {
            Toast.makeText(this, "Your instruction has no steps", Toast.LENGTH_LONG).show();
            return;
        }

        boolean anchorInstruction = false;
        assetNodesList = new LinkedList<>();
        stepNumber = 0;

        // Get current step
        Step step = steps.get(stepNumber);
        List<Asset> assets = step.getAssetsList();

        for (Asset a : assets) {
            if (a.getName().toLowerCase().equals("anchor")) {
                anchorInstruction = true;
            }
        }

        // Try displaying instruction
        if (instructionDir != null) {
            if (anchorInstruction) {
                displayInstructionAnchor(instructionDir);
            } else {
                displayInstructionPlane();
            }
        } else {
            Toast.makeText(this, "Failed to display the instruction", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Changes current step to the next one
     * Executed on "Next" button click
     *
     * @param view current view
     */
    public void nextStep(View view) {

        // Set new step number
        if (stepNumber < steps.size() - 1) {
            stepNumber += 1;
        } else {
            stepNumber = 0;
        }

        for (AnchorNode node : assetNodesList) {
            node.setParent(null);
        }
        assetNodesList.clear();

        setStep(stepNumber);
    }

    /**
     * Changes current step to the previous one
     * Executed on "Prev" button click
     *
     * @param view current view
     */
    public void prevStep(View view) {
        // Set new step number
        if (stepNumber > 0) {
            stepNumber -= 1;
        } else {
            stepNumber = steps.size() - 1;
        }

        for (AnchorNode node : assetNodesList) {
            node.setParent(null);
        }
        assetNodesList.clear();

        setStep(stepNumber);
    }

    private void setStep(int number)
    {
        // Get current step
        Step step = steps.get(number);

        // Get the assets list
        List<Asset> assets = step.getAssetsList();
        for (Asset asset : assets) {
            if (asset.getHidden()) {
                continue;
            }

            AnchorNode anchorNode = new AnchorNode(anchor);
            anchorNode.setParent(arFragment.getArSceneView().getScene());
            RotatingNode stepNode = new RotatingNode(arFragment.getTransformationSystem());
            stepNode.setParent(anchorNode);

            assetNodesList.add(anchorNode);

            if (asset.getMedia().getType() == Media.MediaType.IMAGE) {
                ViewRenderable.builder().setView(arFragment.getContext(), R.layout.step_image)
                        .build()
                        .thenAccept(renderrable ->
                        {
                            renderrable.setShadowReceiver(false);
                            renderrable.setShadowCaster(false);
                            stepImgView = renderrable.getView().findViewById(R.id.step_img);
                            Bitmap myBitmap = BitmapFactory.decodeFile(instructionDir.getPath() + media_folder + asset.getMedia().getUrl());
                            stepImgView.setImageBitmap(myBitmap);
                            stepNode.setRenderable(renderrable);
                        });
            } else if (asset.getMedia().getType() == Media.MediaType.MODEL) {
                // Display preloaded model
                stepNode.setRenderable(modelsMap.get(media_folder + asset.getMedia().getUrl()));

            } else if (asset.getMedia().getType() == Media.MediaType.TEXT) {
                // Prepare text steps display
                ViewRenderable.builder().setView(arFragment.getContext(), R.layout.step_text)
                        .build()
                        .thenAccept(renderrable ->
                        {
                            renderrable.setShadowReceiver(false);
                            renderrable.setShadowCaster(false);
                            stepTxtView = renderrable.getView().findViewById(R.id.step_text);
                            stepTxtView.setText(asset.getMedia().getDescription());
                            stepNode.setRenderable(renderrable);
                        });
            }

            // Set billboard(always face to the user) property
            stepNode.setRotate(asset.getBillboard());

            // Update Transform
            float scale = asset.getTransform().getScale();

            Transform.Vector3 pos = asset.getTransform().getPosition();
            Transform.Vector3 orient = asset.getTransform().getOrientation();

            if (scale == 0.0f) {
                stepNode.getScaleController().setMinScale(0.01f);
                stepNode.getScaleController().setMaxScale(3.0f);
            } else {
                stepNode.getScaleController().setMinScale(scale - 0.01f);
                stepNode.getScaleController().setMaxScale(scale);
            }

            stepNode.setLocalPosition(new Vector3(pos.getX(), pos.getY(), pos.getZ()));
            stepNode.setLocalRotation(new Quaternion(new Vector3(orient.getX(), orient.getY(), orient.getZ())));
        }
    }


    private void displayInstructionAnchor(File instructionDir) {
        foundAnchor = false;

        // Create AR fragment
        arFragment = (WritingArFragment) getSupportFragmentManager().findFragmentById(R.id.ux_fragment);
        arFragment.getPlaneDiscoveryController().hide();
        arFragment.getPlaneDiscoveryController().setInstructionView(null);
        arFragment.getArSceneView().getPlaneRenderer().setEnabled(false);
        arFragment.getArSceneView().getScene().addOnUpdateListener(this::onUpdateFrame);

        arSceneView = arFragment.getArSceneView();


//        // Prepare image steps display
//        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.step_image)
//                .build()
//                .thenAccept(renderrable ->
//                {
//                    renderrable.setShadowReceiver(false);
//                    renderrable.setShadowCaster(false);
//                    stepImgView = renderrable.getView().findViewById(R.id.step_img);
//                    imgRenderable = renderrable;
//                });
//
//        // Prepare text steps display
//        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.step_text)
//                .build()
//                .thenAccept(renderrable ->
//                {
//                    renderrable.setShadowReceiver(false);
//                    renderrable.setShadowCaster(false);
//                    stepTxtView = renderrable.getView().findViewById(R.id.step_text);
//                    textRenderable = renderrable;
//                });

        try {
            mSession = new Session(context);
        } catch (UnavailableArcoreNotInstalledException | UnavailableApkTooOldException | UnavailableSdkTooOldException | UnavailableDeviceNotCompatibleException e) {
            e.printStackTrace();
            return;
        }

        Config config = new Config(mSession);

        // Get current step
        Step step = steps.get(stepNumber);
        List<Asset> assets = step.getAssetsList();

        Asset anchor_asset = null;
        for (Asset a : assets) {
            if (a.getName().toLowerCase().equals("anchor")) {
                anchor_asset = a;
            }
        }

        if (anchor_asset != null)
        {
            Bitmap anchorBitmap = BitmapFactory.decodeFile(instructionDir.getPath() + media_folder + anchor_asset.getMedia().getUrl());

            imageDatabase = new AugmentedImageDatabase(mSession);
            imageDatabase.addImage("anchor", anchorBitmap);
            config.setAugmentedImageDatabase(imageDatabase);

            Toast.makeText(this, "Found anchor asset: " + imageDatabase.getNumImages(), Toast.LENGTH_LONG).show();
        }
        else
        {
            Toast.makeText(this, "No anchor asset", Toast.LENGTH_LONG).show();
        }

        config.setUpdateMode(Config.UpdateMode.LATEST_CAMERA_IMAGE);
        config.setLightEstimationMode(Config.LightEstimationMode.DISABLED);
        mSession.configure(config);
        arSceneView.setupSession(mSession);
    }

    private void onUpdateFrame(FrameTime frameTime) {
        if (!foundAnchor)
        {
            Frame frame = arFragment.getArSceneView().getArFrame();

            Collection<AugmentedImage> augmentedImages = frame.getUpdatedTrackables(AugmentedImage.class);

            for (AugmentedImage augmentedImage : augmentedImages) {
                Toast.makeText(this, "Detected anchor", Toast.LENGTH_SHORT).show();
                if (augmentedImage.getTrackingState() == TrackingState.TRACKING)
                {
                    if (augmentedImage.getName().contains("anchor"))
                    {

                        anchor = augmentedImage.createAnchor(augmentedImage.getCenterPose());

                        setStep(stepNumber);

                        foundAnchor = true;
                        nextBtn.setEnabled(true);
                        prevBtn.setEnabled(true);
                    }
                }
            }
        }
    }


    /**
     * Displays the first step of the instruction of plane tap
     */
    private void displayInstructionPlane() {
        // Create AR fragment
        arFragment = (WritingArFragment) getSupportFragmentManager().findFragmentById(R.id.ux_fragment);

        // Prepare image steps display
        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.step_image)
                .build()
                .thenAccept(renderrable ->
                {
                    renderrable.setShadowReceiver(false);
                    renderrable.setShadowCaster(false);
                    stepImgView = renderrable.getView().findViewById(R.id.step_img);
                    imgRenderable = renderrable;
                });

        // Prepare text steps display
        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.step_text)
                .build()
                .thenAccept(renderrable ->
                {
                    renderrable.setShadowReceiver(false);
                    renderrable.setShadowCaster(false);
                    stepTxtView = renderrable.getView().findViewById(R.id.step_text);
                    textRenderable = renderrable;
                });

        // Listen for a tap on a plane
        arFragment.setOnTapArPlaneListener(
                (HitResult hitResult, Plane plane, MotionEvent motionEvent) -> {
                    if (anchor != null)
                    {
                        anchor.detach();
                        anchor = null;
                    }

                    // Create the Anchor
                    anchor = hitResult.createAnchor();

                    setStep(stepNumber);

                    nextBtn.setEnabled(true);
                    prevBtn.setEnabled(true);
                });
    }

    public void takePhoto(View view) {
        Toast.makeText(InstructionDisplay.this,
                "Saving photo...", Toast.LENGTH_LONG).show();
        final String filename = generateFilename();

        ArSceneView ar_view = arFragment.getArSceneView();

        // Create a bitmap the size of the scene view.
        final Bitmap bitmap = Bitmap.createBitmap(ar_view.getWidth(), ar_view.getHeight(),
                Bitmap.Config.ARGB_8888);

        // Create a handler thread to offload the processing of the image.
        final HandlerThread handlerThread = new HandlerThread("PixelCopier");
        handlerThread.start();
        // Make the request to copy.
        PixelCopy.request(ar_view, bitmap, (copyResult) -> {
            if (copyResult == PixelCopy.SUCCESS) {
                try {
                    saveBitmapToDisk(bitmap, filename);
                } catch (IOException e) {
                    Toast toast = Toast.makeText(InstructionDisplay.this, e.toString(),
                            Toast.LENGTH_LONG);
                    toast.show();
                    return;
                }

                Snackbar snackbar = Snackbar.make(view, "Photo saved", Snackbar.LENGTH_LONG);
                snackbar.setAction("Open in Photos", v ->
                {
                    File photoFile = new File(filename);

                    Uri photoURI = FileProvider.getUriForFile(InstructionDisplay.this,
                            InstructionDisplay.this.getPackageName() + ".provider",
                            photoFile);

                    Intent intent = new Intent(Intent.ACTION_VIEW, photoURI);
                    intent.setDataAndType(photoURI, "image/*");
                    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    displayActivity.startActivity(intent);
                });
                snackbar.show();
            } else {
                Toast toast = Toast.makeText(InstructionDisplay.this,
                        "Failed to copyPixels: " + copyResult, Toast.LENGTH_LONG);
                toast.show();
            }
            handlerThread.quitSafely();
        }, new Handler(handlerThread.getLooper()));
    }

    private String generateFilename() {
        String date =
                new SimpleDateFormat("yyyyMMddHHmmss", java.util.Locale.getDefault()).format(new Date());
        return Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_PICTURES) + File.separator + "VirtualAssistant/" + date + "_screenshot.jpg";
    }

    private void saveBitmapToDisk(Bitmap bitmap, String filename) throws IOException {

        File out = new File(filename);
        if (!out.getParentFile().exists()) {
            out.getParentFile().mkdirs();
        }
        try (FileOutputStream outputStream = new FileOutputStream(filename);
             ByteArrayOutputStream outputData = new ByteArrayOutputStream()) {
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputData);
            outputData.writeTo(outputStream);
            outputStream.flush();
        } catch (IOException ex) {
            throw new IOException("Failed to save bitmap to disk", ex);
        }
    }
}

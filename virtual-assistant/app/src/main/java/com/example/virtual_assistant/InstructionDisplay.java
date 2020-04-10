package com.example.virtual_assistant;

import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.HandlerThread;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.PixelCopy;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.FileProvider;


import com.google.android.material.snackbar.Snackbar;
import com.google.ar.core.Anchor;
import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.ArSceneView;
import com.google.ar.sceneform.assets.RenderableSource;
import com.google.ar.sceneform.math.Quaternion;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.rendering.ViewRenderable;
import com.google.ar.sceneform.ux.ArFragment;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import virtual_assistant.VirtualAssistantGrpc;
import virtual_assistant.VirtualAssistantOuterClass;
import virtual_assistant.VirtualAssistantOuterClass.Asset;
import virtual_assistant.VirtualAssistantOuterClass.Chunk;
import virtual_assistant.VirtualAssistantOuterClass.InstructionRequest;
import virtual_assistant.VirtualAssistantOuterClass.InstructionResponse;
import virtual_assistant.VirtualAssistantOuterClass.Media;
import virtual_assistant.VirtualAssistantOuterClass.MediaRequest;
import virtual_assistant.VirtualAssistantOuterClass.Step;

public class InstructionDisplay extends AppCompatActivity {

    private static final String TAG = InstructionDisplay.class.getSimpleName();
    private static final double MIN_OPENGL_VERSION = 3.0;
    File instruction_dir;
    RotatingNode stepNode;
    private TextView text;
    private Context context;
    private int step_number;
    private List<Step> steps;
    private WritingArFragment arFragment;
    private ImageView stepImgView;
    private TextView stepTxtView;
    private ViewRenderable imgRenderable;
    private ViewRenderable textRenderable;
    private ModelRenderable modelRenderable;

    /**
     * Function that checks if user's device supports ARCore and stuff.
     * Took if from the ARCore tutorial
     * @param activity
     * @return
     */
    public static boolean checkIsSupportedDeviceOrFinish(final Activity activity)
    {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            Log.e(TAG, "Sceneform requires Android N or later");
            Toast.makeText(activity, "Sceneform requires Android N or later", Toast.LENGTH_LONG).show();
            activity.finish();
            return false;
        }
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
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        if (!checkIsSupportedDeviceOrFinish(this)) {
            return;
        }

        context = getApplicationContext();
        setContentView(R.layout.activity_instruction_display);

        // Get data from the previous view
        Bundle bundle = getIntent().getExtras();
        String id = "";
        String host = "";
        String portStr = "";
        if (bundle != null) {
            id = bundle.getString("id");
            host = bundle.getString("host");
            portStr = bundle.getString("port");
        }
        int port = TextUtils.isEmpty(portStr) ? 0 : Integer.valueOf(portStr);

//         Prepare step variables
        step_number = 0;
        steps = null;
        instruction_dir = null;

        try {
            // Create gRPC stub
            ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
            VirtualAssistantGrpc.VirtualAssistantBlockingStub stub = VirtualAssistantGrpc.newBlockingStub(channel);

            // Request the instruction
            InstructionRequest instructionRequest = InstructionRequest.newBuilder().setId(id).build();
            InstructionResponse instructionResponse = stub.getInstruction(instructionRequest);

            // Extract info from instructionResponse
            int result = instructionResponse.getStatus();
            steps = instructionResponse.getStepsList();

            // Request media folder for the instruction
            MediaRequest mediaRequest = MediaRequest.newBuilder().setId(id).build();
            Iterator<Chunk> media_chunks = stub.downloadMedia(mediaRequest);

            // Create a directory for the instruction with id as name
            File directory = context.getFilesDir();
            instruction_dir = new File(directory, id);
            instruction_dir.mkdirs();

            // Concatenate the received chunks to media.zip
            File zip_file = new File(instruction_dir, "media.zip");
            try (FileOutputStream zipFile = new FileOutputStream(zip_file)) {
                while (media_chunks.hasNext()) {
                    Chunk chunk = media_chunks.next();
                    zipFile.write(chunk.getBuffer().toByteArray());
                }
            }

            // Unpack media.zip and delete it
            unpackZip(instruction_dir.getPath(), "/media.zip");
            zip_file.delete();

            // Prepare debug info
//            String[] fileList = context.fileList();
//            String res = "";
//            for (Step step : steps) {
//                res = res + step.getMediaUrl() + " ";
//            }

            // Display debug info
            text = findViewById(R.id.instrText);
            text.setText(String.format("Request status: %d %d", result, steps.size()));
        }
        catch (Exception e)
        {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            pw.flush();
            System.out.println(String.format("%s", sw));
            Toast.makeText(this, "Failed to get the instruction", Toast.LENGTH_SHORT).show();
        }

        // Try displaying instruction
        if (instruction_dir != null) {
            displayInstruction(instruction_dir);
        } else {
            Toast.makeText(this, "Failed to display the instruction", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Changes current step to the next one
     * Executed on "Next" button click
     * @param view current view
     */
    public void nextStep(View view)
    {

        // Set new step number
        if (step_number < steps.size() - 1) {
            step_number += 1;
        } else {
            step_number = 0;
        }

       setStep(step_number);
    }

    /**
     * Changes current step to the previous one
     * Executed on "Prev" button click
     * @param view current view
     */
    public void prevStep(View view)
    {
        // Set new step number
        if (step_number > 0) {
            step_number -= 1;
        } else {
            step_number = steps.size() - 1;
        }

       setStep(step_number);
    }

    private void setStep(int number)
    {
        // Get current step
        Step step = steps.get(number);

        // Get the first asset
        List<Asset> assets = step.getAssetsList();
        Asset main_asset = assets.get(0);

        Toast.makeText(this, step.getName(), Toast.LENGTH_SHORT).show();

        if (main_asset.getMedia().getType() == Media.MediaType.IMAGE)
        {
            // Set image
            Bitmap myBitmap = BitmapFactory.decodeFile(instruction_dir.getPath() + "/" + main_asset.getMedia().getUrl());
            stepImgView.setImageBitmap(myBitmap);
            stepImgView.invalidate();
            stepNode.setRotate(true);
            stepNode.setRenderable(imgRenderable);

        }
        else if (main_asset.getMedia().getType() == Media.MediaType.MODEL)
        {
            Toast.makeText(this, String.format("Model: %s", main_asset.getMedia().getUrl()), Toast.LENGTH_SHORT).show();

            ModelRenderable.builder()
                .setSource(this, RenderableSource.builder().setSource(
                        this,
                        Uri.parse(instruction_dir.getPath() + "/" + main_asset.getMedia().getUrl()),
                        RenderableSource.SourceType.GLTF2)
                        .setScale(1.0f)  // Scale the original model to 1%.
                        .setRecenterMode(RenderableSource.RecenterMode.ROOT)
                        .build())
                .setRegistryId(instruction_dir.getPath() + "/" + main_asset.getMedia().getUrl())
                .build()
                .thenAccept(renderable -> {
                    Toast.makeText(this, "Created model", Toast.LENGTH_SHORT).show();
                    modelRenderable = renderable;})
                .exceptionally(
                        throwable -> {
                            Toast toast =
                                    Toast.makeText(this, "Unable to load renderable " +
                                            instruction_dir.getPath() + "/" + main_asset.getMedia().getUrl(), Toast.LENGTH_LONG);
                            toast.setGravity(Gravity.CENTER, 0, 0);
                            toast.show();
                            return null;
                        });

            stepNode.setRotate(false);

            stepNode.setRenderable(modelRenderable);
        }

        else if (main_asset.getMedia().getType() == Media.MediaType.TEXT)
        {
            // Set text
            stepTxtView.setText(main_asset.getMedia().getDescription());
            stepTxtView.invalidate();
            stepNode.setRotate(true);
            stepNode.setRenderable(textRenderable);
        }

        // Update Transform
        float scale = main_asset.getTransform().getScale();

        VirtualAssistantOuterClass.Transform.Vector3 pos = main_asset.getTransform().getPosition();
        VirtualAssistantOuterClass.Transform.Vector3 orient = main_asset.getTransform().getOrientation();

        if (scale == 0.0f)
        {
            stepNode.getScaleController().setMinScale(0.01f);
            stepNode.getScaleController().setMaxScale(3.0f);
        }
        else
        {
            stepNode.getScaleController().setMinScale(scale - 0.01f);
            stepNode.getScaleController().setMaxScale(scale);
        }

        stepNode.setLocalPosition(new Vector3(pos.getX(), pos.getY(), pos.getZ()));
        stepNode.setLocalRotation(new Quaternion(new Vector3(orient.getX(), orient.getY(), orient.getZ())));
    }


    /**
     * Displays the first step of the instruction of plane tap
     * @param instruction_dir path to the instruction
     */
    private void displayInstruction(File instruction_dir)
    {
        // Create AR fragment
        arFragment = (WritingArFragment) getSupportFragmentManager().findFragmentById(R.id.ux_fragment);

        // Get current step
        Step step = steps.get(step_number);
        List<Asset> assets = step.getAssetsList();
        Asset main_asset = assets.get(0);
        // Extract image from it
        Bitmap myBitmap = BitmapFactory.decodeFile(instruction_dir.getPath() + "/" + main_asset.getMedia().getUrl());

        // Prepare current step for the display
        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.ar_step)
                .build()
                .thenAccept(renderrable ->
                {
                    stepImgView = renderrable.getView().findViewById(R.id.step_img);
                    stepImgView.setImageBitmap(myBitmap);
                    imgRenderable = renderrable;
                });

        // Prepare current step for the display
        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.step_text)
                .build()
                .thenAccept(renderrable ->
                {
                    stepTxtView = renderrable.getView().findViewById(R.id.step_text);
                    textRenderable = renderrable;
                });

        // Listen for a tap on a plane
        arFragment.setOnTapArPlaneListener(
                (HitResult hitResult, Plane plane, MotionEvent motionEvent) -> {
                    // Create the Anchor
                    Anchor anchor = hitResult.createAnchor();
                    AnchorNode anchorNode = new AnchorNode(anchor);
                    anchorNode.setParent(arFragment.getArSceneView().getScene());

//                    Toast.makeText(this, "Creating initial node", Toast.LENGTH_SHORT).show();

                    // Put current step on anchor
                    stepNode = new RotatingNode(arFragment.getTransformationSystem());
                    stepNode.setParent(anchorNode);

                    if(main_asset.getMedia().getType() == Media.MediaType.IMAGE || main_asset.getMedia().getType() == Media.MediaType.TEXT)
                    {
                        stepNode.setRotate(true);
                    }
                    else
                    {
                        stepNode.setRotate(false);
                    }

                    stepNode.setRenderable(imgRenderable);

                    float scale = main_asset.getTransform().getScale();

                    if (scale == 0.0f)
                    {
                        stepNode.getScaleController().setMinScale(0.01f);
                        stepNode.getScaleController().setMaxScale(3.0f);
                    }
                    else
                    {
                        stepNode.getScaleController().setMinScale(scale - 0.01f);
                        stepNode.getScaleController().setMaxScale(scale);
                    }

                    VirtualAssistantOuterClass.Transform.Vector3 pos = main_asset.getTransform().getPosition();
                    VirtualAssistantOuterClass.Transform.Vector3 orient = main_asset.getTransform().getOrientation();

                    stepNode.setLocalPosition(new Vector3(pos.getX(), pos.getY(), pos.getZ()));
                    stepNode.setLocalRotation(new Quaternion(new Vector3(orient.getX(), orient.getY(), orient.getZ())));
                    stepNode.select();
                });
    }

    /**
     *  Function that unpacks zip. Took it from the link. Modified a bit.
     *  https://stackoverflow.com/questions/3382996/how-to-unzip-files-programmatically-in-android
     * @param path path to zip file parent folder
     * @param zipname zip file name
     * @return
     */
    private boolean unpackZip(String path, String zipname) {
        InputStream is;
        ZipInputStream zis;
        try {
            String filename;
            is = new FileInputStream(path + zipname);
            zis = new ZipInputStream(new BufferedInputStream(is));
            ZipEntry ze;
            byte[] buffer = new byte[1024];
            int count;

            while ((ze = zis.getNextEntry()) != null) {
                filename = ze.getName();

                // Need to create directories if not exists, or
                // it will generate an Exception...
                if (ze.isDirectory()) {
                    File fmd = new File(path + filename);
                    fmd.mkdirs();
                    continue;
                }

                FileOutputStream fout = new FileOutputStream(new File(path, filename));

                while ((count = zis.read(buffer)) != -1) {
                    fout.write(buffer, 0, count);
                }

                fout.close();
                zis.closeEntry();
            }

            zis.close();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    public void takePhoto(View view)
    {
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
            if (copyResult == PixelCopy.SUCCESS)
            {
                try
                {
                    saveBitmapToDisk(bitmap, filename);
                }
                catch (IOException e)
                {
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
                            InstructionDisplay.this.getPackageName() + ".ar.codelab.name.provider",
                            photoFile);

                    Intent intent = new Intent(Intent.ACTION_VIEW, photoURI);
                    intent.setDataAndType(photoURI, "image/*");
                    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(intent);

                });
                snackbar.show();
            }
            else {
                Toast toast = Toast.makeText(InstructionDisplay.this,
                        "Failed to copyPixels: " + copyResult, Toast.LENGTH_LONG);
                toast.show();
            }
            handlerThread.quitSafely();
        }, new Handler(handlerThread.getLooper()));
    }

    private String generateFilename()
    {
        String date =
                new SimpleDateFormat("yyyyMMddHHmmss", java.util.Locale.getDefault()).format(new Date());
        return Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_PICTURES) + File.separator + "Sceneform/" + date + "_screenshot.jpg";
    }

    private void saveBitmapToDisk(Bitmap bitmap, String filename) throws IOException {

        File out = new File(filename);
        if (!out.getParentFile().exists())
        {
            out.getParentFile().mkdirs();
        }
        try (FileOutputStream outputStream = new FileOutputStream(filename);
             ByteArrayOutputStream outputData = new ByteArrayOutputStream())
        {
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputData);
            outputData.writeTo(outputStream);
            outputStream.flush();
        }
        catch (IOException ex)
        {
            throw new IOException("Failed to save bitmap to disk", ex);
        }
    }
}

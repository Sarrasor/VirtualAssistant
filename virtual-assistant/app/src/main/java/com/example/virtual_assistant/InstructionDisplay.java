package com.example.virtual_assistant;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.MotionEventCompat;

import com.example.proto.Chunk;
import com.example.proto.InstructionGrpc;
import com.example.proto.InstructionRequest;
import com.example.proto.InstructionResponse;
import com.example.proto.MediaRequest;
import com.example.proto.Slide;
import com.google.ar.core.Anchor;
import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.assets.RenderableSource;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.rendering.ViewRenderable;
import com.google.ar.sceneform.ux.ArFragment;
import com.google.ar.sceneform.ux.TransformableNode;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URI;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class InstructionDisplay extends AppCompatActivity {

    private static final String TAG = InstructionDisplay.class.getSimpleName();
    private static final double MIN_OPENGL_VERSION = 3.0;
    File instruction_dir;
    RotatingNode slideNode;
    TransformableNode buttonNode;
    private TextView text;
    private Context context;
    private int slide_number;
    private List<Slide> slides;
    private ArFragment arFragment;
    private ImageView slideImgView;
    private ViewRenderable slideRenderable;
    private ViewRenderable buttonRenderable;
    private ModelRenderable catRenderable;

    private static final String GLTF_ASSET =
            "file:///android_asset/Mesh_Cat.gltf";


    /**
     * Function that checks if user's device supports ARCore and stuff.
     * Took if from the ARCore tutorial
     * @param activity
     * @return
     */
    public static boolean checkIsSupportedDeviceOrFinish(final Activity activity) {
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
    protected void onCreate(Bundle savedInstanceState) {
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

        // Prepare slide variables
        slide_number = 0;
        slides = null;
        instruction_dir = null;

        try {
            // Create gRPC stub
            ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
            InstructionGrpc.InstructionBlockingStub stub = InstructionGrpc.newBlockingStub(channel);

            // Request the instruction
            InstructionRequest instructionRequest = InstructionRequest.newBuilder().setId(id).build();
            InstructionResponse instructionResponse = stub.getInstruction(instructionRequest);

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
            String[] fileList = context.fileList();
            int result = instructionResponse.getStatus();
            slides = instructionResponse.getSlidesList();

            String res = "";
            for (Slide slide : slides) {
                res = res + slide.getMediaUrl() + " ";
            }

            // Display debug info
            text = findViewById(R.id.instrText);
            text.setText(String.format("Request status: %d %n %s %n %s", result, res, Arrays.toString(fileList)));
        } catch (Exception e) {
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
     * Changes current slide to the next one
     * Executed on "Next" button click
     * @param view current view
     */
    public void nextSlide(View view) {
        // Set new slide number
        if (slide_number < slides.size() - 1) {
            slide_number += 1;
        } else {
            slide_number = 0;
        }

        // Get current slide
        Slide slide = slides.get(slide_number);

        Toast.makeText(this, String.format("%s", slide.getMediaUrl()), Toast.LENGTH_SHORT).show();

        // Extract image from it
        Bitmap myBitmap = BitmapFactory.decodeFile(instruction_dir.getPath() + "/" + slide.getMediaUrl());
        slideImgView.setImageBitmap(myBitmap);

        // Display the current slide
//        slideNode.setRenderable(slideRenderable);
    }

    /**
     * Changes current slide to the previous one
     * Executed on "Prev" button click
     * @param view current view
     */
    public void prevSlide(View view) {
        // Set new slide number
        if (slide_number > 0) {
            slide_number -= 1;
        } else {
            slide_number = slides.size() - 1;
        }

        // Get current slide
        Slide slide = slides.get(slide_number);

        Toast.makeText(this, String.format("%s", slide.getMediaUrl()), Toast.LENGTH_SHORT).show();

        // Extract image from it
        Bitmap myBitmap = BitmapFactory.decodeFile(instruction_dir.getPath() + "/" + slide.getMediaUrl());
        slideImgView.setImageBitmap(myBitmap);

        // Display the current slide
//        slideNode.setRenderable(slideRenderable);
    }


    /**
     * Displays the first slide of the instruction of plane tap
     * @param instruction_dir path to the instruction
     */
    private void displayInstruction(File instruction_dir) {
        // Get current slide
        Slide slide = slides.get(slide_number);
        // Extract image from it
        Bitmap myBitmap = BitmapFactory.decodeFile(instruction_dir.getPath() + "/" + slide.getMediaUrl());

        // Create AR fragment
        arFragment = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.ux_fragment);

        // Prepare current slide for the display
//        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.slide_image)
//                .build()
//                .thenAccept(renderrable ->
//                {
//                    slideImgView = renderrable.getView().findViewById(R.id.slide_img);
//                    slideImgView.setImageBitmap(myBitmap);
//                    slideRenderable = renderrable;
//                });

        // Prepare current slide for the display
        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.ar_slide)
                .build()
                .thenAccept(renderrable ->
                {
                    slideImgView = renderrable.getView().findViewById(R.id.slide_img);
                    slideImgView.setImageBitmap(myBitmap);
                    slideRenderable = renderrable;
                });

        ModelRenderable.builder()
                .setSource(this, RenderableSource.builder().setSource(
                        this,
                        Uri.parse(instruction_dir.getPath() + "/Mesh_Cat.gltf"),
                        RenderableSource.SourceType.GLTF2)
                        .setScale(0.01f)  // Scale the original model to 50%.
                        .setRecenterMode(RenderableSource.RecenterMode.ROOT)
                        .build())
                .setRegistryId(GLTF_ASSET)
                .build()
                .thenAccept(renderable -> catRenderable = renderable)
                .exceptionally(
                        throwable -> {
                            Toast toast =
                                    Toast.makeText(this, "Unable to load renderable " +
                                            GLTF_ASSET, Toast.LENGTH_LONG);
                            toast.setGravity(Gravity.CENTER, 0, 0);
                            toast.show();
                            return null;
                        });


        // Listen for a tap on a plane
        arFragment.setOnTapArPlaneListener(
                (HitResult hitResult, Plane plane, MotionEvent motionEvent) -> {
                    // Create the Anchor
                    Anchor anchor = hitResult.createAnchor();
                    AnchorNode anchorNode = new AnchorNode(anchor);
                    anchorNode.setParent(arFragment.getArSceneView().getScene());

                    // Put current slide on anchor
                    slideNode = new RotatingNode(arFragment.getTransformationSystem());
                    slideNode.setParent(anchorNode);
                    slideNode.setRenderable(catRenderable);
                    slideNode.getScaleController().setMinScale(0.01f);
                    slideNode.getScaleController().setMaxScale(2.0f);
//                    Vector3 scale = new Vector3(0.1f, 0.1f, 0.1f);
//                    slideNode.setLocalScale(scale);
                    slideNode.select();

//                    Anchor anchorButton = hitResult.createAnchor();
//                    AnchorNode anchorButtonNode = new AnchorNode(anchorButton);
//                    anchorButtonNode.setParent(arFragment.getArSceneView().getScene());

                    // Set button on anchor
//                    buttonNode = new TransformableNode(arFragment.getTransformationSystem());
//                    buttonNode.setParent(anchorButtonNode);
//                    buttonNode.setRenderable(buttonRenderable);
//                    Vector3 pose = new Vector3( 0.0f, -1.0f, 0.0f);
//                    buttonNode.setLocalPosition(pose);
//                    buttonNode.select();
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
}

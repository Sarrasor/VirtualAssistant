package com.example.virtual_assistant;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.text.Layout;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

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
import com.google.ar.sceneform.rendering.ViewRenderable;
import com.google.ar.sceneform.ux.ArFragment;
import com.google.ar.sceneform.ux.TransformableNode;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.zip.Inflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class InstructionDisplay extends AppCompatActivity
{

    private TextView text;
    private Context context;
    private int slide_number;
    private List<Slide> slides;
    File instruction_dir;

    private static final String TAG = InstructionDisplay.class.getSimpleName();
    private static final double MIN_OPENGL_VERSION = 3.0;

    private ArFragment arFragment;
    TransformableNode slideNode;
    private ViewRenderable slideRenderable;


    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        if (!checkIsSupportedDeviceOrFinish(this)) {
            return;
        }

        context = getApplicationContext();
        setContentView(R.layout.activity_instruction_display);

        Bundle bundle = getIntent().getExtras();
        String id = "";
        String host = "";
        String portStr = "";
        if(bundle != null) {
            id = bundle.getString("id");
            host = bundle.getString("host");
            portStr = bundle.getString("port");
        }
        int port = TextUtils.isEmpty(portStr) ? 0 : Integer.valueOf(portStr);

        slides = null;
        instruction_dir = null;

        try
        {
            ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
            InstructionGrpc.InstructionBlockingStub stub = InstructionGrpc.newBlockingStub(channel);

            InstructionRequest instructionRequest = InstructionRequest.newBuilder().setId(id).build();
            InstructionResponse instructionResponse = stub.getInstruction(instructionRequest);

            MediaRequest mediaRequest = MediaRequest.newBuilder().setId(id).build();
            Iterator<Chunk> media_chunks = stub.downloadMedia(mediaRequest);

            File directory = context.getFilesDir();
            instruction_dir = new File(directory, id);
            instruction_dir.mkdirs();

            File zip_file = new File(instruction_dir, "media.zip");
            try (FileOutputStream zipFile = new FileOutputStream(zip_file))
            {
                while (media_chunks.hasNext())
                {
                    Chunk chunk = media_chunks.next();
                    zipFile.write(chunk.getBuffer().toByteArray());
                }
            }

            unpackZip(instruction_dir.getPath(), "/media.zip");
            zip_file.delete();

            String[] fileList = context.fileList();

            int result = instructionResponse.getStatus();
            slides = instructionResponse.getSlidesList();


            String res = "";
            for (Slide slide: slides)
            {
                res = res + slide.getMediaUrl() + " ";
            }

            text = findViewById(R.id.instrText);
            text.setText(String.format("Request status: %d %n %s %n %s", result, res, Arrays.toString(fileList)));
        }
        catch (Exception e)
        {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            pw.flush();
            System.out.println(String.format("%s", sw));
            Toast.makeText(this, "Failed to get instructions", Toast.LENGTH_SHORT).show();
        }

        if (instruction_dir != null)
        {
            displayInstruction(instruction_dir);
        }
        else
        {
            Toast.makeText(this, "Failed to display instructions", Toast.LENGTH_SHORT).show();
        }
    }

    public void nextSlide(View view)
    {
        if (slide_number < slides.size() - 1)
        {
            slide_number += 1;
        }
        else
        {
            slide_number = 0;
        }

        Slide slide = slides.get(slide_number);


            Bitmap myBitmap = BitmapFactory.decodeFile(instruction_dir.getPath() + "/" + slide.getMediaUrl());

            ViewRenderable.builder().setView(arFragment.getContext(), R.layout.slide_image)
                    .build()
                    .thenAccept(renderrable ->
                    {
                        ImageView imgView = renderrable.getView().findViewById(R.id.slide_img);
                        imgView.setImageBitmap(myBitmap);
                        slideRenderable = renderrable;
                    });

            slideNode.setRenderable(slideRenderable);
    }

    private void displayInstruction(File instruction_dir)
    {
        Slide slide = slides.get(0);
        Bitmap myBitmap = BitmapFactory.decodeFile(instruction_dir.getPath() + "/" + slide.getMediaUrl());

        arFragment = (ArFragment) getSupportFragmentManager().findFragmentById(R.id.ux_fragment);

        ViewRenderable.builder().setView(arFragment.getContext(), R.layout.slide_image)
                .build()
                .thenAccept(renderrable ->
                {
                    ImageView imgView = renderrable.getView().findViewById(R.id.slide_img);
                    imgView.setImageBitmap(myBitmap);
                    slideRenderable = renderrable;
                });

        arFragment.setOnTapArPlaneListener(
                (HitResult hitResult, Plane plane, MotionEvent motionEvent) -> {
                    // Create the Anchor.
                    Anchor anchor = hitResult.createAnchor();
                    AnchorNode anchorNode = new AnchorNode(anchor);
                    anchorNode.setParent(arFragment.getArSceneView().getScene());


                    slideNode = new TransformableNode(arFragment.getTransformationSystem());
                    slideNode.setParent(anchorNode);
                    slideNode.setRenderable(slideRenderable);
                    slideNode.select();
                });

    }

    private boolean unpackZip(String path, String zipname)
    {
        InputStream is;
        ZipInputStream zis;
        try
        {
            String filename;
            is = new FileInputStream(path + zipname);
            zis = new ZipInputStream(new BufferedInputStream(is));
            ZipEntry ze;
            byte[] buffer = new byte[1024];
            int count;

            while ((ze = zis.getNextEntry()) != null)
            {
                filename = ze.getName();

                // Need to create directories if not exists, or
                // it will generate an Exception...
                if (ze.isDirectory()) {
                    File fmd = new File(path + filename);
                    fmd.mkdirs();
                    continue;
                }

                FileOutputStream fout = new FileOutputStream(new File(path, filename));

                while ((count = zis.read(buffer)) != -1)
                {
                    fout.write(buffer, 0, count);
                }

                fout.close();
                zis.closeEntry();
            }

            zis.close();
        }
        catch(IOException e)
        {
            e.printStackTrace();
            return false;
        }

        return true;
    }

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
}

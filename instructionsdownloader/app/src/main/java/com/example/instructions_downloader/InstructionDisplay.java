package com.example.instructions_downloader;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.TextView;
import android.widget.Toast;

import com.example.proto.Chunk;
import com.example.proto.InstructionGrpc;
import com.example.proto.InstructionRequest;
import com.example.proto.InstructionResponse;
import com.example.proto.MediaRequest;
import com.example.proto.Slide;

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
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class InstructionDisplay extends AppCompatActivity
{

    private TextView text;
    private static Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
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

        try
        {
            ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
            InstructionGrpc.InstructionBlockingStub stub = InstructionGrpc.newBlockingStub(channel);

            InstructionRequest instructionRequest = InstructionRequest.newBuilder().setId(id).build();
            InstructionResponse instructionResponse = stub.getInstruction(instructionRequest);

            MediaRequest mediaRequest = MediaRequest.newBuilder().setId(id).build();
            Iterator<Chunk> media_chunks = stub.downloadMedia(mediaRequest);

            String zip_name = String.format("media.zip", id);

            try (FileOutputStream fos = context.openFileOutput(zip_name, Context.MODE_PRIVATE))
            {
                while (media_chunks.hasNext())
                {
                    Chunk chunk = media_chunks.next();
                    fos.write(chunk.getBuffer().toByteArray());
                }
            }

            boolean unzipResult = unpackZip(context.getFilesDir().getPath(), "/media.zip", context);

            String[] fileList = context.fileList();

            int result = instructionResponse.getStatus();
            List<Slide> slides = instructionResponse.getSlidesList();

            System.out.println("Unzip result: " + unzipResult);


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

    }

    private boolean unpackZip(String path, String zipname, Context context)
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

//              FileOutputStream fout = new FileOutputStream(path + filename);
                FileOutputStream fout = context.openFileOutput(filename, Context.MODE_PRIVATE);

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
}

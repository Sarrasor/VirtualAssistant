package com.example.virtual_assistant;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.proto.AllInstructioinsRequest;
import com.example.proto.AllInstructioinsResponse;
import com.example.proto.InstructionGrpc;
import com.example.proto.InstructionThumbnail;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class MainActivity extends AppCompatActivity
{

    private Button getInstrButton;
    private EditText hostIP;
    private EditText hostPort;
    private RecyclerView recyclerView;
    private RecyclerView.Adapter adapter;

    private List<InstructionThumbItem> listThumbs;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        hostIP = findViewById(R.id.hostIP);
        hostPort = findViewById(R.id.hostPort);
        getInstrButton = findViewById(R.id.getInstructions);
        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        listThumbs = new ArrayList<>();

        adapter = new InstructionThumbAdapter(listThumbs, this);
        recyclerView.setAdapter(adapter);
    }

    public void getInstructions(View view)
    {
        listThumbs = new ArrayList<>();

        getInstrButton.setEnabled(false);

        String host = hostIP.getText().toString();
        String portStr = hostPort.getText().toString();
        int port = TextUtils.isEmpty(portStr) ? 0 : Integer.valueOf(portStr);

        try
        {
            ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
            InstructionGrpc.InstructionBlockingStub stub = InstructionGrpc.newBlockingStub(channel);

            AllInstructioinsRequest allInstructionsRequest = AllInstructioinsRequest.newBuilder().build();
            AllInstructioinsResponse allInstructionsResponse = stub.getAllInstructions(allInstructionsRequest);

            List<InstructionThumbnail> thumbs = allInstructionsResponse.getThumbnailsList();

            for (InstructionThumbnail thumb: thumbs)
            {
                byte[] data = thumb.getImage().toByteArray();
                Bitmap bMap = BitmapFactory.decodeByteArray(data, 0, data.length);
                InstructionThumbItem iti = new InstructionThumbItem(thumb.getId(), thumb.getName(), thumb.getDescription(), bMap, thumb.getStepCount(), thumb.getSize());

                listThumbs.add(iti);
            }

            adapter = new InstructionThumbAdapter(listThumbs, this);
            recyclerView.setAdapter(adapter);

        }
        catch (Exception e)
        {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            pw.flush();
            System.out.println(String.format("%s", sw));
            Toast.makeText(this, "Failed to get instructions", Toast.LENGTH_SHORT).show();
//            responseText.setText(String.format("Failed... : %n%s", sw));
        }


        getInstrButton.setEnabled(true);
    }
}

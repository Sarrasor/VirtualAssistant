package com.example.virtual_assistant;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import virtual_assistant.VirtualAssistantGrpc;
import virtual_assistant.VirtualAssistantGrpc.VirtualAssistantBlockingStub;
import virtual_assistant.VirtualAssistantOuterClass.AllInstructioinsRequest;
import virtual_assistant.VirtualAssistantOuterClass.AllInstructioinsResponse;
import virtual_assistant.VirtualAssistantOuterClass.InstructionThumbnail;

public class MainActivity extends AppCompatActivity
{

    private boolean gotInstructions;
    private RecyclerView recyclerView;
    private RecyclerView.Adapter adapter;

    private List<InstructionThumbItem> listThumbs;

    Activity mainActivity;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Get UI elements variables
        recyclerView = findViewById(R.id.recycleView);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        mainActivity = this;

        // Create variables for the recyclerView
        listThumbs = new ArrayList<>();
        adapter = new InstructionThumbAdapter(listThumbs, this);
        recyclerView.setAdapter(adapter);

        getInstructions(findViewById(R.id.pullToRefresh).getRootView());

        final SwipeRefreshLayout pullToRefresh = findViewById(R.id.pullToRefresh);
        pullToRefresh.setOnRefreshListener(() -> {
            getInstructions(findViewById(R.id.pullToRefresh).getRootView());
            pullToRefresh.setRefreshing(false);
        });
    }

    /**
     * Function that executes on click on "Get" button. Requests and display instructions thumbnails
     * @param view current view
     */
    public void getInstructions(View view)
    {
        listThumbs = new ArrayList<>();

        // Get host and port of the server from user
        String host = "10.90.138.132";
        int port = 50051;

        new Thread(() -> {
            try
            {
                // Create gRPC stub
                ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
                VirtualAssistantBlockingStub stub = VirtualAssistantGrpc.newBlockingStub(channel);

                // Request all instructions
                AllInstructioinsRequest allInstructionsRequest = AllInstructioinsRequest.newBuilder().build();
                AllInstructioinsResponse allInstructionsResponse = stub.getAllInstructions(allInstructionsRequest);

                // Convert the result to list
                List<InstructionThumbnail> thumbs = allInstructionsResponse.getThumbnailsList();

                // Go through every thumbnail and add them to listThumbs for card display
                for (InstructionThumbnail thumb : thumbs)
                {
                    byte[] data = thumb.getImage().toByteArray();
                    Bitmap bMap = BitmapFactory.decodeByteArray(data, 0, data.length);
                    InstructionThumbItem iti = new InstructionThumbItem(thumb.getId(), thumb.getName(), thumb.getDescription(), bMap, thumb.getStepCount(), thumb.getSize(), thumb.getLastModified().getTimestamp());

                    listThumbs.add(iti);
                }

                // Create recyclerView with fetched cards
                adapter = new InstructionThumbAdapter(listThumbs, mainActivity);
                gotInstructions = true;
            }
            catch (Exception e)
            {
                // If something goes wrong...
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                e.printStackTrace(pw);
                pw.flush();
                System.out.println(String.format("%s", sw));
                gotInstructions = false;
            }

            view.post(() -> {
                if(gotInstructions) {
                    recyclerView.setAdapter(adapter);
                }
                else
                {
                    Toast.makeText(mainActivity, "Server is down", Toast.LENGTH_SHORT).show();
                }
            });
        }).start();
    }
}

package com.example.virtual_assistant;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicBoolean;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import virtual_assistant.VirtualAssistantGrpc;
import virtual_assistant.VirtualAssistantOuterClass;

public class InstructionThumbAdapter extends RecyclerView.Adapter<InstructionThumbAdapter.ViewHolder> {

    private List<InstructionThumbItem> listItems;
    private Context context;

    InstructionThumbAdapter(List<InstructionThumbItem> listItems, Context context) {
        this.listItems = listItems;
        this.context = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.instruction_thumb_item, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, int position) {
        final InstructionThumbItem thumbItem = listItems.get(position);

        holder.imageView.setImageBitmap(thumbItem.getImage());
        holder.textViewName.setText(thumbItem.getName());
        holder.textViewDescription.setText(thumbItem.getDescription());
        double size = thumbItem.getSize() / (1024.0 * 1024.0);
        holder.textViewSize.setText(String.format(Locale.ENGLISH, "Size: %.2f Mb", size));
        holder.textViewSteps.setText(String.format(Locale.ENGLISH, "Steps: %d", thumbItem.getStepCount()));

        if (thumbItem.getLocalStorageStatus() == 2) {
            holder.imageDownloadButton.setBackgroundResource(R.drawable.cloud_check);
        } else if (thumbItem.getLocalStorageStatus() == 1) {
            holder.imageDownloadButton.setBackgroundResource(R.drawable.cloud_update);
        } else {
            holder.imageDownloadButton.setBackgroundResource(R.drawable.download_cloud);
        }

        holder.linearLayout.setOnClickListener(v -> {
            Intent intent = new Intent(context, InstructionDisplay.class);
            intent.putExtra("id", thumbItem.getId());
            intent.putExtra("lastModified", thumbItem.getLastModified().getSeconds());
            context.startActivity(intent);
        });

        holder.linearLayout.setOnLongClickListener(v -> {
            if (thumbItem.getLocalStorageStatus() == 0)
            {
                Toast.makeText(context, "This in instruction is not stored locally", Toast.LENGTH_SHORT).show();
                return true;
            }

            AlertDialog.Builder builder = new AlertDialog.Builder(context, R.style.DeleteDialogStyle);
            builder.setCancelable(true);
            builder.setTitle("Delete instruction");
            builder.setMessage("Do you want to delete the instruction from the device?");
            builder.setPositiveButton("Yes",
                    (dialog, which) -> deleteInstruction(thumbItem.getId(), holder));
            builder.setNegativeButton("No", (dialog, which) -> {
            });
            AlertDialog dialog = builder.create();
            dialog.show();

            Button b = dialog.getButton(DialogInterface.BUTTON_NEGATIVE);
            if(b != null) {
                b.setTextColor(Color.parseColor("#000000"));
            }
            return true;
        });

        holder.imageDownloadButton.setOnClickListener(v -> {

            int status = thumbItem.getLocalStorageStatus();

            if (status == 2)
            {
                Toast.makeText(context, "Yay, the instruction is up to date!", Toast.LENGTH_SHORT).show();
                return;
            }

            AlertDialog.Builder builder = new AlertDialog.Builder(context, R.style.DownloadDialogStyle);
            builder.setCancelable(true);
            builder.setTitle("Download instruction");
            builder.setMessage("Do you want to download the instruction from server?");
            builder.setPositiveButton("Yes",
                    (dialog, which) -> downloadInBackground(thumbItem.getId(), status, holder, holder.imageView.getRootView()));
            builder.setNegativeButton("No", (dialog, which) -> {
            });
            AlertDialog dialog = builder.create();
            dialog.show();
        });
    }


    private void downloadInBackground(String id, int status, ViewHolder holder, View view)
    {
        holder.progressBar.setVisibility(View.VISIBLE);
        holder.imageDownloadButton.setVisibility(View.GONE);
        AtomicBoolean gotInstruction = new AtomicBoolean(false);
        String host = context.getString(R.string.host);
        int port = context.getResources().getInteger(R.integer.port);
        new Thread(() -> {
            try
            {
                // Create gRPC stub
                ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
                VirtualAssistantGrpc.VirtualAssistantBlockingStub stub = VirtualAssistantGrpc.newBlockingStub(channel);

                // Request folder with the instruction
                VirtualAssistantOuterClass.MediaRequest mediaRequest = VirtualAssistantOuterClass.MediaRequest.newBuilder().setId(id).build();
                Iterator<VirtualAssistantOuterClass.Chunk> media_chunks = stub.downloadMedia(mediaRequest);

                // Create a directory for the instruction with id as name
                File directory = context.getFilesDir();
                File instructionDir = new File(directory, id);
                instructionDir.mkdirs();

                // Concatenate the received chunks to media.zip
                File zip_file = new File(instructionDir, "media.zip");
                try (FileOutputStream zipFile = new FileOutputStream(zip_file)) {
                    while (media_chunks.hasNext()) {
                        VirtualAssistantOuterClass.Chunk chunk = media_chunks.next();
                        zipFile.write(chunk.getBuffer().toByteArray());
                    }
                }

                gotInstruction.set(true);

                // Unpack media.zip and delete it
                Utils.unpackZip(instructionDir.getPath(), "/media.zip");
                zip_file.delete();

                // Close the connection
                channel.shutdown();
            }
            catch (Exception e)
            {
                gotInstruction.set(false);
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                e.printStackTrace(pw);
                pw.flush();
                System.out.println(String.format("%s", sw));
            }
            holder.getAdapterPosition();
            view.post(() ->
            {
                holder.progressBar.setVisibility(View.GONE);
                holder.imageDownloadButton.setVisibility(View.VISIBLE);
                if(gotInstruction.get())
                {
                    holder.imageDownloadButton.setBackgroundResource(R.drawable.cloud_check);
                }
                else
                {
                    if (status == 1)
                    {
                        holder.imageDownloadButton.setBackgroundResource(R.drawable.cloud_update);
                    }
                    else
                    {
                        holder.imageDownloadButton.setBackgroundResource(R.drawable.download_cloud);
                    }
                }
            });
        }).start();
    }

    private void deleteInstruction(String id, ViewHolder holder) {
        File directory = context.getFilesDir();
        File instructionDir = new File(directory, id);
        boolean deleted = deleteRecursive(instructionDir);

        if (deleted)
        {
            holder.imageDownloadButton.setBackgroundResource(R.drawable.download_cloud);
        }
        else
        {
            Toast.makeText(context, "Error deleting: " + id, Toast.LENGTH_SHORT).show();
        }
    }

    boolean deleteRecursive(File fileOrDirectory) {

        if (fileOrDirectory.isDirectory())
            for (File child : fileOrDirectory.listFiles())
                deleteRecursive(child);

        return fileOrDirectory.delete();
    }

    @Override
    public int getItemCount() {
        return listItems.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder
    {
        private TextView textViewName;
        private TextView textViewDescription;
        private ImageView imageView;
        private TextView textViewSize;
        private TextView textViewSteps;
        private LinearLayout linearLayout;
        private Button imageDownloadButton;
        private ProgressBar progressBar;


        ViewHolder(@NonNull View itemView)
        {
            super(itemView);
            progressBar = itemView.findViewById(R.id.loadingInBackgroundPanel);
            textViewName = itemView.findViewById(R.id.cardName);
            textViewDescription = itemView.findViewById(R.id.cardDescription);
            textViewSize = itemView.findViewById(R.id.cardSize);
            imageView = itemView.findViewById(R.id.cardImage);
            imageDownloadButton = itemView.findViewById(R.id.downloadImageButton);
            linearLayout = itemView.findViewById(R.id.thumbItem);
            textViewSteps = itemView.findViewById(R.id.stepCount);
        }
    }
}

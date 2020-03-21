package com.example.virtual_assistant;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class InstructionThumbAdapter extends RecyclerView.Adapter<InstructionThumbAdapter.ViewHolder>
{

    public InstructionThumbAdapter(List<InstructionThumbItem> listItems, Context context) {
        this.listItems = listItems;
        this.context = context;
    }

    private List<InstructionThumbItem> listItems;
    private Context context;

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
            View v = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.instruction_thumb_item, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, int position)
    {
        final InstructionThumbItem thumbItem = listItems.get(position);

        holder.imageView.setImageBitmap(thumbItem.getImage());
        holder.textViewName.setText(thumbItem.getName());
        holder.textViewDescription.setText(thumbItem.getDescription());
        holder.textViewSize.setText(String.format("Size: %d bytes", thumbItem.getSize()));
        holder.textViewSteps.setText(String.format("Steps: %d", thumbItem.getStepCount()));

        holder.linearLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                View rootView = ((Activity)context).getWindow().getDecorView().findViewById(android.R.id.content);
                EditText prt = rootView.findViewById(R.id.hostPort);
                EditText ip = rootView.findViewById(R.id.hostIP);
                Intent intent = new Intent(context, InstructionDisplay.class);
                intent.putExtra("id", thumbItem.getId());
                intent.putExtra("host", ip.getText().toString());
                intent.putExtra("port", prt.getText().toString());
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return listItems.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder
    {

        public TextView textViewName;
        public TextView textViewDescription;
        public ImageView imageView;
        public TextView textViewSize;
        public TextView textViewSteps;
        public LinearLayout linearLayout;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            textViewName = itemView.findViewById(R.id.cardName);
            textViewDescription = itemView.findViewById(R.id.cardDescription);
            textViewSize = itemView.findViewById(R.id.cardSize);
            imageView = itemView.findViewById(R.id.cardImage);
            linearLayout = itemView.findViewById(R.id.thumbItem);
            textViewSteps = itemView.findViewById(R.id.stepCount);
        }
    }
}

package com.example.virtual_assistant;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;
import java.util.Locale;

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

        holder.linearLayout.setOnClickListener(v -> {
            Intent intent = new Intent(context, InstructionDisplay.class);
            intent.putExtra("id", thumbItem.getId());
            intent.putExtra("lastModified", thumbItem.getLastModified().getSeconds());
            context.startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return listItems.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {

        private TextView textViewName;
        private TextView textViewDescription;
        private ImageView imageView;
        private TextView textViewSize;
        private TextView textViewSteps;
        private LinearLayout linearLayout;


        ViewHolder(@NonNull View itemView) {
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

package com.example.virtual_assistant;

import android.graphics.Bitmap;

public class InstructionThumbItem {
    private String id;
    private String name;
    private String description;
    private Bitmap image;
    private int stepCount;
    private int size;

    public InstructionThumbItem(String id, String name, String description, Bitmap image, int stepCount, int size) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.stepCount = stepCount;
        this.size = size;
    }

    public String getId() {
        return id;
    }

    public int getStepCount() {
        return stepCount;
    }

    public int getSize() {
        return size;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Bitmap getImage() {
        return image;
    }
}

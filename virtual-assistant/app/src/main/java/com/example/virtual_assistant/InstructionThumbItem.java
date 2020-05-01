package com.example.virtual_assistant;

import android.graphics.Bitmap;

import com.google.protobuf.Timestamp;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class InstructionThumbItem {
    private String id;
    private String name;
    private String description;
    private Bitmap image;
    private int stepCount;
    private int size;
    private Timestamp lastModified;
    private String direcory;

    InstructionThumbItem(String id, String name, String description, Bitmap image, int stepCount, int size, Timestamp lastModified, String direcory) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.description = description;
        this.image = image;
        this.lastModified = lastModified;
        this.stepCount = stepCount;
        this.direcory = direcory;
    }

    /**
     *  Check the version of the instruction on the device
     *
     * @return 0 if not stored locally
     *         1 if outdated version is stored locally
     *         2 if the most updated version is stored locally
     */
    int getLocalStorageStatus() {
        try {
            File file = new File(direcory + "/" + id + "/index.json");
            StringBuilder text = new StringBuilder();
            BufferedReader br = new BufferedReader(new FileReader(file));
            String line;
            while ((line = br.readLine()) != null) {
                text.append(line);
                text.append('\n');
            }
            br.close();

            JSONObject index_file = new JSONObject(text.toString());
            long localLastModified = index_file.getLong("last_modified");
            if (localLastModified < lastModified.getSeconds()) {
                return 1;
            } else {
                return 2;
            }
        } catch (IOException | JSONException e) {
            return 0;
        }
    }

    Timestamp getLastModified() {
        return this.lastModified;
    }

    public String getId() {
        return id;
    }

    int getStepCount() {
        return stepCount;
    }

    public int getSize() {
        return size;
    }

    public String getName() {
        return name;
    }

    String getDescription() {
        return description;
    }

    Bitmap getImage() {
        return image;
    }
}

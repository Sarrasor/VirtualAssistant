package com.example.virtual_assistant;

import com.google.ar.sceneform.FrameTime;
import com.google.ar.sceneform.math.Quaternion;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.ux.TransformableNode;
import com.google.ar.sceneform.ux.TransformationSystem;

public class RotatingNode extends TransformableNode
{

    public RotatingNode(TransformationSystem transformationSystem) {
        super(transformationSystem);
    }

    @Override
    public void onUpdate(FrameTime frameTime) {
        Vector3 cameraPosition = getScene().getCamera().getWorldPosition();
        Vector3 slidePosition = this.getWorldPosition();
        Vector3 direction = Vector3.subtract(cameraPosition, slidePosition);

        // If you want only z rotation
        direction.y = 0.0f;

        Quaternion lookRotation = Quaternion.lookRotation(direction, Vector3.up());
        this.setWorldRotation(lookRotation);
    }


}

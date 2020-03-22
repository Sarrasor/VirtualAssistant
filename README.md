# Android research
Before developing actuall stuff, we did some research of ARCore and gRPC. Here are some sample apps with results.

## Contents
Here is a brief desciption of folders.

### augmented-image
Contains an app that overlays 3D model on an anchor

![augmented image](images/docs/augmented_image.png)

### dynamic-textures
Contains an app that uses plane estimation to place instructions and swithces textures when the button is pressed

![dynamic textures](images/docs/dynamic_texture.png)

### grpc-server
Contains Java gRPC server that sends requested images

To run:
'./gradlew installDist && ./build/install/examples/bin/hello-world-server'

![grpc-server](images/docs/server.png)

### grpc-client
Contains an app that requests and displays images from gRPC server

![grpc-client](images/docs/client.png)

### instructionsdownloader
Contains Java client app to python-server

![instructions-downloader](images/docs/instructions_downloader.png)

### images
Images used

### models
Models used


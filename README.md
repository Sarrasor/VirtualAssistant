# Innopolis Spring 2020 Software Project

## Virtual assistant
Purpose - providing interactive instructions on a complex technological
process and for working with high-tech and expensive equipment. Instructions
are provided in the form of text, images, and animated holograms.

## Structure
- Web editor
- Server
- AR/MR devices

![architecture](architecture.png)

## Technology stack
- Android Studio (3.53! Very important to have this version)
- ARCore
- Sceneform
- WebGL
- GLTF
- gRPC

## Hardware
In order to run applications you should have Android SDK V27, at least. 
Check if your device is supported [here](https://developers.google.com/ar/discover/supported-devices).

If you don't have it, you can setup the Android Virtual Device. To do that, please, follow [this](https://developers.google.com/ar/develop/java/quickstart) guide.

## Branches

### Dev branch
Here is the Virtual Assistant app and Python Server for it.

#### How to run
- Run python-server somewhere. Instructions are in python-server
- Compile apk from virtual-assistant in Android Studio
- Connect to your server via the app. Use IP of your host and port 50051

#### Contents
Here is a brief desciption of folders.

#### python-server
Contains python server with instructions API.
There is README.md inside with more detailed explanation.

![python-server](images/docs/python_server.png)

#### virtual-assistant
Contains Virtual Assistant app

[Video](https://drive.google.com/file/d/1HnKh15GNuCh4DoWQbFhH2sP1luFxgRzL/view?usp=sharing)

#### images
Images used

#### models
Models used

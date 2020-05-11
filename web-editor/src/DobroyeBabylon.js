// npm install babylonjs --save
// npm install --save babylonjs babylonjs-loaders
// move gltf https://www.babylonjs-playground.com/#7DS5D4#1
// npm install --save babylonjs babylonjs-materials

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-materials';


var TEXT = 0;
var IMAGE = 1;
var AUDIO = 2;
var VIDEO = 3;
var TDMODEL = 4;

/*
init function that should be called to update/create/delete
slide: object Slide
assets: json object
files: json object
*/
export function init(slide, assets, files) {

    function findFile(name, files) {
        // if (!files || files.length == 0)
        //     return -1;
        for (let i = 0; i < files.length; i++) {
            if (files[i].name == name) {
                return files[i];
            }
        }
    }

    function findAssetIfPresent(id) {
        for (let i = 0; i < slide.assets.length; i++)
            if (slide.assets[i].id == id)
                return slide.assets[i];
        return null;
    }


    // if assets and/or files are empty, empty scene will appear
    if (!assets || assets.length == 0 || (assets.length == 1 && assets[0].media.url == "" && assets[0].media_desc == "")) {
        // for (let i =0; i < slide.assets.length; i++){
        //     slide.deleteAsset(slide.assets[i].id);
        // }
        return slide;
    }

    for (let ai = 0; ai < assets.length; ai++) {
        let asset = assets[ai];
        var file = null;
        if (asset.media.url != "")
            file = findFile(assets[ai].media.url, files);

        var existing_asset = findAssetIfPresent(asset.id);
        slide.manageAsset(existing_asset, asset.id, asset.name, file ? file.type : 0, {
            media_desc: asset.media.description,
            position: {
                x: asset.transform.position.x,
                y: asset.transform.position.y,
                z: asset.transform.position.z,
            },
            rotation: {
                x: asset.transform.orientation.x,
                y: asset.transform.orientation.y,
                z: asset.transform.orientation.z,
            },
            scale: asset.transform.scale,
            billboard: asset.billboard,
            hidden: asset.hidden,
            url: file?.content
        });
    }
    return slide;
}


export class Slide {
    /*
    sets up everything that is needed to display the scene
    node: node that scene will be put on (example: div)
    */
    constructor(node) {
        this.node = node;
        this.createScene();
        this.assets = [];
    }

    /*
    existing_asset: Asset or null - if it contains an asset then it will be updated; if it contains null - create new asset
    id: str - id of the asset
    name:str - name of the newly created asset
    media_type: int
    options: { media_desc:string, billboard:boolean, hidden:boolean, url:string,
              position:{x:num, y:num, z:num}, rotation{x:num, y:num, z:num}, scale:num }
    */
        manageAsset(existing_asset, id, name, media_type, options) {
        if (existing_asset == null)
        {
            var new_obj = new Asset(id, name, media_type, this.scene,
            {
                media_desc: options.media_desc,
                url: options.url,
                position: {
                    x: options.position.x,
                    y: options.position.y,
                    z: options.position.z
                },
                rotation: {
                    x: options.rotation.x,
                    y: options.rotation.y,
                    z: options.rotation.z
                },
                scale: options.scale,
                hidden: options.hidden,
                billboard: options.billboard
            });
            this.assets.push(new_obj);
        }
        else 
        {
            let asset = existing_asset;
            asset.name = name;
            asset.hidden = options.hidden;
            if (asset.media_type != media_type || asset.url != options.url || asset.billboard != options.billboard || 
                    (asset.media_type == TEXT && asset.media_desc != options.media_desc)) {
                asset.media_type = media_type;
                asset.url = options.url;
                asset.billboard = options.billboard;
                asset.model.dispose();
                asset.loadObject(this.scene);
            }
            asset.media_desc = options.media_desc;
            asset.setScale(options.scale);
            asset.setPosition({
                x: options.position.x,
                y: options.position.y,
                z: options.position.z
            });
            asset.setOrientation({
                x: options.rotation.x,
                y: options.rotation.y,
                z: options.rotation.z
            });
            
            asset.setTransparent(asset.hidden);
        }
    }

    /*
    id: string
    returns an index of asset with asset.id=id
    */
    findAssetIndexById(id) {
        for (let i = 0; i < this.assets.length; i++)
            if (this.assets[i].id == id)
                return i
    }

    /*
    name:str - name of the asset to be deleted
    */
    deleteAsset(id) {
        let index = this.findAssetIndexById(id);
        this.assets[index].model.dispose();
        this.assets.splice(index);
    }

    // from here, all the functions that belong to the class Slide play technical role only
    // and must not be called from outside of class Asset
    createScene() {
        var engine = new BABYLON.Engine(this.node, false, { preserveDrawingBuffer: true, stencil: true });
        var scene = new BABYLON.Scene(engine);

        scene.createDefaultCameraOrLight(true, true, true);

        scene.activeCamera.beta -= 0.2;
        scene.activeCamera.upperBetaLimit = Math.PI / 2.1;
        scene.activeCamera.lowerRadiusLimit = 3;
        scene.activeCamera.upperRadiusLimit = 20;

        scene.activeCamera.setTarget(new BABYLON.Vector3(0, 0, 0));
        scene.activeCamera.setPosition(new BABYLON.Vector3(0, 3, 10));


        scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);

        scene.lights[0].dispose();
        var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-2, -3, 1), scene);
        light.position = new BABYLON.Vector3(0, 0, 10);
        light.intensity = 1;

        let additional_lights = [];
        for (let i = 0; i < 6; i++){
            additional_lights.push(new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -0.001, 0), scene));
            additional_lights[i].intensity = 0.8;
        }
        additional_lights[0].position = new BABYLON.Vector3(0, 2, 5);
        additional_lights[1].position = new BABYLON.Vector3(5, 2, 0);
        additional_lights[2].position = new BABYLON.Vector3(-5, 2, 0);
        additional_lights[3].position = new BABYLON.Vector3(0, 2, -5);
        additional_lights[4].position = new BABYLON.Vector3(0, -5, 0);
        additional_lights[5].position = new BABYLON.Vector3(0, 8, 0);

        var helper = scene.createDefaultEnvironment({
            groundShadowLevel: -5,
        });

        helper.setMainColor(new BABYLON.Color3(0.698, 0.502, 0.69));

        engine.runRenderLoop(function () {
            scene.render();
        });

        var showAxis = function(size)
        {
            var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
                new BABYLON.Vector3(-size, 0, 0), new BABYLON.Vector3(size, 0, 0),
                new BABYLON.Vector3(size, 0, 0)
                ], scene);
            axisX.color = new BABYLON.Color3(1.0, 0, 0);

            var xCone = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterBottom:0.2, diameterTop: 0.03, tessellation: 100, height:0.2}, scene);
            xCone.position = new BABYLON.Vector3(-size, 0, 0);
            xCone.rotation = new BABYLON.Vector3(Math.PI/2, -Math.PI/2, 0);
            xCone.material = new BABYLON.StandardMaterial("matX", scene);
            xCone.material.emissiveColor = new BABYLON.Color3(1.0, 0, 0);
            xCone.material.diffuseColor = new BABYLON.Color3(1.0, 0, 0);

            var axisY = BABYLON.Mesh.CreateLines("axisY", [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size*2/3, 0),
                new BABYLON.Vector3(0, size*2/3, 0)
                ], scene);
            axisY.color = new BABYLON.Color3(0, 1.0, 0);

            var yCone = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterBottom:0.2, diameterTop: 0.03, tessellation: 100, height:0.2}, scene);
            yCone.position = new BABYLON.Vector3(0, 2/3*size, 0);
            yCone.rotation = new BABYLON.Vector3(0, 0, 0);
            yCone.material = new BABYLON.StandardMaterial("matY", scene);
            yCone.material.emissiveColor = new BABYLON.Color3(0, 1.0, 0);
            yCone.material.diffuseColor = new BABYLON.Color3(0, 1.0, 0);


            var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
                new BABYLON.Vector3(0, 0, -size), new BABYLON.Vector3(0, 0, size),
                new BABYLON.Vector3(0, 0, size)
                ], scene);
            axisZ.color = new BABYLON.Color3(0, 0, 1.0);

            var zCone = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterBottom:0.2, diameterTop: 0.03, tessellation: 100, height:0.2}, scene);
            zCone.position = new BABYLON.Vector3(0, 0, size);
            zCone.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
            zCone.material = new BABYLON.StandardMaterial("matZ", scene);
            zCone.material.emissiveColor = new BABYLON.Color3(0, 0, 1.0);
            zCone.material.diffuseColor = new BABYLON.Color3(0, 0, 1.0);
        };
    
        showAxis(5);

        this.scene = scene;
    }
}

/*
class that describes an asset
*/
class Asset 
{
    /*
    id: str - id of the asset
    name:str - name of the asset
    media_type:num (0-4) - media type according to official API
    scene, camera, renderer - passed from Slide
    options: { media_desc:string, billboard:boolean, hidden:boolean, url:string, loader:GLTFLoader,
              position:{x:num, y:num, z:num}, rotation{x:num, y:num, z:num}, scale:num }
    options.loader - passed from Slide
    */
    constructor(id, name, media_type, scene, options) 
    {
        this.id = id;
        this.name = name;
        this.media_type = media_type;
        this.media_desc = options.media_desc;
        this.url = options.url;

        this.hidden = options.hidden;
        this.billboard = options.billboard;

        this.loadObject(scene, options);

        this.setScale(options.scale),
        
        this.setPosition({
            x: options.position.x,
            y: options.position.y,
            z: options.position.z
        }),
        this.setOrientation({
            x: options.rotation.x,
            y: options.rotation.y,
            z: options.rotation.z
        }),
        this.setTransparent(options.hidden)
    }

    /*
    sets position for this.model. this.model must be loaded beforehand. called from constructor
    args: { x:num, y:num, z:num } - not optional. to update, all must be passed
    */
    setPosition(args) 
    {
        this.model.position.x = -args.x;
        this.model.position.y = args.y;
        this.model.position.z = args.z;

        if (this.media_type == TEXT)
        {
            this.model.position.y += 0.1;
        }
        else if (this.media_type == IMAGE)
        {
            this.model.position.y += 0.5;
        }
    }

    /*
    sets orientation for this.model; this.model must be loaded beforehand. called form constructor
    args: { x:num, y:num, z:num } - not optional. to update, all must be passed
    */
    setOrientation(args) 
    {
        if (this.billboard) 
        {
            if (this.media_type == IMAGE) 
            {  
                this.model.rotation.x = - Math.PI/2;
                this.model.rotation.y = 0;
                this.model.rotation.z = 0;
                return;
            }
            else if(this.media_type == TEXT)
            {
                this.model.rotation.x = args.x * Math.PI/180 - Math.PI/2;
                this.model.rotation.y = args.y * Math.PI/180;
                this.model.rotation.z = args.z * Math.PI/180;
                return;
            }
        }

        var old_x = this.model.rotation.x;
        var old_y = this.model.rotation.y;
        var old_z = this.model.rotation.z;

        this.model.rotation.x = args.x * Math.PI/180;
        this.model.rotation.y = args.y * Math.PI/180;
        this.model.rotation.z = args.z * Math.PI/180;
        
        if (this.media_type == TEXT)
        {
            this.model.rotation.x -= Math.PI/2;
            this.model.rotation.z += Math.PI;
        }
        else if (this.media_type == IMAGE) 
        {
            this.model.rotation.y += Math.PI;
        }   
        else if (this.media_type == TDMODEL)
        {
            this.model.rotate(BABYLON.Axis.X, this.model.rotation.x-old_x, BABYLON.Space.LOCAL);
            this.model.rotate(BABYLON.Axis.Y, this.model.rotation.y-old_y, BABYLON.Space.LOCAL);
            this.model.rotate(BABYLON.Axis.Z, this.model.rotation.z-old_z, BABYLON.Space.LOCAL);
        }
    }

    setScale(value) 
    {
        this.model.scaling.x = value;
        this.model.scaling.y = value;
        this.model.scaling.z = value;
    }

    setTransparent(hidden)
    {
        if (hidden)
        {
            if (this.media_type == IMAGE || this.media_type == TEXT)
            {
                this.modelMaterial.alpha = 0.5;
            }

            if(this.media_type == TDMODEL)
            {
                this.model.visibility = 0.5;
                this.modelMaterial.alpha = 0.5;
            }
        }
        else
        {
            if (this.media_type == IMAGE)
            {
                this.modelMaterial.alpha = 1.0;
            }

            if(this.media_type == TDMODEL)
            {
                this.model.visibility = 1.0;
                this.modelMaterial.alpha = 1.0;
            }

        }
    }

    /*
    called from constructor. loads an object according to this.media_type
    scene - passed from constructor
    options: { url, loader }
    options.url - for images and 3d models
    options.loader - for 3d models
    */
    loadObject(scene) 
    {
        switch (this.media_type)
        {
            case TEXT:
                this.loadText(scene);
                break;
            case IMAGE:
            case AUDIO:
            case VIDEO:
                this.loadImage(scene);
                break;
            case TDMODEL: 
                this.load3DObject(scene);
                break;
        }
    }

    loadText(scene) 
    {
        var ground = BABYLON.Mesh.CreateGround("ground", 8, 6, 2, scene, true);
        // GUI
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(ground, 1024, 1024, true, true);

        ground.emissiveTexture = advancedTexture;
        var text1 = new GUI.TextBlock();
        text1.text = this.media_desc;
        text1.color = "black";
        text1.fontSize = 40;
        advancedTexture.addControl(text1);

        if (this.billboard)
        {
            ground.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        }

        this.model = ground;
    }

    loadImage(scene) 
    {
        var asset = this; 

        var img = new Image();
        img.onload = function()
        {
            loadImgPlane(this.height, this.width, asset);
        }
        img.src = asset.url;

        function loadImgPlane(h, w, asset)
        {
            var mat = new BABYLON.StandardMaterial("material", scene);
            mat.diffuseTexture = new BABYLON.Texture(asset.url, scene);
            mat.diffuseTexture.hasAlpha = true;
            mat.backFaceCulling = false;
            asset.modelMaterial = mat;
            asset.img_width = w;
            asset.img_height = h;

            var plane = new BABYLON.MeshBuilder.CreatePlane(asset.name, {height: 1.0, width: w / h}, scene);
            plane.updatable = true;
            plane.material = mat;

            if (asset.billboard)
            {
                mat.backFaceCulling = true;
                plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            }
            asset.model = plane;
        }
    }

    load3DObject(scene) 
    {
        var asset = this;

        var base64_model_content = asset.url;
        var raw_content = BABYLON.Tools.DecodeBase64(base64_model_content);
        var blob = new Blob([raw_content]);
        var url = URL.createObjectURL(blob);

        BABYLON.SceneLoader.LoadAssetContainer("", url, scene, function (container) 
        {
            asset.model = container.meshes[0];
            asset.modelMaterial = container.materials[0];

            container.addAllToScene();
        }, undefined, undefined, ".glb");
    }
}

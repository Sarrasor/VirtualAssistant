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

    function isPresent(id) {
        for (let i = 0; i < slide.assets.length; i++)
            if (slide.assets[i].id == id)
                return slide.assets[i];
        console.log("is not present");
        return null;
    }

    // function checkDeleted(){

    //     }
    // }


    // if assets and/or files are empty, empty scene will appear
    if (!assets || assets.length == 0 || (assets.length == 1 && assets[0].media.url == "" && assets[0].media_desc == "")) {
        console.log("assets empty");
        return slide;
    }

    for (let ai = 0; ai < assets.length; ai++) {
        let asset = assets[ai];
        var file = null;
        if (asset.media.url != "")
            file = findFile(assets[ai].media.url, files);

        var existing_asset = isPresent(asset.id);
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
        // this.createEngine();
        this.createScene();
        // this.createGrid();
        // this.createCamera();
        // this.createLight();

        // array of assets for the slide. each new asset is pushed there
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
        if (existing_asset == null) {
            console.log("creating new asset");
            var new_obj = new Asset(id, name, media_type, this.scene, {
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
        else {
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
        }
    }

    /*
    id: string
    returns an index of asset with asset.id=id
    */
    findAssetById(id) {
        for (let i = 0; i < this.assets.length; i++)
            if (this.assets[i].id == id)
                return i
    }

    /*
    name:str - name of an existing asset which is to be updated
    options: { media_desc:string, billboard:boolean, hidden:boolean,
              position:{x:num, y:num, z:num}, rotation{x:num, y:num, z:num}, scale:num }
    if some of the options are not updated, they are left as they were
    you can't update media_type or url
    */
    // updateAsset(name, options) {
    //     let index = this.findAssetByName(name);

    //     if (options === undefined) options = {};

    //     let asset = this.assets[index];
    //     asset.name = options.name || asset.name;
    //     asset.media_desc = options.media_desc || asset.media_desc;

    //     // undefined || false returns false and undefined || true returns true so it's valid
    //     asset.hidden = options.hidden || asset.hidden;
    //     asset.billboard = options.billboard || asset.billboard;

    //     asset.setPosition({
    //         x: options.position.x || asset.model.position.x,
    //         y: options.position.y || asset.model.position.y,
    //         z: options.position.z || asset.model.position.z
    //     });
    //     asset.setOrientation({
    //         x: options.rotation.x || asset.model.rotation.x,
    //         y: options.rotation.y || asset.model.rotation.y,
    //         z: options.rotation.z || asset.model.rotation.z
    //     });
    //     asset.setScale(options.scale || asset.model.scale.x);
    // }

    /*
    finds a needed asset by its name
    name: str - name of the object
    if found returns index of the asset from this.assets, otherwise returns (-1)
    */
    findAssetByName(name) {
        let i;
        for (i = 0; i < this.assets.length; i++) {
            if (this.assets[i].name == name)
                return i;
        }
        return -1;
    }

    /*
    name:str - name of the asset to be deleted
    */
    // deleteAsset(id) {
    //     let asset = this.findAssetById(id);
    //     this.assets.splice(index);
    // }

    // from here, all the functions that belong to the class Slide play technical role only
    // and must not be called from outside of class Asset
    createScene() {
        // this.scene = new BABYLON.Scene(this.engine);
        // this.scene.clearColor = new BABYLON.Color3(0.5, 0.6, 0.6);
        // console.log("created Scene");

        var engine = new BABYLON.Engine(this.node, false, { preserveDrawingBuffer: true, stencil: true });
        var scene = new BABYLON.Scene(engine);

        scene.createDefaultCameraOrLight(true, true, true);
        // this.scene.activeCamera.useAutoRotationBehavior = true;
        scene.activeCamera.beta -= 0.2;
        scene.activeCamera.upperBetaLimit = Math.PI / 2.1;
        scene.activeCamera.lowerRadiusLimit = 10;
        scene.activeCamera.upperRadiusLimit = 100;

        scene.lights[0].dispose();
        var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-2, -3, 1), scene);
        light.position = new BABYLON.Vector3(6, 9, 3);
        light.intensity = 1;

        new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);

        var generator = new BABYLON.ShadowGenerator(512, light);
        generator.useBlurExponentialShadowMap = true;
        generator.useKernelBlur = true;
        generator.blurKernel = 12;
        generator.forceBackFacesOnly = true;
        new BABYLON.Color3(10, .5, .5);

        var helper = scene.createDefaultEnvironment({
            groundShadowLevel: -1,
        });

        helper.setMainColor(BABYLON.Color3.White());

        engine.runRenderLoop(function () {
            scene.render();
        });
        this.scene = scene;
    }

    // createGrid() {
    //     this.ground = BABYLON.Mesh.CreateGround("ground", 40, 40, 40, this.scene);
    //     // var grid = new BABYLON.GridMaterial("grid", this.scene);
    //     // grid.gridRatio = 0.1;
    //     // grid.majorUnitFrequency = 2;
    //     // this.plane.material = grid;
    // }

    // createCamera() {
    //     this.camera = new BABYLON.ArcRotateCamera("Camera", 10, 10, 50, new BABYLON.Vector3.Zero(), this.scene);
    //     // This targets the camera to scene origin
    //     this.camera.setTarget(BABYLON.Vector3.Zero());
    //     // This attaches the camera to the node
    //     this.camera.attachControl(this.node, true);
    // }

    // createLight() {
    //     // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    //     this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    //     // Default intensity is 1. Let's dim the light a small amount
    //     this.light.intensity = 0.7;
    // }
}

/*
class that describes an asset
*/
class Asset {
    /*
    id: str - id of the asset
    name:str - name of the asset
    media_type:num (0-4) - media type according to official API
    scene, camera, renderer - passed from Slide
    options: { media_desc:string, billboard:boolean, hidden:boolean, url:string, loader:GLTFLoader,
              position:{x:num, y:num, z:num}, rotation{x:num, y:num, z:num}, scale:num }
    options.loader - passed from Slide
    */
    constructor(id, name, media_type, scene, options) {
        // if (options === undefined) options = {};
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
            this.setTransparent()
    }

    /*
    sets position for this.model. this.model must be loaded beforehand. called from constructor
    args: { x:num, y:num, z:num } - not optional. to update, all must be passed
    */
    setPosition(args) {
        this.model.position.x = args.x;
        this.model.position.y = args.y;
        this.model.position.z = args.z;
    }

    setScale(value) {
        this.model.scaling.x = value;
        this.model.scaling.y = value;
        this.model.scaling.z = value;
    }

    /*
    sets orientation for this.model; this.model must be loaded beforehand. called form constructor
    args: { x:num, y:num, z:num } - not optional. to update, all must be passed
    */
    setOrientation(args) {
        this.model.rotation.x = args.x;
        this.model.rotation.y = args.y;
        this.model.rotation.z = args.z;
    }

    setTransparent(alpha) {
        if (this.hidden)
            this.modelMaterial.alpha = alpha;
    }

    /*
    called from constructor. loads an object according to this.media_type
    scene - passed from constructor
    options: { url, loader }
    options.url - for images and 3d models
    options.loader - for 3d models
    */
    loadObject(scene) {
        switch (this.media_type) {
            case TEXT:
                this.loadText(scene);
                break;
            case IMAGE:
            case AUDIO:
            case VIDEO:
                this.loadImage(scene);
                break;
            case TDMODEL: {
                this.load3DObject(scene);
                break;
            }
        }
    }

    loadText(scene) {
        console.log("loading text");
        var ground = BABYLON.Mesh.CreateGround("ground", 8, 6, 2, scene, true);
        // GUI
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(ground, 1024, 1024, true, true);

        ground.emissiveTexture = advancedTexture;
        // var material = BABYLON.StandardMaterial("material", scene);
        // ground.material = material;
        // ground.material.alpha = true;
        var text1 = new GUI.TextBlock();
        text1.text = this.media_desc;
        text1.color = "black";
        text1.fontSize = 18;
        advancedTexture.addControl(text1);
        if (this.billboard)
            ground.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        this.model = ground;
    }

    loadImage(scene) {
        var mat = new BABYLON.StandardMaterial("material", scene);
        mat.diffuseTexture = new BABYLON.Texture(this.url, scene);
        mat.diffuseTexture.hasAlpha = true;
        mat.backFaceCulling = false;
        this.modelMaterial = mat;

        var plane = new BABYLON.MeshBuilder.CreatePlane(this.name, {size:1}, scene);
        plane.updatable = true;
        plane.material = mat;
        if (this.billboard) {
            mat.backFaceCulling = true;
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        }
        this.model = plane;
    }

    load3DObject(scene) {
        BABYLON.SceneLoader.Append(this.name, "blob:http://localhost:8080/", this.url, scene, function (meshes) {
            this.model = meshes[0];
            // scene.beforeRender = () => {
            //     this.model.rotation.y += 0.01;
            // };
        });

    }
}

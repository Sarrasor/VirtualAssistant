// latest updates: https://github.com/annwhoorma/3d-display
// import * as THREE from "./render/three.js";

// https://threejs.org/build/three.js

// import * as OrbitControls from "./render/OrbitControls.js";
// https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/controls/OrbitControls.js
// npm i --sace three-gltf-loader

// import * as GLTFLoader from "./render/GLTFLoader.js";
// https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/loaders/GLTFLoader.js
// npm i --save three-gltf-loader

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/*
init function that should be called on slide creation

node: node that scene will be put on (example: div)
assets: JSON object. example - assets.json
files: JSON object. example - files.json

if assets or/and files are empty, empty scene will appear
files[j] is related to assets[i] iff assets[i].media.url === files[j].name
*/
export function init(node, assets, files) {
    function findFileByName(name, files) {
        if (!files || files.length == 0)
            return -1;
        for (let i = 0; i < files.length; i++) {
            if (files[i].name.localeCompare(name) == 0) {
                return files[i];
            }
        }
        return -1;
    }
    let slide = new Slide(node);

    // if assets and/or files are empty, empty scene will appear
    if (!assets || assets.length == 0) {
        return slide;
    }

    for (let ai = 0; ai < assets.length; ai++) {
        let asset = assets[ai];
        let temp_file = findFileByName(assets[ai].media.url, files);
        let file = (temp_file == -1) ? null : temp_file;
        slide.createAsset(asset.name, file ? file.type : 0, {
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


/*
class that describes a slide from instruction
*/
class Slide {
    /*
    sets up everything that is needed to display the scene

    node: node that scene will be put on (example: div)
    */
    constructor(node) {
        this.node = node;
        this.createScene();
        this.createRenderer();
        this.createCamera();

        this.createSoftLight();
        this.createDirectionalLight();

        // ability to rotate the camera with the mouse
        this.createOrbitControls();
        // loader for .glft and .glb
        this.createLoader();
        // array of assets for the slide. each new asset is pushed there
        this.assets = [];
    }

    /*
    name:str - name of the newly created asset
    media_type:num -
    options: { media_desc:string, billboard:boolean, hidden:boolean, url:string,
              position:{x:num, y:num, z:num}, rotation{x:num, y:num, z:num}, scale:num }
    */
    createAsset(name, media_type, options) {
        if (options === undefined) options = {};
        console.log("creating new object");
        var new_obj = new Asset(name, media_type, this.scene, this.camera, this.renderer, {
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
            billboard: options.billboard,
            loader: this.loader,
        });
        this.assets.push(new_obj);
        console.log("pushed an object. length: " + this.assets.length);
        return this.assets.length - 1;
    }

    /*
    name:str - name of an existing asset which is to be updated
    options: { media_desc:string, billboard:boolean, hidden:boolean,
              position:{x:num, y:num, z:num}, rotation{x:num, y:num, z:num}, scale:num }
    if some of the options are not updated, they are left as they were

    you can't update media_type or url
    */
    updateAsset(name, options) {
        let index = this.findAssetByName(name);

        if (options === undefined) options = {};

        let asset = this.assets[index];
        asset.name = options.name || asset.name;
        asset.media_desc = options.media_desc || asset.media_desc;

        // undefined || false returns false and undefined || true returns true so it's valid
        asset.hidden = options.hidden || asset.hidden;
        asset.billboard = options.billboard || asset.billboard;

        asset.setPosition({
            x: options.position.x || asset.model.position.x,
            y: options.position.y || asset.model.position.y,
            z: options.position.z || asset.model.position.z
        });
        asset.setOrientation({
            x: options.rotation.x || asset.model.rotation.x,
            y: options.rotation.y || asset.model.rotation.y,
            z: options.rotation.z || asset.model.rotation.z
        });
        asset.setScale(options.scale || asset.model.scale.x);
    }

    /*
    new_name:str - name that will be assigned to the duplicated asset
    media_type:num (0-4) - media type according to official API
    name:str - name of the object to be duplicated
    */
    // name - new name, asset - asset to be duplicate
    duplicateAsset(new_name, media_type, name) {
        let index = this.findAssetByName(name);
        let asset = this.assets[index];
        return this.createAsset(new_name, media_type, this.scene, this.camera, this.renderer, {
            media_desc: asset.media_desc,
            billboard: asset.billboard,
            hidden: asset.hidden,
            url: asset.url,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: asset.model.rotation.x,
                y: asset.model.rotation.y,
                z: asset.model.rotation.z
            },
            scale: asset.model.scale.x
        });
    }

    /*
    finds a needed asset by its name

    name: str - name of the object
    if found returns index of the asset from this.assets, otherwise returns (-1)
    */
    findAssetByName(name) {
        let i;
        for (i = 0; i < this.assets.length; i++) {
            if (this.assets[i].name.localeCompare(name) == 0)
                return i;
        }
        return -1;
    }

    /*
    name:str - name of the asset to be deleted
    */
    deleteAsset(name) {
        let index = this.findAssetByName(name);
        this.assets.splice(index);
    }


    // from here, all the functions that belong to the class Slide play technical role only
    // and must not be called from outside of class Asset
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('gray');
        this.scene.add(new THREE.AxesHelper(400));
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
        this.camera.position.set(40, 20, 50);
    }

    createSoftLight() {
        var light = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light);
    }

    createDirectionalLight() {
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.node.offsetWidth, this.node.offsetHeight);
        // has to be enabled to display .gltf objects
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.node.appendChild(this.renderer.domElement);
    }

    createLoader() {
        this.loader = new GLTFLoader();
        console.log("created loader");
    }

    createOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
}


/*
class that describes an asset
*/
class Asset {
    /*
    name:str - name of the asset
    media_type:num (0-4) - media type according to official API
    scene, camera, renderer - passed from Slide
    options: { media_desc:string, billboard:boolean, hidden:boolean, url:string, loader:GLTFLoader,
              position:{x:num, y:num, z:num}, rotation{x:num, y:num, z:num}, scale:num }
    options.loader - passed from Slide
    */
    constructor(name, media_type, scene, camera, renderer, options) {
        if (options === undefined) options = {};
        this.name = name;
        this.media_type = media_type;
        this.media_desc = options.media_desc;

        this.hidden = options.hidden;
        this.billboard = options.billboard;

        this.model = new THREE.Object3D();
        this.loadObject(scene, options);

        var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        setTimeout(() => {
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
        }, 200);
    }

    /*
    sets position for this.model. this.model must be loaded beforehand. called form constructor
    args: { x:num, y:num, z:num } - not optional. to update, all must be passed
    */
    setPosition(args) {
        this.model.position.x = args.x;
        this.model.position.y = args.y;
        this.model.position.z = args.z;
    }


    setScale(value) {
        if (this.media_type == 0)
            this.model.scale.set(value, value / 2, 1);
        else if (this.media_type == 4)
            this.model.scale.set(value, value, value);
        // 1, 2, 3 - pictures
        else if (this.billboard)
            this.model.scale.set(value * 100, value * 100, 1);
        else
            this.model.scale.set(value * 0.2, value * 0.2, 1);
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

    /*
    called from constructor. loads an object according to this.media_type

    scene - passed from constructor
    options: { url, loader }
    options.url - for images and 3d models
    options.loader - for 3d models
    */
    loadObject(scene, options) {
        switch (this.media_type) {
            case 0:
                this.decideText(scene);
                break;
            case 1:
            case 2:
            case 3:
                this.decideImage(scene, options.url);
                break;
            case 4: {
                this.load3DObject(scene, options.loader, options.url);
                break;
            }
        }
    }


    // from here, all the functions that belong to the class Asset play technical role only
    // and must not be called from outside of class Asset
    decideText(scene) {
        if (this.billboard)
            this.loadTextSprite(this.media_desc, {
                fontsize: 14
            });
        else
            this.loadText(this.media_desc, {
                fontsize: 14
            });

        scene.add(this.model);
    }

    decideImage(scene, url) {
        console.log("rendering image")
        if (this.billboard)
            this.loadPictureSprite(url);
        else
            this.loadPicture(url);
        scene.add(this.model);
    }

    load3DObject(scene, loader, url) {
        const onLoad = (gltf) => {
            this.model = gltf.scene;
            scene.add(this.model);
        };
        const onProgress = () => { };
        const onError = (errorMessage) => {
            console.log(errorMessage);
        };

        loader.load(url, gltf => onLoad(gltf), onProgress, onError);
    }

    loadText(message, options) {
        if (options === undefined) options = {};

        let fontface = (fontface in options) ?
            options.fontface : "Arial";

        let fontsize = (fontsize in options) ?
            options.fontsize : 20;

        let borderThickness = (borderThickness in options) ?
            options.borderThickness : 10;

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        // canvas.width = 400;     // Set canvas width
        // canvas.height = 400;    // Set canvas height
        context.font = "Bold " + fontsize + "px " + fontface;

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        let texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        let material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        material.transparent = true;

        this.model = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height),
            material
        );
    }

    loadTextSprite(message, options) {
        if (options === undefined) options = {};

        let fontface = (fontface in options) ?
            options.fontface : "Arial";

        let fontsize = (fontsize in options) ?
            options.fontsize : 20;

        let borderThickness = (borderThickness in options) ?
            options.borderThickness : 10;

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = 512; // Set canvas width
        canvas.height = 512; // Set canvas height
        context.font = "Bold " + fontsize + "px " + fontface;

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        let spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
        });
        this.model = new THREE.Sprite(spriteMaterial);
        // sprite.scale.set(100, 50, 1.0);
    }

    loadPicture(url) {
        // create a canvas element
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        canvas.width = 400; // Set canvas width
        canvas.height = 400; // Set canvas height

        // canvas contents will be used for a texture
        let texture = new THREE.Texture(canvas);

        // load an image
        let imageObj = new Image();
        imageObj.src = url;
        // after the image is loaded, this function executes
        imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
            texture.needsUpdate = true;
        };

        let material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        material.transparent = true;

        this.model = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height),
            material
        );
    }

    loadPictureSprite(url) {
        let spriteMap = new THREE.TextureLoader().load(url);
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap
        });
        this.model = new THREE.Sprite(spriteMaterial);

        // // create a canvas element
        // let canvas = document.createElement('canvas');
        // let context = canvas.getContext('2d');

        // canvas.width = 400; // Set canvas width
        // canvas.height = 400; // Set canvas height

        // // canvas contents will be used for a texture
        // let texture = new THREE.Texture(canvas);
        // texture.needsUpdate = true;

        // // load an image
        // let imageObj = new Image();
        // imageObj.src = url;
        // // after the image is loaded, this function executes
        // imageObj.onload = function () {
        //     context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        //     texture.needsUpdate = true;
        // };

        // let spriteMaterial = new THREE.SpriteMaterial({
        //     map: texture
        // });

        // this.model = new THREE.Sprite(spriteMaterial);
    }

    setTransparent(hidden, alpha) {
        if (this.model.isMesh && hidden) this.model.material.alphaTest = alpha;
    }
}

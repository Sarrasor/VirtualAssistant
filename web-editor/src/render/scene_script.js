import * as THREE from "./three";
import * as OrbitControls from "./OrbitControls";
import * as GLTFLoader from "./GLTFLoader";


/*
init function that should be called on slide creation

container: container that scene will be put on
assets: JSON object. example - assets.json
files: JSON object. example - files.json

files[j] is related to assets[i] iff assets[i].media.url === files[j].name
*/

export function init(container, assets, files) {
    var slide = new Slide(container);
    var i;
    for (i = 0; i < assets.length; i++) {
        var asset = assets[i];
        var file = files.find(f => f.name === assets[i].media.url);
        createAsset(asset.name, file.type, {
            media_desc: asset.description,
            position: {
                x: asset.transform.position.x,
                y: asset.transform.position.y,
                z: asset.transform.position.z,
            },
            rotation: {
                x: asset.transform.rotation.x,
                y: asset.transform.rotation.y,
                z: asset.transform.rotation.z,
            },
            scale: asset.transform.scale,
            billboard: asset.billboard,
            hidden: asset.hidden,
            url: file.content
        });
    }
    slide.animate();
    return slide;
}

/*
class that describes one slide from instruction
*/
export class Slide {
    /*
    sets up everything that is needed to display the scene
    */
    constructor(container) {
        this.container = container;
        this.createScene();
        this.createRenderer();
        this.createCamera();

        this.createSoftLight();
        this.createDirectionalLight();

        // ability to rotate the camera with the mouse
        this.createOrbitControls();
        // loader for .glft and .glb
        this.createLoader();
        // array of assets for the slide
        this.assets = [];
    }

    /*

    */
    // options: media_desc, billboard, hidden, url, position, rotation, scale
    createAsset(name, media_type, options) {
        if (options === undefined) options = {};
        let new_obj;
        switch (media_type) {
            case "0":
                new_obj = new Asset(name, media_type, this.scene, {
                    media_desc: options.media_desc,
                    billboard: options.billboard
                });
                break;
            case "1":
            case "2":
            case "3":
                new_obj = new Asset(name, media_type, this.scene, {
                    media_desc: options.media_desc || "",
                    url: options.url,
                    billboard: options.billboard
                });
                break;
            case "4":
                new_obj = new Asset(name, media_type, this.scene, {
                    media_desc: options.media_desc || "",
                    hidden: options.hidden || "false",
                    url: options.url,
                    gltf_loader: this.loader
                });
                break;
        }
        this.assets.push(new_obj);
        return this.asset.length - 1;
    }

    /*

    */
    // options: media_type, media_desc, hidden, billboard, position, rotation, scale
    updateAsset(name, options) {
        var index = this.findByName(name);
        if (index == -1)
            throw "Asset doesn't exist!";

        if (options === undefined) options = {};

        var asset = assets[index];
        asset.name = options.name || asset.name;
        asset.media_type = options.media_type || asset.media_type;
        asset.media_desc = options.media_desc || asset.media_desc;
        asset.billboard = options.billboard || asset.billboard;
        hid = options.hidden || asset.hidden;
        asset.setHidden(hid);
        // asset.updateModel(model); // to be implemented. maybe
        asset.model.position = asset.setPosition(options.position || {});
        asset.model.rotation = asset.setRotation(options.rotation || {});
        asset.setScale(options.scale || asset.getScale);
    }

    /*

    */
    // name - new name, asset - asset to be duplicate
    duplicateAsset(name, asset) {
        var index = this.findByName(name);
        if (index == -1)
            throw "Asset doesn't exist!";

        return this.createAsset(asset.name, asset.media_type, {
            media_desc: asset.media_desc,
            hidden: asset.hidden,
            url: asset.url
        });
    }

    /*

    */
    // finds a needed asset by its name
    // if found, returns an index of this asset, otherwise returns (-1)
    findByName(name) {
        let i;
        for (i = 0; i < len(this.assets); i++) {
            if (this.assets[i].name.localeCompare(name) == 0)
                return i;
        }
        return -1;
    }

    /*

    */
    // name - name of the asset to be deleted
    deleteAsset(name) {
        var index = this.findByName(name);
        if (index == -1)
            throw "Asset doesn't exist!";
        this.assets.splice(index);
    }

    /*

    */
    // dont read
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('gray');
    }

    /*

    */
    // dont read
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
        this.camera.position.set(10, 10, 10);
    }

    /*

    */
    // dont read
    createSoftLight() {
        var light = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light);
    }

    /*

    */
    // dont read
    createDirectionalLight() {
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
    }

    /*

    */
    // dont read
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, container.innerHeight); // not sure about "window"
        // has to be enabled to display .gltf objects
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(renderer.domElement);
    }

    /*

    */
    // dont read
    createLoader() {
        this.loader = new GLTFLoader();
    }

    /*

    */
    // dont read
    createOrbitControls() {
        this.controls = new OrbitControls(camera, renderer.domElement);
    }


    /*

    */
    animate() {
        requestAnimationFrame(animate);
        this.renderer.render(this.scene, this.camera);
    }
}


/*

*/
export class Asset {
    // initialization of an asset. name, media_type and scene are obligatory
    // options: media_desc, hidden, billboard, url, gltf_loader
    // ! hidden must be a string
    constructor(name, media_type, scene, options) {
        if (options === underfined) options = {};
        this.name = name;
        this.media_type = media_type;
        this.media_desc = media_desc;
        if (!(hidden === undefined)) this.setHidden(options.hidden);
        this.renderObject(options);
        this.addToScene(scene);
    }

    /*

    */
    // dont read
    // options: url, loader, hidden, position, rotation, scale
    renderObject(options) {
        switch (this.media_type) {
            case "0":
                this.renderText(options.billboard);
                break;
            case "1":
            case "2":
            case "3":
                this.renderImage(options.url, options.billboard);
                break;
            case "4": {
                this.render3DObject(options.loader, options.url);
                this.model.setPosition(options.position || {
                    x: 0,
                    y: 0,
                    z: 0
                });
                this.model.setRotation(options.rotation || {
                    x: 0,
                    y: 0,
                    z: 0
                });
                this.model.setScale(options.scale);
                this.model.setTransparent(options.hidden);
            }
        }
    }

    /*

    */
    // dont read
    renderText(billboard) {
        if (billboard)
            this.model = this.loadTextSprite(this.media_desc, {
                fontsize: 14
            });
        else
            this.model = this.loadText(this.media_desc, {
                fontsize: 14
            });
    }

    /*

    */
    // dont read
    renderImage(url, billboard) {
        if (billboard)
            this.model = this.loadPictureSprite(url);
        else
            this.model = this.loadPicture(url);
    }

    /*

    */
    // dont read
    load3DObject(loader, url) {
        loader.load(url, gltf => {
            scene.add(gltf.scene);
            model = gltf.scene.children[0];
            // model.scale.set(10,10,10);
            renderer.render(scene, camera)
        }, undefined,
            error => {
                console.log(error);
            });
    }

    /*

    */
    loadText(message, options) {
        if (options === undefined) options = {};

        var fontface = fontface in options ?
            options.fontface : "Arial";

        var fontsize = fontsize in options ?
            options.fontsize : 30;

        var borderThickness = borderThickness in options ?
            options.borderThickness : 10;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        // canvas.width = 400;     // Set canvas width
        // canvas.height = 400;    // Set canvas height
        context.font = "Bold " + fontsize + "px " + fontface;

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        material.transparent = true;

        var mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height),
            material
        );
        return mesh;
    }

    /*

    */
    loadTextSprite(message, options) {
        if (options === undefined) options = {};

        var fontface = fontface in options ?
            options.fontface : "Arial";

        var fontsize = fontsize in options ?
            options.fontsize : 20;

        var borderThickness = borderThickness in options ?
            options.borderThickness : 10;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        // canvas.width = 400;     // Set canvas width
        // canvas.height = 400;    // Set canvas height
        context.font = "Bold " + fontsize + "px " + fontface;

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            useScreenCoordinates: false
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        // sprite.scale.set(100, 50, 1.0);
        return sprite;
    }

    /*

    */
    loadPicture(url) {
        // create a canvas element
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);

        // load an image
        var imageObj = new Image();
        imageObj.src = url;
        // after the image is loaded, this function executes
        imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0, imageObj.width * 0.09, imageObj.height * 0.09);
            texture.needsUpdate = true;
        };

        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        material.transparent = true;

        var mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width, canvas.height),
            material
        );
        return mesh;
    }

    /*

    */
    loadPictureSprite(url) {
        var spriteMap = new THREE.TextureLoader().load(url);
        var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
        var sprite = new THREE.Sprite(spriteMaterial);
        // sprite.scale.set(50,50,50);
        return sprite;
    }


    /*

    */
    // dont read
    setHidden(value) {
        if (value === undefined)
            this.hidden = false;
        if (value === "true")
            this.hidden = true;
        else if (value === "false")
            this.hidden = false;
        else
            throw "Hidden flag must be either true or false!"
    }

    /*

    */
    // args: x, y, z. all optional
    setPosition(args) {
        args = args || {};
        this.model.position.x = args.x || this.model.position.x;
        this.model.position.y = args.y || this.model.position.y;
        this.model.position.z = args.z || this.model.position.z;
    }

    /*

    */
    // args: x, y, z. all optional
    setRotation(args) {
        args = args || {};
        this.model.rotation.x = args.x || this.model.rotation.x;
        this.model.rotation.y = args.y || this.model.rotation.y;
        this.model.rotation.z = args.z || this.model.rotation.z;
    }

    /*

    */
    // args: x, y, z. all optional
    getPosition() {
        return this.model.position;
    }

    /*

    */
    // args: x, y, z. all optional
    getRotation() {
        return this.model.rotation;
    }

    /*

    */
    // value - one value
    setScale(value) {
        this.model.scale.set(value, value, value);
    }

    /*

    */
    // returns float - our current scale
    getScale() {
        return this.model.scale.x;
    }

    /*

    */
    // dont read
    addToScene(scene) {
        scene.add(this.model);
    }

    /*

    */
    // dont read
    setTransparent(hidden, alpha) {
        if (hidden) this.model.material.alphaTest = alpha;
    }
}

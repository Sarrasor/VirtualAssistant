
var createScene = function() {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, false);
	
// 	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 5), scene);
//   light.intensity = 1;
    var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(10, 10, 10), scene);
    light2.intensity = 1;

    // var pl = new BABYLON.PointLight("pl", BABYLON.Vector3.Zero(), scene);
    // pl.diffuse = new BABYLON.Color3(1, 1, 1);
    // pl.specular = new BABYLON.Color3(1, 1, 1);
    // pl.intensity = 0.8;
    
    var mat = new BABYLON.StandardMaterial("dog", scene);
    mat.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/8/87/Alaskan_Malamute%2BBlank.png", scene);
    mat.diffuseTexture.hasAlpha = true;
    mat.backFaceCulling = false;
    // var box = BABYLON.MeshBuilder.CreateBox("box", {size:2}, scene);
    // box.updatable = true;
    // box.scaling.x = 5;
    var plane = new BABYLON.MeshBuilder.CreatePlane("plane", {size:1},scene);
    plane.updatable = true;
    plane.material = mat;
    
    // plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    plane.scaling.x = 4;
    // box.material = mat;

	return scene;
};









var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;



    // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    // sphere.position.y = 0;    



    //Line spacing with percentage
        var plane = BABYLON.Mesh.CreateGround("ground2", 26, 26, 2, scene);        
        plane.rotation = new BABYLON.Vector3(5, 0, 0);
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane, 1024, 1024);    

        var text = new BABYLON.GUI.TextBlock("text");
        text.textWrapping= true;
        text.width = "50px";
        text.height = "500px";    
        text.text = "HEY it s a very very long text over here please wrap me";
        text.color = "white";
        text.fontSize = "14px";
        advancedTexture.addControl(text);

        url = "https://upload.wikimedia.org/wikipedia/commons/8/87/Alaskan_Malamute%2BBlank.png";
        var mat = new BABYLON.StandardMaterial("material", scene);
        mat.diffuseTexture = new BABYLON.Texture(url, scene);
        mat.diffuseTexture.hasAlpha = true;
        mat.backFaceCulling = true;
        modelMaterial = mat;

        var plane = new BABYLON.MeshBuilder.CreatePlane("name", {size:1}, scene);
        plane.updatable = true;
        plane.material = mat;
        // if (this.billboard){
            mat.backFaceCulling = false;
            plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_X;
        // }
        plane.position.x = 1;
        plane.scaling.x = 2;
        model = plane;

    return scene;

};











var camera;
var scene;
var renderer;
var mesh;
var uniforms;
init();
animate();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(150, 150, 150);
    camera.lookAt(0, 0, 0);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-50, -50, 150).normalize();
    scene.add(light);

    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add(ambientLight);
   
    
    
    
    // load textures from image:
    var textLoader = new THREE.TextureLoader();
    textLoader.crossOrigin = '';
    var diffuseTexture = textLoader.load("R2D2/R2D2_Diffuse-Reflection-Combined-small.png");
    var bumpTexture = textLoader.load("R2D2/R2D2_Normal-small.png");
    var emissiveTexture = textLoader.load("R2D2/R2D2_Illumination-small.png");
    var specularTexture = textLoader.load("R2D2/R2D2_Specular-small.png");

    // load model:
    var loader = new THREE.OBJLoader();
    loader.crossOrigin = '';
    loader.load("R2D2/R2D2_Standing.obj", function (model) {
        model.children.forEach(function (child) {
            var material = child.material;

            // basic texture
            material.map = diffuseTexture;

            // bumps
            material.bumpMap = bumpTexture;
            material.bumpScale = 0.3;

            // glow
            material.emissive = new THREE.Color(0xffffff);
            material.emissiveMap = emissiveTexture;

            // specular
            material.specularMap = specularTexture;

            child.receiveShadow = true;
            child.castShadow = true;

            if (child.name === "Head") head = child;
            if (child.name === "Front_Projector") frontP = child;
        });

        model.scale.x = 0.95;
        model.scale.y = 0.95;
        model.scale.z = 0.95;

        model.position.y = -10;
        obj = model;
        scene.add(obj);
        render();
    }); // load
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(renderer.domElement);

   

    window.addEventListener('resize', onWindowResize, false);

    render();
}

function animate() {
    render();
    // Ask the browser to call this function again as soon as possible which is when it is done with render():
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
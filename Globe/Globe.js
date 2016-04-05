var camera;
var scene;
var renderer;
var light;
var material;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-5, -5, 15);
    camera.lookAt(0, 0, 0);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-10, -10, 15).normalize();
    light.lookAt(0, 0, 0);
    scene.add(light);

    var alight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(alight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);


    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(5,  // radius
                                            64, // # segments in width
                                            64);// # segments in height

    // Phong shading: https://en.wikipedia.org/wiki/Phong_shading:
    material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    /*
    var imageObj = new Image()
    imageObj.onload = function () {
        material.map = THREE.ImageUtils.loadTexture(imageObj)
        // or maybe load image into canvas?
    }
    imageObj.crossOrigin = "anonymous"
    imageObj.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Earthmap1000x500.jpg'
    */
    THREE.ImageUtils.crossOrigin = '';
    material.map = THREE.ImageUtils.loadTexture('https://upload.wikimedia.org/wikipedia/commons/a/ac/Earthmap1000x500.jpg');
    material.bumpMap = THREE.ImageUtils.loadTexture('earthbump1k.jpg');
    material.bumpScale = 0.5;
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);


    var Control = function () {
        this.bumpMap = 0.1;
    };
    var control = new Control();
    var gui = new dat.GUI();
    var bcontroller = gui.add(control, 'bumpMap', 0, 1);
    bcontroller.onChange(function (value) {
        // Fires on every change, drag, keypress, etc.
        material.bumpScale = value;
        render();
    });
}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}


init();
render();

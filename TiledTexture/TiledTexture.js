var camera;
var scene;
var renderer;
var light;
var material;
var control;
var nx = 100;
var ny = 100;
var texture;
var T;

function index(ix, iy) {
    return ix * ny + iy;
}



function init() {
    scene = new THREE.Scene();
    var a = window.innerWidth / window.innerHeight;
    //camera = new THREE.OrthographicCamera(-0.7 * a, 0.7 * a, 0.7, -0.7, 1, 1000);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    scene.add( camera );
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 10).normalize();
    light.lookAt(0, 0, 0);
    scene.add(light);

    var alight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(alight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0); // view direction perpendicular to XY-plane
    controls.noRotate = true;
    controls.addEventListener('change', render);

    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneGeometry(1.7, 1, 100, 100);
    var loader = new THREE.TextureLoader();
    loader.load('landscapeLarge.jpg', function (texture) {
        material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture });
        var plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        render();
    });

    var Control = function () {
        
    };
    control = new Control();
    //var gui = new dat.GUI({ width: 500 });
}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}



init();
render();


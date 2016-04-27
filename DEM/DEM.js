var camera;
var scene;
var renderer;
var light;
var material;
var control;
var map;
var elevationTexture;
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-1, -5, 55);
    camera.lookAt(0, 0, 0);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 10).normalize();
    light.lookAt(0, 0, 0);
    scene.add(light);

    var alight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(alight);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);


    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneGeometry(5, 5, 100, 100);


    var uniforms = {
        colorTexture: { type: 't', value: map },
        elevationTexture: { type: 't', value: elevationTexture },
    };
    var smaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,  
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });

    //var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: map });
    var plane = new THREE.Mesh(geometry, smaterial);
    scene.add(plane);

    var Control = function () {
        this.wireframe = false;
    };
    control = new Control();
    var gui = new dat.GUI({ width: 500 });

    gui.add(control, 'wireframe').onChange(function (value) {
        material.wireframe = value;
        render();
    });
}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

var tloader1 = new THREE.TextureLoader();
tloader1.crossOrigin = '';
tloader1.load('MallorcaSatelite2.png', function (texture1) {
    map = texture1;
    var tloader = new THREE.TextureLoader();
    tloader.crossOrigin = '';
    tloader.load('Mallorca.PNG', function (texture) {
        elevationTexture = texture;
        init();
        render();
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
	// Function called when download errors
	function (xhr) {
	    console.log('An error happened');
	});
},
function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (xhr) {
    console.log('An error happened');
});





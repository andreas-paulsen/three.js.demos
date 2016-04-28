var camera;
var scene;
var renderer;
var light;
var material;
var control;
var map;
var elevationTexture;
var plane;

function changeGeometry() {
    if (plane)
        scene.remove(plane);

    var geometry = new THREE.PlaneGeometry(5, 5, control.size, control.size);

    var zmin = 0.0;
    var zmax = 1.0;

    var uniforms = {
        colorTexture: { type: 't', value: map },
        elevationTexture: { type: 't', value: elevationTexture },
        zmin: { type: '1f', value: zmin },
        zmax: { type: '1f', value: zmax }
    };
    var smaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });

    //var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: map });
    plane = new THREE.Mesh(geometry, smaterial);
    scene.add(plane);
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, -2, 5);
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

    

    var Control = function () {
        this.size = 100;
        this.map = "World_Imagery";
    };
    control = new Control();
    var gui = new dat.GUI({ width: 300 });

    gui.add(control, 'size', 10, 400).step(1).onFinishChange(function (value) {
        changeGeometry();
        render();
    });
    gui.add(control, 'map', ['ESRI_Imagery_World_2D', 'NatGeo_World_Map', 'World_Imagery']).onChange(function (value) {
        var mapServer = arcgisServices + value + "/MapServer";
        importMap(mapServer, xmin, ymin, xmax, ymax, wkid, function (info) { loadMap(info.href); });
        render();
    });

}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

function importMap(mapServer, xmin, ymin, xmax, ymax, wkid, callback) {
    var size = 1000;
    var url = mapServer + "/export?"
    url = url + "bbox=" + xmin + "%2C" + ymin + "%2C" + xmax + "%2C" + ymax + "&bboxSR=" + wkid;
    url = url + "&layers=&layerDefs=&size=" + size + "%2C" + size + "&imageSR=" + wkid + "&format=png&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=json";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        var obj = JSON.parse(xhr.response);
        callback(obj);
    }
    xhr.send();
}

var arcgisServices = "http://server.arcgisonline.com/arcgis/rest/services/";
var service = "Ocean/World_Ocean_Base";
//var service = "ESRI_Imagery_World_2D";
var service = "NatGeo_World_Map";
var service = "World_Imagery";

var mapServer = arcgisServices + service +  "/MapServer";

// Mallorca:
var xmin = 3655400;
var xmax = 3760100;
var ymin = 1821000;
var ymax = 1903000;
var wkid = 3035;

init();

function loadElevation() {
    var tloader = new THREE.TextureLoader();
    tloader.crossOrigin = "";
    tloader.load('MallorcaNewer16U.png', function (texture) {
        elevationTexture = texture;
        changeGeometry();
        render();
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
	// Function called when download errors
	function (xhr) {
	    console.log('An error happened');
	});
}

function loadMap(url) {
    var tloader1 = new THREE.TextureLoader();
    tloader1.crossOrigin = "";
    tloader1.load(url, function (texture1) {
        map = texture1;
        loadElevation();
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (xhr) {
        console.log('An error happened');
    });
}

importMap(mapServer, xmin, ymin, xmax, ymax, wkid, function (info) { loadMap(info.href); });

//loadMap('MallorcaSatelite2.png');





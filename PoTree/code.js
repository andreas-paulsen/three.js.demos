var camera;
var scene;
var renderer;
var light;
var material;
var control;
var controls;
var pointcloud;
var clock = new THREE.Clock();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(250, 250, 250);
    camera.lookAt(0, 0, 0);
    //camera.rotation.order = 'ZYX';

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 10).normalize();
    light.lookAt(0, 0, 0);
    scene.add(light);

    var alight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(alight);

    referenceFrame = new THREE.Object3D();
    scene.add(referenceFrame);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls = new Potree.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);


    document.body.appendChild(renderer.domElement);


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

var pointcloudPath = "../potree-1.3/resources/vol_total/cloud.js";
Potree.POCLoader.load(pointcloudPath, function (geometry) {
    pointcloud = new Potree.PointCloudOctree(geometry);
    pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    pointcloud.material.size = 1;
    referenceFrame.add(pointcloud);
    
    // move point cloud to origin:
    referenceFrame.updateMatrixWorld(true);
    var sg = pointcloud.boundingSphere.clone().applyMatrix4(pointcloud.matrixWorld);
    referenceFrame.position.copy(sg.center).multiplyScalar(-1);
    referenceFrame.updateMatrixWorld(true);

    // Flip y and z axis:
    referenceFrame.applyMatrix(new THREE.Matrix4().set(
        1, 0, 0, 0,  // x = x
        0, 0, 1, 0,  // y = z 
        0, 1, 0, 0,  // z = y
        0, 0, 0, 1   // w = w
    ));
    
    render();
});

function update() {
    if (pointcloud) {
        pointcloud.update(camera, renderer);
    }

    controls.update(clock.getDelta());
}

init();

function loop() {
    requestAnimationFrame(loop);

    update();
    render();
};

loop();

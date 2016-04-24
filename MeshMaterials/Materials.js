var camera;
var scene;
var renderer;
var light;
var material;
var control;
var mesh;
var geometry;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-1, -3, 3);
    camera.lookAt(0, 0, 0);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(5, 5, 5).normalize();
    light.lookAt(0, 0, 0);
    scene.add(light);

    

    var alight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(alight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);


    document.body.appendChild(renderer.domElement);

    geometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
    var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    var Control = function () {
        this.wireframe = false;
        this.geometry = 'Cube';
        this.material = "Basic";
    };
    control = new Control();
    var gui = new dat.GUI({ width: 500 });

    gui.add(control, 'wireframe').onChange(function (value) {
        material.wireframe = value;
        render();
    });

    gui.add(control, 'geometry', ['Cube', 'TorusKnot']).onChange(function (value) {
        if (value === 'Cube') {
            mesh.geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        }
        else if (value === 'TorusKnot') {
            mesh.geometry = new THREE.TorusKnotGeometry(1, 0.2, 100, 16);
        }
        render();
    });
    gui.add(control, 'material', ['Basic', 'Lambert', 'Phong']).onChange(function (value) {
        if (value === 'Basic') {
            material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        }
        else if (value === 'Lambert') {
            material = new THREE.MeshLambertMaterial({ color: 0x0000ff, side: THREE.DoubleSide, vertexColors: THREE.None });
            
        }
        else if (value === 'Phong') {
            material = new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                specular: 0x050505,
                shininess: 100
            });
        }
        //var texture = THREE.ImageUtils.loadTexture('lavaTexture.png');
        //material.color = 0xffffff;
        //material.map = texture;
        

        mesh.material = material;
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

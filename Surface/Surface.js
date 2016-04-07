var camera;
var scene;
var renderer;
var light;
var material;


function triangulate(xmin, xmax, nx, ymin, ymax, ny, func) {

    var vertices = new Float32Array(2 * 3 * 3 * (nx - 1) * (ny - 1));

    var dx = (xmax - xmin) / (nx - 1);
    var dy = (ymax - ymin) / (ny - 1)

    var index = 0;
    var pushVertex = function (i, j) {
        var x = xmin + i * dx;
        var y = ymin + j * dy;
        var z = func(x, y);
        vertices[index] = x;
        index = index + 1;
        vertices[index] = y;
        index = index + 1;
        vertices[index] = z;
        index = index + 1;
    }

    var i, j;
    for (i = 0; i < nx - 1; i++) {
        for (j = 0; j < ny - 1; j++) {

            // Lower left triangle:
            pushVertex(i + 0, j + 0);
            
            pushVertex(i + 1, j + 0);
            
            pushVertex(i + 0, j + 1);
           
            // Upper right triangle:
            pushVertex(i + 0, j + 1);
           
            pushVertex(i + 1, j + 0);
            
            pushVertex(i + 1, j + 1);
           
        }
    }
    return vertices;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-5, -5, 15);
    camera.lookAt(0, 0, 0);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 10).normalize();
    light.lookAt(0, 0, 0);
    scene.add(light);

    var alight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(alight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);


    document.body.appendChild(renderer.domElement);

    var vertices = triangulate(-1, 1, 100, -1, 1, 100, function (x, y) { return Math.sin(6.28 * x) * Math.sin(6.28 * y); });
    

    var geometry = new THREE.BufferGeometry();
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals(); // or light does not work

    //var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    material = new THREE.MeshLambertMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    

    // Class:
    var Control = function () {
        this.wireframe = false;
        this.func = "Math.sin(6.28 * x) * Math.sin(6.28 * y)";
        this.color1 = [0, 255, 0]; 
    };
    var control = new Control();
    var gui = new dat.GUI();
    var wcontroller = gui.add(control, 'wireframe');
    wcontroller.onChange(function (value) {
        // Fires on every change, drag, keypress, etc.
        material.wireframe = value;
        render();
    });

    gui.add(control, 'func').onChange(function (value) {
        //material.color = value;
        render();
    });

    var ccontroller = gui.add(control, 'color1');
    ccontroller.onChange(function (value) {
        material.color = value;
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

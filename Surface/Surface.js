var camera;
var scene;
var renderer;
var light;
var material;
var plane;
var control;

/*
    triangulates a mathematical surface z = func(x,y) over the rectangular grid: 
    x = xmin + i *dx, dx = (xmax - xmin) / (nx - 1),
    y = ymin + j *dy, dy = (ymax - ymin) / (ny - 1)
*/
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

function colorArray(vertices, min, max, colorMapFunction) {
    var n = vertices.length / 3;
    var colors = new Float32Array(3 * n);
    for (var i = 0; i < n; i++) {
        var z = vertices[3 * i + 2];
        var zn = (z - min.z) / (max.z - min.z); // [0,1]
        var color = colorMapFunction(zn);
        colors[3 * i + 0] = color.r;
        colors[3 * i + 1] = color.g;
        colors[3 * i + 2] = color.b;
    }
    return colors;
}

function rainbow(xn) {
    xn = 1.0 - xn;
    xn = 0.65 * xn; // avoid violet
    var color = new THREE.Color();
    color.setHSL(xn, 0.5, 0.5);
    return color;
}

function redgreen(xn) {
    xn = 1.0 - xn;
    xn = 0.4 * xn; // avoid violet
    var color = new THREE.Color();
    color.setHSL(xn, 0.5, 0.5);
    return color;
}

function createPlane(funcTxt) {
    //var vertices = triangulate(-1, 1, 100, -1, 1, 100, function (x, y) { return Math.sin(6.28 * x) * Math.sin(6.28 * y); });
    var func = new Function("x", "y", "return " + funcTxt);
    var vertices = triangulate(-1, 1, 100, -1, 1, 100, func);

    var geometry = new THREE.BufferGeometry();
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals(); // or light does not work

    geometry.computeBoundingBox();
    var min = geometry.boundingBox.min;
    var max = geometry.boundingBox.max;

    var cfunc;
    if (control.colormap === "jet")
        cfunc = rainbow;
    else
        cfunc = redgreen;

    var colors = colorArray(vertices, min, max, cfunc);
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    //var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    material = new THREE.MeshLambertMaterial({ /*color: 0x00ff00,*/ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
    var plane = new THREE.Mesh(geometry, material);
    return plane;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-1, -5, 5);
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

    
    // Class:
    var Control = function () {
        this.function = "sin(PI * x) * sin(PI * y)";
        this.wireframe = false;
        this.colormap = "jet";
    };
    control = new Control();
    var gui = new dat.GUI({ width: 500 });

    var onFunctionChanged = function (value) { // Fires when a controller loses focus
        var mathShortcuts = ["abs", "acos", "asin", "atan", "atan2", "cos", "exp", "log", "PI", "sin", "sqrt", "tan"];
        for (var i = 0; i < mathShortcuts.length; i++) {
            var sh = mathShortcuts[i];
            var regex = new RegExp(sh, "g");
            value = value.replace(regex, "Math." + sh);
        }
        

        console.log(value);
        if (plane)
            scene.remove(plane);
        plane = createPlane(value);
        scene.add(plane);
        render();
    };

    gui.add(control, 'function').onFinishChange(onFunctionChanged);
    onFunctionChanged(control.function);

    gui.add(control, 'colormap', ['jet', 'redgreen']).onChange(function (value) {
        onFunctionChanged(control.function);
        render();
    });

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


init();
render();

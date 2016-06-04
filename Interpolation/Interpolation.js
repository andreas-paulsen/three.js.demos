var camera;
var scene;
var renderer;
var light;
var material;
var control;
var controls;
var nx = 100;
var ny = 100;

var Z;
var min;
var max;
var dx;
var dy;
var vertices;
var points;
var surface;




function init() {
    scene = new THREE.Scene();
    var a = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.up.set(0, 0, 1);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

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

    
    var Control = function () {
        this.zscale = 1;
        this.wireframe = false;
        this.radius = 5;
        this.interpolate = function () {
            if (surface) {
                scene.remove(surface);
            }
            var Z = interpolate(vertices, this.radius);
            surface = elevationGrid(min.x, max.x, nx, min.y, max.y, ny, Z, redgreen);
            surface.scale.setZ(this.zscale);
            scene.add(surface);
            render();
        }
    };
    control = new Control();
    var gui = new dat.GUI({ width: 500 });

    gui.add(control, 'wireframe').onChange(function (value) {
        surface.material.wireframe = value;
        render();
    });
    gui.add(control, 'zscale', 0.1, 10).step(0.1).onChange(function (value) {
        if(points)
            points.scale.setZ(value);
        if(surface)
            surface.scale.setZ(value);
        render();
    });
    gui.add(control, 'radius', 1, nx/5).step(1);
    gui.add(control, 'interpolate');
}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

function interpolate(vertices, r) {
    dx = (max.x - min.x) / (nx - 1);
    dy = (max.y - min.y) / (ny - 1);
    Z = new Float32Array(nx * ny);
    W = new Float32Array(nx * ny);
    var n = vertices.length;
    for (var ip = 0; ip < n; ip++) {
        var p = vertices[ip];
        var i = (p.x - min.x) / dx;
        var j = (p.y - min.y) / dy;
        var imin = Math.floor(i - r);
        imin = Math.max(0, imin);
        var imax = Math.ceil(i + r);
        imax = Math.min(nx - 1, imax);
        var jmin = Math.floor(j - r);
        jmin = Math.max(0, jmin);
        var jmax = Math.ceil(j + r);
        jmax = Math.min(ny - 1, jmax);

        for (var i = imin; i <= imax; i++) {
            var xi = min.x + i * dx;
            for (var j = jmin; j <= jmax; j++) {
                var yi = min.y + j * dy;
                var dxi = (xi - p.x);
                var dyi = (yi - p.y);
                var ri2 = dxi * dxi + dyi * dyi;
                var wi = 1 / ri2;
                var ind = i * ny + j;
                Z[ind] = Z[ind] + wi * p.z;
                W[ind] = W[ind] + wi;
            }
        }
    }
    for (var i = 0; i < nx * ny; i++) {
        Z[i] = Z[i] / W[i];
    }
    return Z;
}

function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
        var txt = f.target.result;
        var geometry = txt2xyz(txt, 0);
        geometry.computeBoundingBox();
        geometry.computeVertexNormals(); // or light does not work
        min = geometry.boundingBox.min;
        max = geometry.boundingBox.max;
        var xc = 0.5 * min.x + 0.5 * max.x;
        var yc = 0.5 * min.y + 0.5 * max.y;
        var zc = 0.5 * min.z + 0.5 * max.z;

        geometry.colors = colorArray2(geometry.vertices, min, max, rainbow);

        material = new THREE.PointsMaterial({
            /*color: 0x00ff00,*/
            size: 0.01,
            vertexColors: THREE.VertexColors
        });
        points = new THREE.Points(geometry, material);
        scene.add(points);

        controls.target0.x = xc;
        controls.target0.y = yc;
        controls.target0.z = zc;

        controls.position0.x = xc + 3;
        controls.position0.y = yc - 5;
        controls.position0.z = zc;
        controls.reset();

        render();
        vertices = geometry.vertices;
    }
    reader.readAsText(file);
}

document.getElementById('xyzfile').addEventListener('change', handleFileSelect, false);

init();
render();


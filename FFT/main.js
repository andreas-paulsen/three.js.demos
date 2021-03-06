var camera;
var scene;
var renderer;
var light;
var material;
var control;
var nx = 512;
var ny = 512;
var data;


function index(ix, iy) {
    return ix * ny + iy;
}

function init() {
    scene = new THREE.Scene();
    var a = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-0.7 * a, 0.7 * a, 0.7, -0.7, 1, 1000);
    scene.add( camera );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 10).normalize();
    light.lookAt(0, 0, 0);
    scene.add(light);

    var alight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(alight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    data = hat('round');
    var texture = matrix2rgbtexture(data,nx,ny,rainbow);
    material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);


    var Control = function () {
        this.squareHat = function () {
            setHat('square');
        };
        this.roundHat = function () {
            setHat('round');
        };
        this.doubleSlit = function () {
            var xr = doubleSlit();
            data = xr;
            var texture = matrix2rgbtexture(data, nx, ny, rainbow);
            material.map = texture;
            material.needsUpdate = true;
            render();
        };
        this.fft = function () {
            var xc = toComplex(data);
            var X = fft2(xc, nx, ny);
            var XS = fftshift2(X, nx, ny);
            data = abs(XS);
            var texture = matrix2rgbtexture(data, nx, ny, rainbow);
            material.map = texture;
            material.needsUpdate = true;
            render();
        };
    };
    control = new Control();
    var gui = new dat.GUI({ width: 500 });
    gui.add(control, 'squareHat');
    gui.add(control, 'roundHat');
    gui.add(control, 'doubleSlit');
    gui.add(control, 'fft');
}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

init();
render();

function hat(type) {
    var nx2 = nx / 2;
    var ny2 = ny / 2;
    var rmax = 6;
    var x = new Float32Array(nx * ny);
    for (var ix = 0; ix < nx; ix++) {
        for (var iy = 0; iy < ny; iy++) {
            var v = 0;
            var r;
            var dx = ix - nx2;
            var dy = iy - ny2;
            if (type === "square") {
                r = Math.max(Math.abs(dx), Math.abs(dy));
            }
            else {
                r = Math.sqrt(dx * dx + dy * dy);
            }
            if (r <= rmax) {
                v = 1;
            }
            x[ix * ny + iy] = v;
        }
    }
    return x;
}

function doubleSlit() {
    var x = new Float32Array(nx * ny);
    for (var ix = 0; ix < nx; ix++) {
        for (var iy = 0; iy < ny; iy++) {
            x[ix * ny + iy] = 0;
        }
    }
    var nx2 = nx / 2;
    var ny2 = ny / 2;
    var h2 = 5;
    var d2 = 10;
    for (var iy = ny2 - h2; iy < ny2 + h2; iy++) {
        x[(nx2 - d2) * ny + iy] = 1;
        x[(nx2 + d2) * ny + iy] = 1;
    }
    return x;
}

function setHat(type) {
    var xr = hat(type);
    data = xr;
    var texture = matrix2rgbtexture(data, nx, ny, rainbow);
    material.map = texture;
    material.needsUpdate = true;
    render();
   
}

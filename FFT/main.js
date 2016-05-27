var camera;
var scene;
var renderer;
var light;
var material;
var control;
var nx = 256;
var ny = 256;
var data;


function index(ix, iy) {
    return ix * ny + iy;
}

function getTexture(x) {
    var min = x[0];
    var max = x[0];
    for (var i = 1; i < x.length; i++) {
        min = Math.min(min, x[i]);
        max = Math.max(max, x[i]);
    }
    var udata = new Uint8Array(3 * x.length);
    var i = 0;
    for (var iy = 0; iy < ny; iy++) {
        for (var ix = 0; ix < nx; ix++) {
            var t = x[index(ix, iy)];
            t = (t - min) / (max - min);
            var color = rainbow(t);
            udata[i * 3 + 0] = 255 * color.r;
            udata[i * 3 + 1] = 255 * color.g;
            udata[i * 3 + 2] = 255 * color.b;
            i++;
        }
    }
    var texture = new THREE.DataTexture(udata, nx, ny, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
}

function init() {
    scene = new THREE.Scene();
    var a = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-1.0*a, 1.0*a, 1.0, - 1.0, 1, 1000 );
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
    data = hat();
    var texture = getTexture(data);
    material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);


    var Control = function () {
        this.wireframe = false;
        this.fft = function () {
            var xc = toComplex(data);
            var X = fft2(xc, nx, ny);
            var XS = fftshift2(X, nx, ny);
            data = abs(XS);
            var texture = getTexture(data);
            material.map = texture;
            material.needsUpdate = true;
            render();
        };
    };
    control = new Control();
    var gui = new dat.GUI({ width: 500 });

    gui.add(control, 'wireframe').onChange(function (value) {
        material.wireframe = value;
        render();
    });
    gui.add(control, 'fft');
}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

init();
render();

function hat() {
    var nx2 = nx / 2;
    var ny2 = ny / 2;
    var w2 = 4;
    var h2 = 4;
    var x = new Float32Array(nx * ny);
    for (var ix = 0; ix < nx; ix++) {
        for (var iy = 0; iy < ny; iy++) {
            var v = 0;
            if (ix >= nx2 - w2 && ix < nx2 + w2 && iy >= ny2 - h2 && iy < ny2 + h2) {
                v = 1;
            }
            x[ix * ny + iy] = v;
        }
    }
    return x;
}

function setHat() {
    var xr = hat();
    data = xr;
    var texture = getTexture(xr);
    material.map = texture;
    material.needsUpdate = true;
    render();
   
}
//setHat();

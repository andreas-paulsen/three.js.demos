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

function initializeT() {
    T = new Float32Array(nx * ny);
    for (var ix = 0; ix < nx; ix++) {
        T[index(ix, 0)] = 1;
        for (var iy = 1; iy < ny; iy++) {
            T[index(ix, iy)] = 0;
        }
    }
}

function JacobiIterate() {
    var TC = new Float32Array(T);
    for (var ix = 1; ix < nx - 1; ix++) {
        for (var iy = 1; iy < ny - 1; iy++) {
            var TE = TC[index(ix - 1, iy)];
            var TW = TC[index(ix + 1, iy)];
            var TS = TC[index(ix, iy - 1)];
            var TN = TC[index(ix, iy + 1)];
            T[index(ix, iy)] = 0.25 * (TE + TW + TS + TN);
        }
    }
}

function getTexture() {
    var data = new Uint8Array(3 * nx * ny);
    var i = 0;
    for (var iy = 0; iy < ny; iy++) {
        for (var ix = 0; ix < nx; ix++) {
            var t = T[index(ix, iy)];
            var color = rainbow(t);
            data[i * 3 + 0] = 255 * color.r;
            data[i * 3 + 1] = 255 * color.g;
            data[i * 3 + 2] = 255 * color.b;
            i++;
        }
    }
    var texture = new THREE.DataTexture(data, nx, ny, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, - 1.0, 1, 1000 );
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

    var geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    initializeT();
    texture = getTexture();
    material = new THREE.MeshBasicMaterial({ /*color: 0xffff00,*/ side: THREE.DoubleSide, map: texture });
    //var material = new THREE.MeshLambertMaterial({ /*color: 0x00ff00,*/ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
    var plane = new THREE.Mesh(geometry, material);
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

function animate() {
    requestAnimationFrame(animate);
    JacobiIterate();
    texture = getTexture();
    material.map = texture;
    material.needsUpdate = true;
    render();
}

init();
render();

requestAnimationFrame(animate);

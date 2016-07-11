var camera;
var scene;
var renderer;
var light;
var material;
var control;
var texture;
var stats;

function index(ix, iy) {
    return ix * ny + iy;
}

function init() {
    scene = new THREE.Scene();
    var a = window.innerWidth / window.innerHeight;
    //camera = new THREE.OrthographicCamera(-0.7 * a, 0.7 * a, 0.7, -0.7, 1, 1000);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
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

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0); // view direction perpendicular to XY-plane
    controls.noRotate = true;
    controls.addEventListener('change', render);

    document.body.appendChild(renderer.domElement);

    

    var geometry = new THREE.BufferGeometry();
    var vertices = new Float32Array([
	-1.0, -1.0, 0.0,
	 1.0, -1.0, 0.0,
	 1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0]);

    var indices = new Uint32Array([0, 1, 3, 1, 2, 3]);
    var uv = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geometry.computeBoundingBox();

   
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    loader.load('hall.jpg', function (texture_) {
        texture = texture_;
        var vertShader = document.getElementById('vertexShader').innerHTML;
        var fragShader = document.getElementById('fragmentShader').innerHTML;

        //material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture });
        material = new THREE.ShaderMaterial({
            vertexShader: vertShader,
            fragmentShader: fragShader,
            uniforms: {
                seismic_texture: { type: 't', value: texture },
                seismic_texture_size: { type: '2f', value: [1024, 1024] },
            },
            defines: {
                
            },
            side: THREE.DoubleSide
        });
        material.bumpMap = true; // or dFdx and dFdy will not work in shader
        var plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        render();
    });
   

    var Control = function () {
        this.magFilter = 'Linear';
        this.minFilter = 'LinearMipMapLinear';
        this.superSampling = false;
    };
    control = new Control();
    var gui = new dat.GUI({ width: 500 });
    gui.add(control, 'magFilter', ['Nearest', 'Linear']).onChange(function (value) {
        if (value === 'Nearest') {
            texture.magFilter = THREE.NearestFilter;
        }
        else if (value === 'Linear') {
            texture.magFilter = THREE.LinearFilter;
        }
        texture.needsUpdate = true;
        render();
    });
    gui.add(control, 'minFilter', ['Nearest', 'LinearMipMapLinear', 'NearestMipMapNearest', 'LinearFilter']).onChange(function (value) {
        if (value === 'Nearest') {
            texture.minFilter = THREE.NearestFilter;
        }
        else if (value === 'LinearMipMapLinear') {
            texture.minFilter = THREE.LinearMipMapLinearFilter;
        }
        else if (value === 'NearestMipMapNearest') {
            texture.minFilter = THREE.NearestMipMapNearestFilter;
        }
        else if (value === 'LinearFilter') {
            texture.minFilter = THREE.LinearFilter;
        }
        texture.needsUpdate = true;
        render();
    });
    gui.add(control, 'superSampling').onChange(function (value) {
        if (value === true) {
            material.defines.SUPERSAMPLING = true;
        }
        else {
            delete material.defines.SUPERSAMPLING;
        }
        material.needsUpdate = true;
        render();
    });

    stats = new Stats();
    document.body.appendChild(stats.domElement);
}

function render() {
    light.position.copy(camera.position);
    light.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    stats.update();
}

init();
render();


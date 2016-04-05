var camera;
var scene;
var renderer;
var mesh;
var uniforms;
init();
animate();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-50, -50, 50);
    camera.lookAt(0, 0, 0);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

   
    var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
    material.wireframe = true;
    

    var width =  10;
    var height = 10;
    var geometry = new THREE.PlaneGeometry(width, height, 100, 100);
  
    var vertShader = document.getElementById('vertexShader').innerHTML;
    var fragShader = document.getElementById('fragmentShader').innerHTML;

    uniforms = {
        t: {
            type: 'f', // a float
            value: 0
        }
    };
    var smaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertShader,
        fragmentShader: fragShader
    });
    
    mesh = new THREE.Mesh(geometry, smaterial);
    mesh.position.x = -5;
    mesh.position.y = -5;
    mesh.position.z = 0;
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(renderer.domElement);

   

    window.addEventListener('resize', onWindowResize, false);

    render();
}

var frame = 0;
function animate() {
    //mesh.rotation.x += .04;
    //mesh.rotation.y += .02;
    uniforms.t.value = frame;
    render();
    frame += 1;
    // Ask the browser to call this function again as soon as possible which is when it is done with render():
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
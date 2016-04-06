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
    camera.position.set(-50, -50, 150);
    camera.lookAt(0, 0, 0);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-50, -50, 150).normalize();
    scene.add(light);

    var ambientLight = new THREE.AmbientLight( 0xff4040 );
    scene.add(ambientLight);
   
    
    
    
    // load model
    var objLoader = new THREE.OBJLoader();
    objLoader.load('dragon.obj', function(object) {
        console.log(object);
        // loop trough all children:
        object.traverse( function(child) {
            if (child instanceof THREE.Mesh) {
                console.log(child);  
                // apply custom material
                material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
                //var material = new THREE.MeshPhongMaterial();
                //child.material = material;
                // enable casting shadows
                child.castShadow = true;
                child.receiveShadow = true;
                //scene.add(child);
            }
        });
                   
        object.position.x = 0;
        object.position.y = 0;
        object.position.z = 0;
        object.scale = 1.0;
        scene.add(object);
    });
    
    
   

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(renderer.domElement);

   

    window.addEventListener('resize', onWindowResize, false);

    render();
}

function animate() {
    render();
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
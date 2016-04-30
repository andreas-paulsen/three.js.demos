var camera;
var scene;
var renderer;
var theObject;



function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(50, 0, 0);
    camera.lookAt(0, 0, 0);



    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    var light = new THREE.DirectionalLight(0xffffff);
    camera.add(light);

   
    light.position.set(0, 0, 1);
    scene.add(light);

    var ambientLight = new THREE.AmbientLight( 0x666666, 0.7 );
    scene.add(ambientLight);
    
    var geometry = new THREE.SphereGeometry(5, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.2
    });
    var sphere = new THREE.Mesh(geometry, material);
    //scene.add(sphere);

   
    var urlPrefix = "";
    var urls = [urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
                urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
                urlPrefix + "posz.jpg", urlPrefix + "negz.jpg"];

    var materialArray = [];
    var tloader = new THREE.TextureLoader();
    tloader.load(urls[0], function (t) {
        materialArray.push(new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
        tloader.load(urls[1], function (t) {
            materialArray.push(new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
            tloader.load(urls[2], function (t) {
                materialArray.push(new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
                tloader.load(urls[3], function (t) {
                    materialArray.push(new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
                    tloader.load(urls[4], function (t) {
                        materialArray.push(new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
                        tloader.load(urls[5], function (t) {
                            materialArray.push(new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
                            var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
                            var skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000, 1, 1, 1, null, true), skyMaterial);
                            scene.add(skyboxMesh);
                            render();
                        });
                    });
                });
            });
        });
    });


    
    

   
    
    
   

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(renderer.domElement);

   

    window.addEventListener('resize', onWindowResize, false);

    render();
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

init();

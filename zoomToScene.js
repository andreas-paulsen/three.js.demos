function zoomToScene(geoemtry, orbitcontrol) {
    orbitcontrol.target0.x = xc;
    orbitcontrol.target0.y = yc;
    orbitcontrol.target0.z = zc;

    orbitcontrol.position0.x = xc + 3;
    orbitcontrol.position0.y = yc - 5;
    orbitcontrol.position0.z = zc;
    orbitcontrol.reset();
}

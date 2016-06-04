/*
    triangulates a mathematical surface z = func(x,y) over the rectangular grid: 
    x = xmin + i *dx, dx = (xmax - xmin) / (nx - 1),
    y = ymin + j *dy, dy = (ymax - ymin) / (ny - 1)
*/
function triangulate(xmin, xmax, nx, ymin, ymax, ny, z1darray) {

    var vertices = new Float32Array(2 * 3 * 3 * (nx - 1) * (ny - 1));

    var dx = (xmax - xmin) / (nx - 1);
    var dy = (ymax - ymin) / (ny - 1)

    var index = 0;
    var pushVertex = function (i, j) {
        var x = xmin + i * dx;
        var y = ymin + j * dy;
        var z = z1darray[i * ny + j];
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

/*
    Given a Float32Array of elevation values Z on the rectangular grid: 
    x = xmin + i *dx, dx = (xmax - xmin) / (nx - 1),
    y = ymin + j *dy, dy = (ymax - ymin) / (ny - 1),
    z(x,y) = Z[i * ny + j]
    and a colormap triangulates and returns a colored Mesh of the elevation surface.
*/
function elevationGrid(xmin, xmax, nx, ymin, ymax, ny, Z, colormap) {
    var vertices = triangulate(xmin, xmax, nx, ymin, ymax, ny, Z);
    var geometry = new THREE.BufferGeometry();
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals(); // or light does not work

    geometry.computeBoundingBox();
    var min = geometry.boundingBox.min;
    var max = geometry.boundingBox.max;
    
    var colors = colorArray(vertices, min, max, colormap);
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
    var plane = new THREE.Mesh(geometry, material);
    return plane;
}
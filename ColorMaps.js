/*
    Given a Float32Array of vertices: [x1, y1, z1, x2, y2, z2 ...]
    where min.z <= zi <= max.z and a colorMapFunction,
    returns a Float32Array of rgb values for each vertex: [r1, g1, b1, r2, g2, b2, ...]
*/
function colorArray(vertices, min, max, colorMapFunction) {
    var n = vertices.length / 3;
    var colors = new Float32Array(3 * n);
    for (var i = 0; i < n; i++) {
        var z = vertices[3 * i + 2];
        var zn = (z - min.z) / (max.z - min.z); // [0,1]
        var color = colorMapFunction(zn);
        colors[3 * i + 0] = color.r;
        colors[3 * i + 1] = color.g;
        colors[3 * i + 2] = color.b;
    }
    return colors;
}

/*
    Given an array of THREE.Vector3,
    where min.z <= zi <= max.z and a colorMapFunction,
    returns an array of THREE.Color.
*/
function colorArray2(vertices, min, max, colorMapFunction) {
    var n = vertices.length;
    var colors = [];
    for (var i = 0; i < n; i++) {
        var z = vertices[i].z;
        var zn = (z - min.z) / (max.z - min.z); // [0,1]
        var color = colorMapFunction(zn);
        colors.push(color);
    }
    return colors;
}

function rainbow(xn) { // 0 <= xn <= 1
    xn = 1.0 - xn;
    xn = 0.65 * xn; // avoid violet
    var color = new THREE.Color();
    color.setHSL(xn, 0.5, 0.5);
    return color;
}

function redgreen(xn) { // 0 <= xn <= 1
    xn = 1.0 - xn;
    xn = 0.4 * xn; // avoid violet
    var color = new THREE.Color();
    color.setHSL(xn, 0.5, 0.5);
    return color;
}

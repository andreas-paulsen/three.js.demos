function txt2xyz(txt, startCol) {
    var lines = txt.match(/[^\r\n]+/g);
    var n = lines.length;
    var geometry = new THREE.Geometry();
    for (var i = 0; i < n; i++) {
        var line = lines[i];
        var parts = line.split(/[ ,]+/);
        var x = parseFloat(parts[startCol]);
        var y = parseFloat(parts[startCol + 1]);
        var z = parseFloat(parts[startCol + 2]);
        geometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    return geometry;
}

function xyzLoader(file, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.onload = function () {
        var txt = request.responseText;
        var geometry = txt2xyz(txt, 1);
        callback(geometry);
    }
    request.send();

}

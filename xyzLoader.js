function xyzLoader(file, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.onload = function () {
        var txt = request.responseText;
        var lines = txt.match(/[^\r\n]+/g);
        var n = lines.length;
        var geometry = new THREE.Geometry();
        for (var i = 0; i < n; i++) {
            var line = lines[i];
            var parts = line.split(/[ ,]+/);
            var x = parseFloat(parts[1]);
            var y = parseFloat(parts[2]);
            var z = parseFloat(parts[3]);
            geometry.vertices.push(new THREE.Vector3(x,y,z));
          
        }
        callback(geometry);
    }
    request.send();

}

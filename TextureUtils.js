/*
    Input: nx * ny matrix in the shape of a Float32Array: m, 
           colormap: function that takes in 0 <= x <= 1 and returns a THREE.Color.
    Output: THREE.DataTexture in THREE.RGBFormat
*/

function matrix2rgbtexture(M, nx, ny, colormap) {
    // Find min and max of matrix so that we can normalize values:
    var min = M[0];
    var max = M[0];
    for (var i = 1; i < M.length; i++) {
        min = Math.min(min, M[i]);
        max = Math.max(max, M[i]);
    }
    var udata = new Uint8Array(3 * M.length);
    var i = 0;
    for (var iy = 0; iy < ny; iy++) {
        for (var ix = 0; ix < nx; ix++) {
            var m = M[ix * ny + iy];
            // Normalize:
            m = (m - min) / (max - min);
            var color = colormap(m);
            udata[i * 3 + 0] = 255 * color.r;
            udata[i * 3 + 1] = 255 * color.g;
            udata[i * 3 + 2] = 255 * color.b;
            i++;
        }
    }
    var texture = new THREE.DataTexture(udata, nx, ny, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
}

/*
    fft.js: Fast Fourier Transform methods
*/

function _fft(x, beg, n, stride) {
    var X = new Float32Array(2 * n);
    if (n === 1) {
        // The DFT of one element is just the element itself. 
        X[0] = x[2 * beg];
        X[1] = x[2 * beg + 1];
        return X;
    }
    // Divide the input vector into even (x0, x2, ...) and odd (x1, x3 ...) elements and find their DFT:
    var n2 = n / 2;
    var E = _fft(x, beg, n2, 2 * stride);
    var O = _fft(x, beg + stride, n2, 2 * stride);
    for (var k = 0; k < n2; k++) {
        var theta = -2 * Math.PI * k / n;
        var Wre = Math.cos(theta);
        var Wim = Math.sin(theta);

        // Danielson - Lanczos Lemma:
        var Ere = E[2 * k + 0];
        var Eim = E[2 * k + 1];
        var Ore = O[2 * k + 0];
        var Oim = O[2 * k + 1];

        X[2 * k + 0] = Ere + (Wre * Ore - Wim * Oim); // re
        X[2 * k + 1] = Eim + (Wre * Oim + Wim * Ore); // im

        X[2 * (k + n2) + 0] = Ere - (Wre * Ore - Wim * Oim); // re
        X[2 * (k + n2) + 1] = Eim - (Wre * Oim + Wim * Ore); // im
    }
    return X;
}

/*
     Discrete Fourier transform
     x: Float32Array of interleaved real and imaginary values: [x1_re, x1_im, x2_re, x2_im, ...]
     Returns X: Float32Array of interleaved real and imaginary values
*/
function fft(x) {
    return _fft(x, 0, x.length / 2, 1);
}

/*
    Two-dimensional discrete Fourier Transform
     x: Float32Array of column major interleaved real and imaginary values: [x1_re, x1_im, x2_re, x2_im, ...],
     nx, ny: dimensions of matrix
     Returns X: Float32Array of interleaved real and imaginary values
*/
function fft2(x, nx, ny) {
    var X = new Float32Array(2 * nx * ny);

    // fft on each column:
    var xc = new Float32Array(2 * ny);
    for (var ix = 0; ix < nx; ix++) {
        for (var iy = 0; iy < ny; iy++) {
            xc[2 * iy + 0] = x[2 * (ix * ny + iy) + 0]; // re
            xc[2 * iy + 1] = x[2 * (ix * ny + iy) + 1]; // im
        }
        var Xc = fft(xc);
        for (var iy = 0; iy < ny; iy++) {
            X[2 * (ix * ny + iy) + 0] = Xc[2 * iy + 0]; // re 
            X[2 * (ix * ny + iy) + 1] = Xc[2 * iy + 1]; // im
        }
    }

    // fft on each row:
    var xr = new Float32Array(2 * nx);
    for (var iy = 0; iy < ny; iy++) {
        for (var ix = 0; ix < nx; ix++) {
            xr[2 * ix + 0] = X[2 * (ix * ny + iy) + 0]; // re
            xr[2 * ix + 1] = X[2 * (ix * ny + iy) + 1]; // im
        }
        var Xr = fft(xr);
        for (var ix = 0; ix < nx; ix++) {
            X[2 * (ix * ny + iy) + 0] = Xr[2 * ix + 0]; // re 
            X[2 * (ix * ny + iy) + 1] = Xr[2 * ix + 1]; // im
        }
    }

    return X;
}

/*
    Shift zero-frequency component to center of spectrum.
*/
function fftshift2(X, nx, ny) {
    var nx2 = nx / 2;
    var ny2 = ny / 2;

    // Swap 1st and 3rd quadrant of matrix:
    for (var ix = 0; ix < nx2; ix++) {
        for (var iy = 0; iy < ny2; iy++) {
            var iix = ix + nx2;
            var iiy = iy + ny2;
            var tre = X[2 * (ix * ny + iy) + 0];
            var tim = X[2 * (ix * ny + iy) + 1];
            X[2 * (ix * ny + iy) + 0] = X[2 * (iix * ny + iiy) + 0]; // re
            X[2 * (ix * ny + iy) + 1] = X[2 * (iix * ny + iiy) + 1]; // im
            X[2 * (iix * ny + iiy) + 0] = tre;
            X[2 * (iix * ny + iiy) + 1] = tim;
        }
    }

    // Swap 2nd and 4th quadrant of matrix:
    for (var ix = nx2; ix < nx; ix++) {
        for (var iy = 0; iy < ny2; iy++) {
            var iix = ix - nx2;
            var iiy = iy + ny2;
            var tre = X[2 * (ix * ny + iy) + 0];
            var tim = X[2 * (ix * ny + iy) + 1];
            X[2 * (ix * ny + iy) + 0] = X[2 * (iix * ny + iiy) + 0]; // re
            X[2 * (ix * ny + iy) + 1] = X[2 * (iix * ny + iiy) + 1]; // im
            X[2 * (iix * ny + iiy) + 0] = tre;
            X[2 * (iix * ny + iiy) + 1] = tim;
        }
    }
    return X;
}

function abs(X) {
    var n2 = X.length / 2;
    var Xa = new Float32Array(n2);
    for (var i = 0; i < n2; i++) {
        var Xre = X[2 * i + 0];
        var Xim = X[2 * i + 1];
        Xa[i] = Math.sqrt(Xre * Xre + Xim * Xim);
    }
    return Xa;
}

function toComplex(x) {
    var n = x.length;
    var Xc = new Float32Array(2 * n);
    for (var i = 0; i < n; i++) {
        Xc[2 * i + 0] = x[i];
        Xc[2 * i + 1] = 0;
    }
    return Xc;
}
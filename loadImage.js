/*
    http://www.html5rocks.com/en/tutorials/file/xhr2/
*/
function loadImage(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var blob = new Blob([this.response], { type: 'image/jpeg' });
        var imgUrl = window.URL.createObjectURL(blob);
        var loader = new THREE.TextureLoader();
        loader.load(imgUrl, function (texture) {
            callback(texture);
        });
    }
    xhr.send();
}




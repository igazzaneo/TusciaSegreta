function getMapLocation() {

    navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true });
}

var onMapSuccess = function (position) {
    saveOnLocalStorage('latitudine', position.coords.latitude);
    saveOnLocalStorage('longitudine', position.coords.longitude);
}

function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function getMapLocation() {

    navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true });
}

var onMapSuccess = function (position) {
    saveOnLocalStorage('latitudine', position.coords.latitude);
    saveOnLocalStorage('longitudine', position.coords.longitude);

    locateUser();
}

function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function startNavigation(lat, long ) {
  var sitoLatitudine = lat;
  var sitoLongitudine = long;
  var geocoords = sitoLatitudine+','+sitoLongitudine;
  if(confirm("Vuoi avviare la navigazione?\n\nRicorda di aprire di nuovo l'app per seguire il percorso.")) {
    window.open('google.navigation:q=' + geocoords + '&mode=d', '_system');
  }
}

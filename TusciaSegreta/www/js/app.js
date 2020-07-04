var rowCount = 0;
var database = null;
var versione = null;
var versioneLocale = null;
var timeoutGps;
var lc;
var rejectGps=false;

Storage.prototype.setObj = function(key, obj) {
    this.removeItem(key);
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
Storage.prototype.removeObj = function(key) {
    return this.removeItem(key);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


//document.addEventListener("deviceready", onDeviceReady, false);

//function onDeviceReady() {

//  document.addEventListener("backbutton", onBackKeyDown, true);

  //getServerDBVersion();

  //fn.gotoPage('map.html');

  //initDatabase();

  //getMapLocation();

//}



document.addEventListener("resume", onResume, false);
function onResume() {
    //setTimeout(function() {
            // TODO: do your thing!
    //    }, 0);
    getCoordinateInizioSiti(database, controlloDistanzaDaSiti);

    //alert("Applicazione In Resume");
}

function controlloDistanzaDaSiti(elenco)
{

  getMapLocation();
  var latitudine = getValueFromLocalStorage('latitudine');
  var longitudine = getValueFromLocalStorage('longitudine');
  var position = L.marker([latitudine, longitudine]);

  var minimaDistanza=0;
  var minSito;

  for(var x=0; x<elenco.length; x++) {

    var sito = elenco[x];
    var sitoLatitudine = sito[4];
    var sitoLongitudine = sito[5];

    var start = L.marker([sitoLatitudine, sitoLongitudine]);

    var distanzaInMetri = position.getLatLng().distanceTo(start.getLatLng());

    if(minimaDistanza==0 ||distanzaInMetri<minimaDistanza) {
      minimaDistanza = distanzaInMetri;
      minSito = sito;
    }

  }

  if(minimaDistanza>200 && minimaDistanza<=1000) {
    // Sono a meno di un Km dal percorso e a più di 250 metri, segnalo il percorso e vado alla scheda
    if(confirm("Sei vicino al sito '" + minSito[1] + "'\n\nVuoi visualizzare la scheda informativa?")) {
      changePageWithParam('scheda.html', minSito[0]);
    }
  } else if(minimaDistanza<=200) {
    // Sono a meno di 250 metri dall'inizio del percorso, vado direttamente nella scheda del sito con impostato il tab Percorso
    //if(confirm("Sei in prossimità dell'inizio del percorso '" + minSito[1] + "'\n\nVuoi iniziare la visita?")) {

      changePageWithParam2('scheda.html', minSito[0]);
      //document.querySelector('ons-tabbar').setActiveTab(3);
    //}

  }

}

/*function onBackKeyDown(e) {// Handle the back button

    navigator.notification.confirm(
            'Are you certain you want to close the app?',  // message
            function( index ){
                if( index == 1 ){//look at the docs for this part
                    navigator.app.exitApp();
                }
            },              // callback to invoke with index of button pressed
            'Exit',            // title
            'Yes,No'          // buttonLabels
        );
    return false;
}*/


document.addEventListener('prechange', function(event) {

    stopVideo();

    if(event.index == 3) {
      // Selezionato il TAB percorso, avvio il controllo sulla distanza dal percorso

      if(!rejectGps) {
        timeoutGps = setInterval(function() {

          var sitoLatitudine = $("#latitudine").val();
          var sitoLongitudine = $("#longitudine").val();

          if(checkDistanceFromStart(sitoLatitudine, sitoLongitudine) && !lc._active) {

            if(confirm("Vuoi attivare la navigazione sul percorso?")) {
              lc.start();

            } else {
              rejectGps = true;
            }

            clearTimeout(timeoutGps);

          } else {
            lc.stop();
          }

        }, 3000);
      }

    } else {
      clearTimeout(timeoutGps);
      stopFollowing();
    }

  });


function changePage(p) {

  saveHistory(p);

  document.location.href=p;
}

function changePageWithParam(p, param)
{
  saveOnLocalStorage('param', param);
  removeFromLocalStorage('tab');
  fn.gotoPage(p+"?param=" + param);

}

function changePageWithParam2(p, param)
{
  saveOnLocalStorage('param', param);
  saveOnLocalStorage('tab', '3');

  fn.gotoPage(p+"?param=" + param);
  //alert(document.querySelector('ons-tabbar').getActiveTab());
  //document.querySelector('ons-tabbar').setActiveTab(3);
}

function emptyLocalStorageFromObject()
{
  localStorage.removeObj('sito');
  localStorage.removeObj('percorso');
  localStorage.removeObj('caratteristiche');
  localStorage.removeObj('nodi');

  return true;
}

function checkIfFileExists(path){
    // path is the full absolute path to the file.
    window.resolveLocalFileSystemURL(path, fileExists, fileDoesNotExist);
}
function fileExists(fileEntry){
    //alert("File " + fileEntry.fullPath + " exists!");
}
function fileDoesNotExist(){
    console.log("file does not exist");
    //alert("Il file non esiste");
}

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

document.addEventListener("deviceready", onDeviceReady, false);

document.addEventListener("backbutton", testBackButton, false);

var lastTimeBackPress=0;
var timePeriodToExit=2000;

function testBackButton() {
    // Handle the back button
    e.preventDefault();
    //e.stopPropagation();
    alert("Backbutton");

    myToast.toggle();

    /*if(new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
        navigator.app.exitApp();
    } else {
        alert("Dovrei mostrare il messaggio")
        window.plugins.toast.showWithOptions(
            {
              message: "Press again to exit.",
              duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -100  // added a negative value to move it up a bit (default 0)
            }
          );

        lastTimeBackPress=new Date().getTime();
    }*/
}

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

function onDeviceReady() {

  getServerDBVersion();

  //fn.gotoPage('map.html');

  initDatabase();

  getMapLocation();

}

function onBackKeyDown(e) {
    // Handle the back button
    //e.preventDefault();
    //console.log("onBackKeyDown...");
    fn.gotoPage('account.html');
}

function changePage(p) {
  document.location.href=p;
}

function changePageWithParam(p, param)
{
  saveOnLocalStorage('param', param);

  fn.gotoPage(p+"?param=" + param);

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

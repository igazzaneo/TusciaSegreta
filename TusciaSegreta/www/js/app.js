var rowCount = 0;
var database = null;
var versione = null;
var versioneLocale = null;
//var percorso;

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

function onDeviceReady() {

  document.addEventListener('DOWNLOADER_initialized', function(event){
    var data = event.data;
    alert("DOWNLOADER_initialized..");
  });

  document.addEventListener('DOWNLOADER_error', function(event){
    var data = event.data;
    alert("DOWNLOADER_error: " + data);
  });


  getServerDBVersion();

  initDatabase();

  getMapLocation();

  setTimeout(
    function() {
      getElencoSiti(database);
      fn.gotoPage('map.html');
    }, 2000
  );
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
    alert("File " + fileEntry.fullPath + " exists!");
}
function fileDoesNotExist(){
    console.log("file does not exist");
    //alert("Il file non esiste");
}

function getZippedResources(versione)
{
	downloader.init({folder: 'file:///storage/emulated/0/download', unzip: true});
	downloader.get('http://51.75.182.195:1880/'+versione+'.zip');
}

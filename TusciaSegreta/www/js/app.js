var rowCount = 0;
var database = null;
var versione = null;
var versioneLocale = null;

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

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  getServerDBVersion();
  initDatabase();
  getMapLocation();
  dao.initialize(function() {
      console.log('database initialized');
  });

  dao.getElencoSiti(saveElencoSiti);

  fn.gotoPage('map.html');
/*
  setTimeout(
    function() {
      getElencoSiti(database);
      fn.gotoPage('map.html');
    }, 2000
  );
*/

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

  //if(emptyLocalStorageFromObject())
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

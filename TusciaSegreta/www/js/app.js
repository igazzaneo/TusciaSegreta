var rowCount = 0;
var database = null;
var versione = null;
var versioneLocale = null;

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
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

function getId() {
    var urlParams = new URLSearchParams(window.location.search);
    showMessage(urlParams.get('id')); // true

}

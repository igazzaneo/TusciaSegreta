var rowCount = 0;
var database = null;
var versione = null;
var versioneLocale = null;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  getServerDBVersion();
  initDatabase();

  setTimeout(
    function() {
      getElencoSiti(database);
    }, 2000
  );

  setTimeout(
    function() {
      fn.gotoPage('map.html');
    }, 1000
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

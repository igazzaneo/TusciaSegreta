var rowCount = 0;
var database = null;
var versione = null;
var versioneLocale = null;
var elencoSiti = new Array();
var flag = false;


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  getServerDBVersion();
  initDatabase();

  return Promise.all([
    new Promise(function (resolve, reject) {
      getServerDBVersion();
    }),
    new Promise(function (resolve, reject) {
      initDatabase();
    })
  ]).then(function () {
    showMessage("Versione Promise: " + versione);
    showMessage("Database Promise: " + database);

    changePage("firstpage.html");
  });

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

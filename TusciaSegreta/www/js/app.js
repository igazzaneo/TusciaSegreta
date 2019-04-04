document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  document.addEventListener("backbutton", function (e) {
    e.preventDefault();
    showMessage("BackButton pressed");
  }, false );
  initDatabase();
  changePage("firstpage.html");
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

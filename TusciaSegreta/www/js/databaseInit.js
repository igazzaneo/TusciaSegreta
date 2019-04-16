function initDatabase() {

  window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "/copied_tusciasegreta.db", openDb, setupDB);

}

function openDb() {

  database = sqlitePlugin.openDatabase({name: 'copied_tusciasegreta.db'});

  versioneLocale = getValueFromLocalStorage('versione');

  if(versioneLocale == "0") {
    // Sul localstorage non è memorizzato nulla, la prelevo dal DB
    getLocalDBVersion(database);
  }
  //alert("Versione DB cloud: " + versione + " - Versione locale: " + versioneLocale);
  if(versione != versioneLocale) {

    // Prelevo il JSON del DB dal server
    getServerDB();

    // Memorizzo la versione del DB che ho prelevato
    saveOnLocalStorage('versione', versione);

    // Prelevo lo sip dell'ultima versione del DB
    // Aggiorno la tabella versione del DB Locale
    //updateVersioneDB(database, versione);

  }
  /*
  var uri = "http://51.75.182.195:1880/0.0.6.zip";
  var fileName="0.0.6.zip";
  var fileTransfer = new FileTransfer();
	fileTransfer.download(uri, cordova.file.dataDirectory + fileName,
		function(entry) {
			showMessage("OK");
		},
		function(err) {
			showMessage("Errore: " + err);
		});*/
    downloader.init({folder: cordova.file.dataDirectory, unzip: true});
    downloader.get("http://51.75.182.195:1880/0.0.6.zip");

  copyDatabaseFileToDownload();
}

// copy a database file from www/ in the app directory to the data directory
function copyDatabaseFile(dbName) {

  var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
  var targetDirName = cordova.file.dataDirectory;

  return Promise.all([
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(sourceFileName, resolve, reject);
    }),
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(targetDirName, resolve, reject);
    })
  ]).then(function (files) {
    var sourceFile = files[0];
    var targetDir = files[1];
    return new Promise(function (resolve, reject) {
      targetDir.getFile("copied_" + dbName, {}, resolve, reject);
    }).then(function () {
      showMessage("Database già presente");
    }).catch(function () {
      //showMessage("file doesn't exist, copying it");
      return new Promise(function (resolve, reject) {
        sourceFile.copyTo(targetDir, 'copied_' + dbName, resolve, reject);
      }).then(function () {
        showMessage("Database copiato");
      });
    });
  });
}

// copy a database file from www/ in the app directory to the data directory
function copyDatabaseFileToDownload() {

  var sourceFileName = cordova.file.dataDirectory + 'copied_tusciasegreta.db';
  var targetDirName = 'file:///storage/emulated/0/download';

  return Promise.all([
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(sourceFileName, resolve, reject);
    }),
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(targetDirName, resolve, reject);
    })
  ]).then(function (files) {
    var sourceFile = files[0];
    var targetDir = files[1];
    return new Promise(function (resolve, reject) {
      targetDir.getFile('copied_tusciasegreta.db', {}, resolve, reject);
    }).then(function () {
      //showMessage("Database già presente");
      sourceFile.copyTo(targetDir, 'copied_tusciasegreta.db', resolve, reject);
    }).catch(function () {
      //showMessage("file doesn't exist, copying it");
      return new Promise(function (resolve, reject) {
        sourceFile.copyTo(targetDir, 'copied_tusciasegreta.db', resolve, reject);
      }).then(function () {
        //showMessage("Database copiato");
      });
    });
  });
}




// copy DB and open it
function setupDB() {
    //showMessage("onSetupDB()");
    copyDatabaseFile('tusciasegreta.db').then(function () {
      //database = sqlitePlugin.openDatabase({name: 'copied_tusciasegreta.db'});
      openDb();
    }).catch(function (err) {
      // error! :(
      showMessage(err);
    });

}

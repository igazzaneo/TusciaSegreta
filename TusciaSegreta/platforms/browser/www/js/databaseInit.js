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

  if(versione == "-1") {
    // Timeout dell'app
    versione = versioneLocale;
  }

  //alert("Versione DB cloud: " + versione + " - Versione locale: " + versioneLocale);
  if(versione != versioneLocale) {

    // Prelevo il JSON del DB dal server
    getServerDB();

    // Memorizzo la versione del DB che ho prelevato
    saveOnLocalStorage('versione', versione);

    var fileName = versione + ".zip";
    var uri = "https://node-red.itlogix.it/" + fileName;

    var fileTransfer = new FileTransfer();

    var elem = document.getElementById("myBar");
    fileTransfer.onprogress = function(progressEvent) {
      var percent =  progressEvent.loaded / progressEvent.total * 100;
      percent = Math.round(percent);

      elem.style.width = percent + '%';
      elem.innerHTML = percent * 1  + '%';

    };
  	fileTransfer.download(uri, cordova.file.dataDirectory + fileName,
  		function(entry) {

        var PathToFileInString  = cordova.file.dataDirectory + fileName;
        var PathToResultZip     = cordova.file.dataDirectory;
        JJzip.unzip(PathToFileInString, {target:PathToResultZip},
          function(data){
            //showMessage("Unzip completato: " + data.success);
            fn.gotoPage('map.html');
          },function(error){
            showMessage("Errore nel caricamento delle risorse: " + error.message)
          });
  		},
  		function(err) {
  			showMessage("Errore: " + err);
  		}
    );

    // Prelevo lo zip dell'ultima versione del DB
    // Aggiorno la tabella versione del DB Locale
    updateVersioneDB(database, versione);

  } else {
    fn.gotoPage('map.html');
  }

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
        //copyDatabaseFileToDownload();
        //showMessage("Database copiato");
      });
    });
  });
}

// copy a database file from www/ in the app directory to the data directory
function copyDatabaseFileToDownload() {

  var sourceFileName = cordova.file.dataDirectory + '/copied_tusciasegreta.db';
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
      }).catch(function(e) {
        showMessage("Errore nella copia del file: " + e.message);
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

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

  var Downloader = window.plugins.Downloader;

  var downloadSuccessCallback = function(result) {
     // result is an object
      {
          path: "file:///storage/sdcard0/download/test.pdf", // Returns full file path
          file: "test.pdf", // Returns Filename
          folder: "download" // Returns folder name
      }
     console.log(result.file); // My Pdf.pdf
  };

  var downloadErrorCallback = function(error) {
    alert("Errore nel download: " + error)
  };

  var options = {
      title: 'Downloading File', // Download Notification Title
      url: "http://www.peoplelikeus.org/piccies/codpaste/codpaste-teachingpack.pdf", // File Url
      path: "test.pdf", // The File Name with extension
      description: 'The pdf file is downloading', // Download description Notification String
      visible: true, // This download is visible and shows in the notifications while in progress and after completion.
      folder: "download" // Folder to save the downloaded file, if not exist it will be created
  }

  Downloader.download(options, downloadSuccessCallback, downloadErrorCallback);

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

var database = null;

window.dao =  {

    initialize: function(callback) {

        var self = this;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "/copied_tusciasegreta.db",
          function() {},
          function() {
            copyDatabaseFile('tusciasegreta.db');
          }
        );

        this.db = sqlitePlugin.openDatabase({name: 'copied_tusciasegreta.db'});

    },

    getElencoSiti: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM SITO";

                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var len = results.rows.length,
                            siti = [],
                            i = 0;
                        for (; i < len; i = i + 1) {
                            siti[i] = results.rows.item(i);
                        }
                        callback(siti);
                    }
                );
            }
        );
    },

    getLastSync: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(lastModified) as lastSync FROM employee";
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var lastSync = results.rows.item(0).lastSync;
                        callback(lastSync);
                    }
                );
            }
        );
    },

    sync: function(callback) {

        var self = this;
        log('Starting synchronization...');
        this.getLastSync(function(lastSync){
            self.getChanges(self.syncURL, lastSync,
                function (changes) {
                    if (changes.length > 0) {
                        self.applyChanges(changes, callback);
                    } else {
                        log('Nothing to synchronize');
                        callback();
                    }
                }
            );
        });

    },

    getChanges: function(syncURL, modifiedSince, callback) {

        $.ajax({
            url: syncURL,
            data: {modifiedSince: modifiedSince},
            dataType:"json",
            success:function (data) {
                log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                callback(data);
            },
            error: function(model, response) {
                alert(response.responseText);
            }
        });

    },

    applyChanges: function(employees, callback) {
        this.db.transaction(
            function(tx) {
                var l = employees.length;
                var sql =
                    "INSERT OR REPLACE INTO employee (id, firstName, lastName, title, officePhone, deleted, lastModified) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";
                log('Inserting or Updating in local database:');
                var e;
                for (var i = 0; i < l; i++) {
                    e = employees[i];
                    log(e.id + ' ' + e.firstName + ' ' + e.lastName + ' ' + e.title + ' ' + e.officePhone + ' ' + e.deleted + ' ' + e.lastModified);
                    var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, e.lastModified];
                    tx.executeSql(sql, params);
                }
                log('Synchronization complete (' + l + ' items synchronized)');
            },
            this.txErrorHandler,
            function(tx) {
                callback();
            }
        );
    },

    txErrorHandler: function(tx) {
        alert(tx.message);
    }
};



$('#reset').on('click', function() {
    dao.dropTable(function() {
       dao.createTable();
    });
});


$('#sync').on('click', function() {
    dao.sync(renderList);
});

$('#render').on('click', function() {
    renderList();
});

$('#clearLog').on('click', function() {
    $('#log').val('');
});

function renderList(employees) {
    log('Rendering list using local SQLite data...');
    dao.findAll(function(employees) {
        $('#list').empty();
        var l = employees.length;
        for (var i = 0; i < l; i++) {
            var employee = employees[i];
            $('#list').append('<tr>' +
                '<td>' + employee.id + '</td>' +
                '<td>' + employee.firstName + '</td>' +
                '<td>' + employee.lastName + '</td>' +
                '<td>' + employee.title + '</td>' +
                '<td>' + employee.officePhone + '</td>' +
                '<td>' + employee.deleted + '</td>' +
                '<td>' + employee.lastModified + '</td></tr>');
        }
    });
}

function openDb() {

  database = sqlitePlugin.openDatabase({name: 'copied_tusciasegreta.db'});

  versioneLocale = getValueFromLocalStorage('versione');

  if(versioneLocale == "0") {
    // Sul localstorage non è memorizzato nulla, la prelevo dal DB
    getLocalDBVersion(database);
  }

  if(versione != versioneLocale) {
    // Prelevo il JSON del DB dal server
    getServerDB();

    // Memorizzo la versione del DB che ho prelevato
    removeFromLocalStorage('versione');
    saveOnLocalStorage('versione', versione);

    emptyLocalStorageFromObject();

    // Aggiorno la tabella versione del DB Locale
    updateVersioneDB(database, versione);

  }
}

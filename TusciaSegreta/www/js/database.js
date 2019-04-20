function getServerDBVersion() {

    return $.ajax({
        url:'http://51.75.182.195:1880/checkdb',
        contentType: "application/json",
        dataType: "json",
        async: false
    }).done(function(response) {
      versione = response.versione;
    });
}

function getServerDB() {

  return $.ajax({
      url:'http://51.75.182.195:1880/getdb',
      contentType: "application/json",
      dataType: "json",
      async: false
  }).done(elaboraDb);

}

function locateUser() {

  var dataObject = {};
  dataObject['username'] = getValueFromLocalStorage('nome_utente')=='0'?'guest':getValueFromLocalStorage('nome_utente');
  dataObject['latitudine'] = getValueFromLocalStorage('latitudine');
  dataObject['longitudine'] = getValueFromLocalStorage('longitudine');

  $.ajax({
    type: "POST",
    url: "http://51.75.182.195:1880/locateUser",
    dataType: 'json',
    timeout: 2000,
    data: dataObject,
    async: true,
    //success: console.log("Ok"),
    //error: processUserAddResponse,
  }).complete(function(response) {
    var esito = response.responseText;
    //showMessage("Esito: " + esito);
  });
}


function elaboraDb(response) {

  Object.keys(response).forEach(function(key) {

    var nome_tabella = key;
    //alert("Tabella:" + key)
    if(response[nome_tabella] && response[nome_tabella].length) {

      var sql = createSqlQuery(nome_tabella, Object.keys(response[nome_tabella][0]), response[nome_tabella]);
      popolaTabella(nome_tabella, sql, database);
    }
  });

}

function popolaTabella(nome_tabella, sql, database) {

  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM ' + nome_tabella, []);
    transaction.executeSql(sql, []);
  }, function(error) {
    showMessage('Errore nel caricamento dei dati della tabella: ' + nome_tabella + " - " + error.message);
  }, function() {
    //showMessage(nome_tabella + ' - Dati inseriti.');
  });

}

function createSqlQuery(tableName, columns, obj) {

    this.generatedSqlQuery = `INSERT INTO ${tableName} `
    let columnList = "";
    columnList = columnList + "("
    for (let index = 0; index < columns.length; index++) {
      if (index == columns.length - 1) {
        columnList = columnList + columns[index];
      } else {
        columnList = columnList + columns[index] + ",";
      }
    }
    this.generatedSqlQuery = this.generatedSqlQuery + columnList + ") VALUES ";

    for (let index = 0; index < obj.length; index++) {
      let item = obj[index];

      if (index == columns.length - 1) {
        this.generatedSqlQuery = this.generatedSqlQuery + "(";
        for (var key in obj[index]) {
          if (obj[index].hasOwnProperty(key)) {
            var val = obj[index][key] == null? '' : obj[index][key];
            this.generatedSqlQuery = this.generatedSqlQuery +"'"+ val.toString().replace(/'/g, "''").replace(/\n/g, " ") + "',";
          }
        }
        this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        this.generatedSqlQuery = this.generatedSqlQuery + ")";
        if (index == columns.length - 1) {
          this.generatedSqlQuery = this.generatedSqlQuery + ",";
        }
        if (obj.length == 1) {
          this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        }
      } else {
        this.generatedSqlQuery = this.generatedSqlQuery + "(";
        let length = 0;
        for (var key in obj[index]) {
          length++;
        }
        for (var key in obj[index]) {
          if (obj[index].hasOwnProperty(key)) {
            var val = obj[index][key] == null? '' : obj[index][key];
            this.generatedSqlQuery = this.generatedSqlQuery + "'" + val.toString().replace(/'/g, "''").replace(/\n/g, " ") + "',";
          }
        }
        this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        this.generatedSqlQuery = this.generatedSqlQuery + "),";
        if (obj.length == 1) {
          this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        }

      }
    }
    if (obj.length > 1) {
      this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
    }
    console.log(generatedSqlQuery);
    return this.generatedSqlQuery;
  }

function getLocalDBVersion(database) {

  database.transaction(function(transaction) {

    transaction.executeSql('SELECT * FROM versione_db', [], saveDBLocalVersion, dbSelecterror);

  });
}

function saveDBLocalVersion(tx, resultSet) {

  saveOnLocalStorage('versione', resultSet.rows.item(0).versione);

  versioneLocale = resultSet.rows.item(0).versione;
}

function updateVersioneDB(database, versione) {

  database.transaction(function(transaction) {

    transaction.executeSql('UPDATE versione_db set versione=?', [versione]);

  });
}

function dbSelecterror(error) {
  showMessage('Errore DB: ' + error.message);
}

function getNavigationApp() {
  alert('getNavigationApp()')
  var platform = device.platform.toLowerCase();
  if(platform == "android"){
      platform = launchnavigator.PLATFORM.ANDROID;
  } else if(platform == "ios"){
      platform = launchnavigator.PLATFORM.IOS;
  } else if(platform.match(/win/)){
      platform = launchnavigator.PLATFORM.WINDOWS;
  }

  launchnavigator.getAppsForPlatform(platform).forEach(function(app){
      console.log(launchnavigator.getAppDisplayName(app) + " is supported");
  });
}

function registrazioneDaApp() {

  var form = $("#registrazioneForm");

  var email       = $("#email", form).val();
  var nome_utente = $("#username", form).val();
  var cellulare   = $("#cellulare", form).val();
  var password    = $("#password", form).val();
  var cognome     = $("#cognome", form).val();
  var nome        = $("#nome", form).val();

  if(email != "" && nome_utente != "" && password != '' && cellulare != '' && cognome != '' && nome != '') {

    registraUtente(email, nome_utente, password, cellulare, cognome, nome, database, logIn);
    //registerUserOnCloud(email, nome_utente, password, cellulare, cognome, nome);

  } else {
    showMessage("Tutti i campi sono obbligatori");
    //$("#submitButton").removeAttr("disabled");
  }

  return false;

}

function processDone(response) {

  //console.log("Done...");
  var esito = JSON.parse(response.responseText).httpCode
  //showMessage("risposta: " + esito);

  /*if(esito.indexOf("200") != -1) {
    registraUtente(email, nome_utente, password, cellulare, cognome, nome, database);
  } else if(esito == 401) {
    showMessage("Nome utente e/o indirizzo email già presenti.");
  } else {
    showMessage("Errore nella registrazione, riprovare più tardi.");
  }*/
}

function registraUtente(email, nome_utente, password, cellulare, cognome, nome, database, callback) {
  //showMessage("RegistrazioneUtente su DB locale...");
  // Effettuo la cancellazione preventiva dei record per evitare di avere più di un utente nel DB locale
  database.transaction(function(transaction) {
    transaction.executeSql('DELETE FROM utente', []);
    transaction.executeSql('INSERT INTO utente VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [1, nome_utente, cognome, nome, email, password, '', cellulare, '']);
    transaction.executeSql('select count(*) as recordCount from utente', [], function(ignored, resultSet) {
      //showMessage("Utenti trovati: " + resultSet.rows.item(0).recordCount)
      if(resultSet.rows.item(0).recordCount > 0 ) {

        var latitudine = getValueFromLocalStorage('latitudine');
        var longitudine = getValueFromLocalStorage('longitudine');
        registerUserOnCloud(email, nome_utente, password, cellulare, cognome, nome, latitudine, longitudine);

        callback(nome_utente, password);
      }
    });

  }, function(error) {
    showMessage('Errore nella cancellazione: ' + error.message);
  }, function() {
    showMessage('Registrazione effettuata.');
    fn.gotoPage('accesso.html');
  });

}

function registerUserOnCloud(email, nome_utente, password, cellulare, cognome, nome, latitudine, longitudine) {

    var dataObject = {};
    dataObject['email'] = email;
    dataObject['nome_utente'] = nome_utente;
    dataObject['password'] = password;
    dataObject['telefono'] = cellulare;
    dataObject['cognome'] = cognome;
    dataObject['nome'] = nome;
    dataObject['latitudine'] = latitudine;
    dataObject['longitudine'] = longitudine;

    //console.log("function Called with parameter: " + email + " - " + nome_utente + " - " + password + " - " + cellulare + " - " + cognome + " - " + nome);

    $.ajax({
      type: "POST",
      url: "http://51.75.182.195:1880/adduser",
      dataType: 'json',
      timeout: 2000,
      data: dataObject,
      async: true,
      //success: console.log("Ok"),
      //error: processUserAddResponse,
    })
    .complete(processDone)
    //.done(processDone)
    //.fail(processUserAddResponse)
    ;
}

function logOut() {

  removeFromLocalStorage("loggedUser");
  removeFromLocalStorage("id");
  removeFromLocalStorage("nome_utente");
  removeFromLocalStorage("cognome");
  removeFromLocalStorage("nome");
  removeFromLocalStorage("password");
  removeFromLocalStorage("cellulare");
  removeFromLocalStorage("cittadinanza");
  removeFromLocalStorage("lingua");

  if(getValueFromLocalStorage('loggedUser') == 0) {
    showMessage('Logout avvenuto con successo');
    fn.gotoPage('accesso.html');
  }

}

function getValueFromLocalStorage(key) {

  if(window.localStorage.getItem(key) == null)
    return 0
  else
    return window.localStorage.getItem(key);
}

function saveOnLocalStorage(key, value) {
  window.localStorage.setItem(key, value);
}

function removeFromLocalStorage(key) {
  window.localStorage.removeItem(key);
}


function accessoDaApp() {

  var form = $("#loginForm");
	$("#submitButton",form).attr("disabled","disabled");

	var username = $("#username", form).val();
	var password = $("#password", form).val();

  if(username != "" && password != "")
    logIn(username, password);
  else if(username == "") {
    showMessage("Nome utente obbligatorio");
    $("#submitButton").removeAttr("disabled");
  } else if(password == "") {
    showMessage("Password obbligatoria");
    $("#submitButton").removeAttr("disabled");
  }

  return false;
}


function logIn(login, password) {

  database.transaction(function(transaction) {

    var query = "SELECT * FROM utente WHERE nome_utente = ? and password = ?";

    transaction.executeSql(query, [login, password], function (transaction, resultSet) {

      var trovato = resultSet.rows.length;

      if(trovato > 0) {

        // Utente presente e credenziali ok
        //showMessage("Benvenuto: " + resultSet.rows.item(0).nome_utente + " - " + resultSet.rows.item(0).email + " - " + resultSet.rows.item(0).password + " - " + resultSet.rows.item(0).cellulare);
        saveOnLocalStorage("loggedUser", "1");
        saveOnLocalStorage("id", resultSet.rows.item(0).id);
        saveOnLocalStorage("nome_utente", resultSet.rows.item(0).nome_utente);
        saveOnLocalStorage("cognome", resultSet.rows.item(0).cognome);
        saveOnLocalStorage("nome", resultSet.rows.item(0).nome);
        saveOnLocalStorage("password", resultSet.rows.item(0).password);
        saveOnLocalStorage("cittadinanza", resultSet.rows.item(0).cittadinanza);
        saveOnLocalStorage("cellulare", resultSet.rows.item(0).cellulare);
        saveOnLocalStorage("lingua", resultSet.rows.item(0).lingua);

        //showMessage('Login avvenuto con successo');
        fn.gotoPage("accesso_effettuato.html");

      } else {
        showMessage('Nessun utente trovato!!!');
      }

    },
    function (tx, error) {
        showMessage('Accesso non consentito: ' + error.message);
    });

  }, function(error) {
    showMessage('LOGIN error: ' + error.message);
  }, function() {

  });

}

function showMessage(message) {
  console.log(message);
  if (window.cordova.platformId === 'osx')
    window.alert(message);
  else
    navigator.notification.alert(message);
}

function checkUser() {

  var logged = getValueFromLocalStorage("loggedUser");

  if(logged == 1) {
    fn.gotoPage('accesso_effettuato.html');
  } /*else {
    showMessage('Utente non loggato');
  }*/

}

function checkLoggedAndGoToPage(page) {

  var logged = getValueFromLocalStorage("loggedUser");

  if(logged == 1) {
    fn.gotoPage(page);
  } else {
    fn.gotoPage('accesso.html');
  }
}


function getElencoSiti(database, map, callback) {

  if(database == null) {

    //showMessage("Database non inizializzato");

    var elenco = new Array();

    var riga = new Array();
    riga[0] = "1";
    riga[1] = "denominazione";
    riga[2] = "descrizione";
    riga[3] = "resultSet.rows.item(x).video";
    riga[4] = "42.585280";
    riga[5] = "11.933396";
    riga[6] = "foto_25.jpg";

    elenco[0] = riga;

    callback(map, elenco);

  } else {

    database.transaction(function(transaction) {

      transaction.executeSql('select sito.*, valore, caratteristica.denominazione as denominazione_carat, icona from sito join sito_ha_caratteristica on sito_ha_caratteristica.sito_id=sito.id join caratteristica on caratteristica.id=sito_ha_caratteristica.caratteristica_id order by sito.id', [],  function(transaction, resultSet) {

        var elenco = new Array();

        var sitoId=0, index=0;
        for(var x = 0; x < resultSet.rows.length; x++) {

            var riga;
            if(resultSet.rows.item(x).id != sitoId) {

              sitoId=resultSet.rows.item(x).id;

              // Nuovo sito, creo la riga e inserisco i dati del sito
              riga = new Array();
              riga[0] = resultSet.rows.item(x).id;
              riga[1] = resultSet.rows.item(x).denominazione;
              riga[2] = resultSet.rows.item(x).descrizione;
              riga[3] = resultSet.rows.item(x).video;
              riga[4] = resultSet.rows.item(x).latitudine;
              riga[5] = resultSet.rows.item(x).longitudine;
              riga[6] = resultSet.rows.item(x).miniatura;
              riga[7] = resultSet.rows.item(x).descrizione_breve;

              var carat = new Array();
              carat[0]=resultSet.rows.item(x).valore;
              carat[1]=resultSet.rows.item(x).denominazione_carat;
              carat[2]=resultSet.rows.item(x).icona;

              riga[riga.length]=carat;

              elenco[index] = riga;

              index++;

            } else {
              riga = elenco[elenco.length-1];

              var carat = new Array();
              carat[0]=resultSet.rows.item(x).valore;
              carat[1]=resultSet.rows.item(x).denominazione_carat;
              carat[2]=resultSet.rows.item(x).icona;

              riga[riga.length]=carat;

              elenco[elenco.length-1] = riga;
            }

        }

        callback(map, elenco);

      }, dbSelecterror);
    });
  }

}

function getSito(id, database, callback)
{
  if(database != null) {

    database.transaction(
        function(transaction) {
          transaction.executeSql('select * from sito join sito_ha_caratteristiche on sito_ha_caratteristiche.sito_id=sito.id where id=?', [id], function(transaction, resultSet) {

            var riga = new Array();
            riga[0] = resultSet.rows.item(0).id;
            riga[1] = resultSet.rows.item(0).denominazione;
            riga[2] = resultSet.rows.item(0).descrizione;
            riga[3] = resultSet.rows.item(0).video;
            riga[4] = resultSet.rows.item(0).latitudine;
            riga[5] = resultSet.rows.item(0).longitudine;
            riga[6] = resultSet.rows.item(0).miniatura;
            riga[7] = resultSet.rows.item(0).descrizione_breve;

            callback(riga);

          }, dbSelecterror);
        }
    );

  } else {
    showMessage("Database non inizializzato");
  }

}

function setSitoInfo(sito) {

  $(".title").html(sito[1]);
  document.getElementById('video').src=sito[3].toString().replace(/watch\?v=/g, "embed/");
  $(".content").html(sito[2]+"<br><br><br><br><br><br>");
}

function setSitoCoords(sito) {

  $("#latitudine").val(sito[4]);
  $("#longitudine").val(sito[5]);

  renderGoogleMaps();
}

function getPercorsoSito(id, database, map, callback)
{
  if(database != null) {
    database.transaction(function(transaction) {

      transaction.executeSql('SELECT * FROM percorso where sito_id=?', [id], function(transaction, resultSet) {

        var p = new Array();
        p[0] = resultSet.rows.item(0).id;
        p[1] = resultSet.rows.item(0).sito_id;
        p[2] = resultSet.rows.item(0).descrizione;
        p[3] = resultSet.rows.item(0).gpx;
        p[4] = resultSet.rows.item(0).denominazione;

        callback(p, map);

      }, dbSelecterror);
    });
  } else {
    showMessage("Database non inizializzato.");
  }
}

function getNodiPercorsoSito(id, database, map, callback)
{
  if(database != null) {
    database.transaction(function(transaction) {

      transaction.executeSql('SELECT nodo.id, nodo.latitudine, nodo.longitudine, nodo.percorso_id, nodo.descrizione, nodo.nome from nodo inner join percorso on percorso.id=nodo.percorso_id where percorso.sito_id=?', [id], function(transaction, resultSet) {

        var elenco = new Array();

        for(var x = 0; x < resultSet.rows.length; x++) {

          var riga = new Array();
          riga[0] = resultSet.rows.item(x).id;
          riga[1] = resultSet.rows.item(x).latitudine;
          riga[2] = resultSet.rows.item(x).longitudine;
          riga[3] = resultSet.rows.item(x).percorso_id;
          riga[4] = resultSet.rows.item(x).descrizione;
          riga[5] = resultSet.rows.item(x).nome;

          elenco[x] = riga;
        }

        callback(elenco, map);

      }, dbSelecterror);
    });

  }
}

function getGalleriaSito(id, database, callback)
{

  if(database != null) {

    database.transaction(function(transaction) {

        transaction.executeSql('select multimedia.id, multimedia.oggetto, multimedia.descrizione from multimedia join sito_ha_multimedia on multimedia.id=sito_ha_multimedia.multimedia_id where sito_ha_multimedia.sito_id=? and multimedia.stato=1 and multimedia.tipo_multimedia_id=2', [id],

          function(transaction, resultSet) {
            var elenco = new Array();

            for(var x=0; x<resultSet.rows.length; x++) {

              var riga = new Array();
              riga[0] = resultSet.rows.item(x).id;
              riga[1] = resultSet.rows.item(x).oggetto;
              riga[2] = resultSet.rows.item(x).descrizione;

              elenco[x] = riga;
            }

            callback(elenco);

          }, dbSelecterror);
    });
  } else {
    showMessage('Database non inizializzato');
  }

}


function getPuntiInteresseSito(id, database, map, callback)
{

  if(database != null) {

    database.transaction(function(transaction) {

        transaction.executeSql('select punto_di_interesse.id, punto_di_interesse.denominazione, punto_di_interesse.descrizione, telefono, latitudine, longitudine, sito_web, indirizzo, icona, tipo_punto_di_interesse_id, tipo_punto_di_interesse.denominazione as punto_interesse_deno ' +
            'from sito_ha_punto_di_interesse join punto_di_interesse on punto_di_interesse.id=sito_ha_punto_di_interesse.punto_di_interesse_id ' +
            'join tipo_punto_di_interesse on tipo_punto_di_interesse.id=punto_di_interesse.tipo_punto_di_interesse_id ' +
            'where sito_id=? order by tipo_punto_di_interesse_id', [id],

          function(transaction, resultSet) {

            var elenco = new Array();

            for(var x=0; x<resultSet.rows.length; x++) {

              var riga = new Array();
              riga[0] = resultSet.rows.item(x).id;
              riga[1] = resultSet.rows.item(x).denominazione;
              riga[2] = resultSet.rows.item(x).descrizione;
              riga[3] = resultSet.rows.item(x).telefono;
              riga[4] = resultSet.rows.item(x).sito_web;
              riga[5] = resultSet.rows.item(x).latitudine;
              riga[6] = resultSet.rows.item(x).longitudine;
              riga[7] = resultSet.rows.item(x).icona;
              riga[8] = resultSet.rows.item(x).tipo_punto_di_interesse_id;
              riga[9] = resultSet.rows.item(x).indirizzo;
              riga[10] = resultSet.rows.item(x).punto_interesse_deno;

              elenco[x] = riga;
            }

            callback(map, elenco);

          }, dbSelecterror);
    });
  } else {
    showMessage('Database non inizializzato');
  }

}


function getTipoPuntiInteresse(database, callback)
{

  if(database != null) {

    database.transaction(function(transaction) {

        transaction.executeSql('select * from tipo_punto_di_interesse', [],

          function(transaction, resultSet) {

            var elenco = new Array();

            for(var x=0; x<resultSet.rows.length; x++) {

              var riga = new Array();
              riga[0] = resultSet.rows.item(x).id;
              riga[1] = resultSet.rows.item(x).denominazione;
              riga[2] = resultSet.rows.item(x).icona;

              elenco[x] = riga;
            }

            callback(elenco);

          }, dbSelecterror);
    });
  } else {
    showMessage('Database non inizializzato');
  }

}

function getCaratteristichePercorsoSito(id, database)
{
  //showMessage("caratteristiche per sito: " + id);
  if(database != null) {
    database.transaction(function(transaction) {
      transaction.executeSql('select percorso_ha_caratteristica.*, caratteristica.denominazione, caratteristica.icona, percorso.sito_id from percorso_ha_caratteristica join percorso on percorso.id=percorso_ha_caratteristica.percorso_id JOIN caratteristica ON caratteristica.id=percorso_ha_caratteristica.caratteristica_id where percorso.sito_id=?', [id], saveCaratteristiche, dbSelecterror);
    });

  } else {
    saveCaratteristiche(null, null);

  }

}

function saveCaratteristiche(tx, resultSet)
{
    var elenco = new Array();

    if(tx == null && resultSet == null) {

    } else {

      for(var x = 0; x < resultSet.rows.length; x++) {
        var riga = new Array();
        riga[0] = resultSet.rows.item(x).id;
        riga[1] = resultSet.rows.item(x).percorso_id;
        riga[2] = resultSet.rows.item(x).caratteristica_id;
        riga[3] = resultSet.rows.item(x).valore;
        riga[4] = resultSet.rows.item(x).stato;
        riga[5] = resultSet.rows.item(x).denominazione;
        riga[6] = resultSet.rows.item(x).icona;
        riga[6] = resultSet.rows.item(x).sito_id;

        elenco[x] = riga;
      }

      localStorage.setObj('caratteristiche', elenco);

    }
}

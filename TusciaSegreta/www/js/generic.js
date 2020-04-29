

  window.fn = {};

  window.fn.open = function() {
    var menu = document.getElementById('menu');
    menu.open();
  };

  window.fn.load = function(page) {

    saveHistory(page);

    if(document.getElementById('mapid') != null)
    {
      if(page != 'map.html') {
        var content = document.getElementById('content');
        var menu = document.getElementById('menu');
        content.load(page).then(menu.close.bind(menu));
      }

    } else {
      var content = document.getElementById('content');
      var menu = document.getElementById('menu');
      content.load(page).then(menu.close.bind(menu));
    }

  };

  window.fn.gotoPage = function(page) {

    saveHistory(page);

    //printHistory();

    $("iframe").each(function() {
        var src= $(this).attr('src');
        $(this).attr('src',src);
    });

    if(document.getElementById('mapid') != null)
    {
      if(page != 'map.html') {
        var content = document.getElementById('content');
        content.load(page);
      }
    } else if(document.getElementById('naviga') != null) {

      if(page != 'naviga.html') {
        var content = document.getElementById('content');
        content.load(page);
      }
    } else if(document.getElementById('esplora') != null) {

      if(page != 'esplora.html') {
        var content = document.getElementById('content');
        content.load(page);
      }
    } else {
      var content = document.getElementById('content');
      content.load(page);
    }
  };

  var login = function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'test' && password === 'test') {
      ons.notification.alert('Accesso consentito!');
    } else {
      ons.notification.alert('Username/Password non corretti.');
    }
  };

  function openSection(numero) {

    if(numero == 1) {
      document.querySelector('#item1').showExpansion();
      document.querySelector('#item2').hideExpansion();
      document.querySelector('#item3').hideExpansion();
    } else if(numero == 2) {
      document.querySelector('#item1').hideExpansion();
      document.querySelector('#item2').showExpansion();
      document.querySelector('#item3').hideExpansion();
    } else {
      document.querySelector('#item1').hideExpansion();
      document.querySelector('#item2').hideExpansion();
      document.querySelector('#item3').showExpansion();
    }

  };

  function stopVideo() {
    $("iframe").each(function() {
        var src= $(this).attr('src');
        $(this).attr('src',src);
    });
  }


  function checkConnection() {

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    return networkState;
  }

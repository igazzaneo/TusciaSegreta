  window.fn = {};

  window.fn.open = function() {
    var menu = document.getElementById('menu');
    menu.open();
  };

  window.fn.load = function(page) {

    if(window.location.href.indexOf(page) == -1) {
      var content = document.getElementById('content');
      var menu = document.getElementById('menu');
      content.load(page)
        .then(menu.close.bind(menu));
    }

  };

  window.fn.gotoPage = function(page) {
    if(window.location.href.indexOf(page) == -1) {
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

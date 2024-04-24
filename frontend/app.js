let keycloakUrl = "http://34.129.104.133:8080/auth"

var script = document.createElement('script');
const xhttpr = new XMLHttpRequest();
script.type = 'text/javascript';
script.src = keycloakUrl+"/js/keycloak.js";

document.getElementsByTagName('head')[0].appendChild(script);

window.onload = function () {

  window.keycloak = new Keycloak();

  keycloak.init({onLoad: 'login-required',promiseType: 'native', scope:'openid email profile', checkLoginIframe: false, checkLoginIframeInterval: 1, pkceMethod: 'S256'})
    .then(function () {

      if (keycloak.authenticated) {
        showProfile();
      } else {
        welcome();
      }

      document.body.style.display = 'block';
    });

  keycloak.onAuthLogout = welcome;
};

function portal() {
  window.location.href = keycloak.createAccountUrl({}).replace('account', 'portal');
}

function welcome() {
  show('welcome');
}

function showProfile() {

  if (keycloak.tokenParsed['given_name']) {
    document.getElementById('firstName').innerHTML = keycloak.tokenParsed['given_name'];
  }
  if (keycloak.tokenParsed['family_name']) {
    document.getElementById('lastName').innerHTML = keycloak.tokenParsed['family_name'];
  }
  if (keycloak.tokenParsed['preferred_username']) {
    document.getElementById('username').innerHTML = keycloak.tokenParsed['preferred_username'];
  }
  if (keycloak.tokenParsed['email']) {
    document.getElementById('email').innerHTML = keycloak.tokenParsed['email'];
  }

  show('profile');
}

function showToken() {
  console.log(keycloak.token)
  document.getElementById('token-content').innerHTML = JSON.stringify(keycloak.tokenParsed, null, '    ');
  show('token');
}

function showIdToken() {
  console.log(keycloak.token)
  document.getElementById('token-content').innerHTML = JSON.stringify(keycloak.idTokenParsed, null, '    ');
  show('token');
}

function showUserinfo() {
  keycloak.loadUserInfo()
    .then(function(profile) {
      document.getElementById('token-content').innerHTML = JSON.stringify(profile, null, '    ');
      show('token');
    }).catch(function() {
      alert('Failed to load user profile');
    });
}


function callBackend() {


  // Set the authorization header with the access token
  const headers = {
    Authorization: 'Bearer ' + keycloak.token
  };
fetch('http://localhost:3002/admin', { headers })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the retrieved data, e.g., display it on the webpage
      document.getElementById('token-content').innerHTML = JSON.stringify(data, null, '    ');
    })
    .catch(error => {
      // Handle errors, e.g., token expiration, network issues, etc.
      console.error('Error fetching data:', error);
	document.getElementById('token-content').innerHTML ='<p>Access Denied!</p>';
    });
}

function callUBackend() {


  // Set the authorization header with the access token
  const headers = {
    Authorization: 'Bearer ' + keycloak.token
  };
fetch('http://localhost:3002/user', { headers })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the retrieved data, e.g., display it on the webpage
      document.getElementById('token-content').innerHTML = JSON.stringify(data, null, '    ');
    })
    .catch(error => {
      // Handle errors, e.g., token expiration, network issues, etc.
      console.error('Error fetching data:', error);
	document.getElementById('token-content').innerHTML ='<p>Access Denied!</p>';
    });
}


function show(id) {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('profile').style.display = 'none';
  document.getElementById('token').style.display = 'none';
  document.getElementById(id).style.display = 'block';
}


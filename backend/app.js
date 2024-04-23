const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Keycloak = require('keycloak-connect');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware());

app.get('/public', function (req, res) {
  res.json({message: 'public'});
 console.log(req.body.message);
});

app.get('/admin', keycloak.protect('realm:admin'), function (req, res) {
  const message = req.body.message;
  console.log(message);
  res.json({message: 'Only accessible to admins!'});
});

app.get('/user', keycloak.protect('realm:myrole'), function (req, res) {
  const message = req.body.message;
  console.log(message);
  res.json({message: 'General user access to service!'});
});

app.use('*', function (req, res) {
  res.status(404).send('Not found');
});

app.listen(3002, function () {
  console.log('Started at port 3002');

});

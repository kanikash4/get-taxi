const express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./src/routes');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
routes(app);

http.createServer(app)
  .on('error', function (err) {
    console.log("[Error] ", err);
    process.exit(1);
  })
  .listen(app.get('port'), function () {
    console.log("Taxi service listening on port " + app.get('port'));
  });
const express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var webpack = require('webpack');
var wdm = require('webpack-dev-middleware');
var whm = require('webpack-hot-middleware');
const compiler = webpack(require('./webpack.config'));
var app = express();
app.use(wdm(compiler, {publicPath: '/'}));
app.use(whm(compiler,  {path: '/__webpack_hmr'}));
var routes = require('./src/server/routes');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'doc')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/', routes);

http.createServer(app)
  .on('error', function (err) {
    console.log("[Error] ", err);
    process.exit(1);
  })
  .listen(app.get('port'), function () {
    console.log("Taxi service listening on port " + app.get('port'));
});
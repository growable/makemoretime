//app.js

var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var apiRoutes    = require('./routes/api/index');
var debug        = require('debug')('makemoretime');
var app          = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiRoutes);

module.exports = app;

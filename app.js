var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var apiRoutes = require('./routes/api/index');
var apiRoutes = require('./routes/job/index');
var debug = require('debug')('makemoretime');
var app = express();
var fs = require('fs');

// 支持跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');

  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// api
// app.use('/api', apiRoutes);

// job

app.use('/job', jobRoutes)

// 404...
app.use(function(req, res, next) {
  next();
})

// Error
app.use(function (err, req, res, next) {
  res.sender('Hello!')
})


module.exports = app;
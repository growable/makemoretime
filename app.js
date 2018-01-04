//app.js

var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var apiRoutes    = require('./routes/api/index');
var debug        = require('debug')('makemoretime');
var app          = express();
var fs           = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//api
app.use('/api', apiRoutes);

//spider
if (process.argv[2] && process.argv[2] === 'spider') {
    var params = process.argv.splice(3);
    var cf = './spider/controller/' + params[0] + '.js';

    fs.exists(cf, function(exists) {
        if (!exists) {
            console.log('Controller ' + params[0] + ' not exist.');
            process.exit();
        }

        var c = require(cf);

        params.length > 1 ? c[params[1]](params.splice(2)) : c.index();

    });
}

//end spider

module.exports = app;

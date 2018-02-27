var packageJSON   = require('./package.json');
var configProfile = require('./config.profile');

var ENV  = 'fat';
var PORT = '3000';

if (packageJSON.config && packageJSON.config.env) {
  ENV = packageJSON.config.env.toLowerCase();
}

if (packageJSON.config && packageJSON.config.port) {
  PORT = packageJSON.config.port;
}

var config = configProfile[ENV] ? configProfile[ENV] : {};

config.ServerPort  = PORT;
config.ProjectRoot = configProfile.root;

module.exports= config;

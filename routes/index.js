var express = require('express');
var router = express.Router();

var apiRoutes = require('./api');
var jobRoutes = require('./job');

router.all('/api/*', apiRoutes);
router.all('/job/*', jobRoutes);

module.exports = router;

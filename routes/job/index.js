var express = require('express');
var router = express.Router();

var ipRoutes = require('./ip');

router.all('/ip/', ipRoutes);

module.exports = router;
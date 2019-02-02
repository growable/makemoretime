// const mongoose = require('mongoose').set('debug', true);
const mongoose = require('mongoose');
const config = require('../config/mongo_config');

mongoose.connect(config.db, {
  poolSize: 20,
  useCreateIndex: true,
  useNewUrlParser: true
}, function (err) {
  if (err) {
    console.log('mongo db connect error: %s', err);
    process.exit(1);
  }
});

// require('./lianjia_house');

// exports.House = mongoose.model('House');
module.exports = mongoose;

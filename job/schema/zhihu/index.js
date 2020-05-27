// const mongoose = require('mongoose').set('debug', true);
const mongoose = require('mongoose');
const config = require('../../config/mongo_config');

let db = mongoose.createConnection(config.db['zhihu'], {
  poolSize: 20,
  useCreateIndex: true,
  useNewUrlParser: true
});
db.on('error', () => {
  console.log('zhihu Mongoose connection error')
});
db.on('connected', () => {
  // console.log('Mongoose connection success')
});

module.exports = db;

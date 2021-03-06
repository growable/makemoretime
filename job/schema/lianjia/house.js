const mongoose = require('mongoose');
const db = require('./index');
const moment = require('moment');

let HouseSchema = new mongoose.Schema({
  houseImg: { type: String },
  houseCode: { type: String },
  houseUrl: { type: String },
  houseTitle: { type: String },
  houseXiaoQuCode: {type: String },
  houseInfo: { type: String },
  houseFloor: { type: String },
  followInfo: { type: String },
  totalPrice: { type: String },
  unitPrice: { type: String },
  property: { type: Object },
  city: { type: Object },
  zone: { type: Array },
  updateTime: { type: Date, default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
});

module.exports = db.model('house', HouseSchema, 'house');
const mongoose = require('../index');
const moment = require('moment');

let HouseSchema = new mongoose.Schema({
  houseImg: { type: String},
  houseCode: { type: String},
  houseUrl: { type: String},
  houseTitle: { type: String},
  houseXiaoQuCode: {type: String},
  houseInfo: { type: String},
  houseFloor: { type: String},
  followInfo: { type: String},
  totalPrice: { type: String},
  unitPrice: { type: String},
  property: { type: Object},
  updateTime: { type: Date, default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
});

// HouseSchema.index({houseCode: 1});
module.exports = mongoose.model('house', HouseSchema, 'house');
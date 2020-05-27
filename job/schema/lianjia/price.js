const mongoose = require('mongoose');
const db = require('./index');

let PriceSchema = new mongoose.Schema({
  houseCode: { type: String },
  housePrice: { type: Number },
  date: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
});

// HouseSchema.index({houseCode: 1});
module.exports = db.model('houseprice', PriceSchema, 'houseprice');
const mongoose = require('../index');
const Schema = mongoose.Schema;

let PriceSchema = new Schema({
  houseCode: { type: String },
  housePrice: { type: Number },
  date: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
});

// HouseSchema.index({houseCode: 1});
module.exports = mongoose.model('houseprice', PriceSchema, 'houseprice');
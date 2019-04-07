const mongoose = require('mongoose');
const db = require('./index');

let CitySchema = new mongoose.Schema({
  cityName: {type: String},
  cityUrl: { type: String },
  zone: {type: Array},
  createTime: { type: Date, default: Date.now},
  updateTime: { type: Date, default: Date.now}
});

// HouseSchema.index({houseCode: 1});
module.exports = db.model('city', CitySchema);
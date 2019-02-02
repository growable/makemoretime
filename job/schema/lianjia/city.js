const mongoose = require('../index');
const Schema = mongoose.Schema;

let CitySchema = new Schema({
  cityName: {type: String},
  cityUrl: { type: String },
  zone: {type: Array},
  createTime: { type: Date, default: Date.now},
  updateTime: { type: Date, default: Date.now}
});

// HouseSchema.index({houseCode: 1});
module.exports = mongoose.model('city', CitySchema, 'city');
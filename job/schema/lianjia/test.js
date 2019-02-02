const mongoose = require('../index');
const Schema = mongoose.Schema;

let TestSchema = new Schema({
  name: { type: String },
  value: { type: String }
});

// HouseSchema.index({houseCode: 1});
module.exports = mongoose.model('test', TestSchema, 'test');
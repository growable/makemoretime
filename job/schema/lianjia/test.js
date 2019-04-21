const mongoose = require('mongoose');
const db = require('./index');

let TestSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: String }
});

// HouseSchema.index({houseCode: 1});
module.exports = db.model('test', TestSchema, 'test');
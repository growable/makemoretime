const mongoose = require('../index');
const Schema = mongoose.Schema;

let UsersSchema = new Schema({
  id: { type: String }, // id
  name: { type: String }, // 名称
  gender: { type: Number }, // 性别
  headline: { type: String }, // 一句话简介
  userType: { type: String }, // 用户类型
  avatarUrl: { type: String }, // 头像
  urlToken: { type: String }, // url标记
  livePlace: { type: String }, // 居住地
  industry: { type: String }, // 所在行业
  education: { type: Array }, // 教育经历
  answers: { type: Number }, // 回答数
  asks: { type: Number }, // 提问数
  posts: { type: Number }, // 文章数
  brief: { type: Number }, // 简介
  pins: { type: Number }, //想法
  thanks: { type: Number }, // 获得的感谢数
  collections: { type: Number }, // 获得的收藏数
  following: { type: Number }, // 关注其他人数
  followers: { type: Number }, // 其他关注他的人数
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
});

// HouseSchema.index({houseCode: 1});
module.exports = mongoose.model('users', UsersSchema, 'users');
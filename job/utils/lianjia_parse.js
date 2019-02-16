const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');

/**
 * 解析页面获取城市下载区级列表
 * @param {*} pageContent
 * @param {*} callback
 */
exports.cityZone = function (pageContent, callback) {
  const $ = cheerio.load(pageContent);
  const currentTime = moment().utcOffset(-8).format('YYYY-MM-DD HH:mm:ss');
  let zoneList = [];
  let tmp = {};
  let zoneArr = [];
  // console.log($('.position div').attr('data-role', 'ershoufang').children('div').children('a'))
  $('.position div').attr('data-role', 'ershoufang').children('div').first().children('a')
    .each(function (index, item) {
    tmp = {};
    tmp.zoneName = $(item).text();
    tmp.zoneUrl = item.attribs.href;
    if (tmp.zoneUrl !== '') {
      zoneArr = tmp.zoneUrl.split('/');
      tmp.zonePinyin = zoneArr[zoneArr.length - 2] || '';
    }
    tmp.updateTime = currentTime;
    tmp.createTime = currentTime;
    zoneList.push({zone: tmp});
  });
  // console.log(zoneList)
  callback(null, zoneList);
};

/**
 * 解析城市页面
 * @param {*} pageContent
 * @param {*} callback
 */
exports.city = function (pageContent, callback) {
  const $ = cheerio.load(pageContent);
  const currentTime = moment().utcOffset(-8).format('YYYY-MM-DD HH:mm:ss');
  let houses = [];
  let tmp = {};
  $('.sellListContent li').each(function(index, item) {
    tmp = {};
    // console.log(item)
    // tmp._id = moment().valueOf() * 1000 + Math.floor(Math.random(0, 1) * 10000) + '';
    tmp.houseImg = $(item).find('.lj-lazy').attr('src');
    tmp.houseCode = $(item).find('a').attr('data-housecode');
    tmp.houseUrl = $(item).find('a').attr('href');
    tmp.houseTitle = $(item).find('.title').children('a').text();
    tmp.houseXiaoQuCode = $(item).find('.houseInfo').children('a').attr('href');
    tmp.houseInfo = $(item).find('.houseInfo').text();
    tmp.houseFloor = $(item).find('.positionInfo').text();
    tmp.followInfo = $(item).find('.followInfo').text();
    tmp.totalPrice = $(item).find('.totalPrice').children('span').text();
    tmp.unitPrice = $(item).find('.unitPrice').text();
    tmp.updateTime = currentTime;
    houses.push(tmp);
  });
  callback(null, houses);
};
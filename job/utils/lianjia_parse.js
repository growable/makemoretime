const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');
const _ = require('lodash');
const tUtils = require('./tools');

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
  pageContent = null
  callback(null, houses);
};

/**
 * 解析详情页信息
 * @param {*} pageContent 
 */
exports.houseDetail = function (pageContent) {
  const $ = cheerio.load(pageContent);
  const currentTime = moment().utcOffset(-8).format('YYYY-MM-DD HH:mm:ss');
  let tmp = { property: {}, city: {}, zone: {}};
  $('.content ul li').each(function(index, item) {
    const type = $(item).find('span').text();
    let value = '';
    if ($(item).children()[0] !== undefined) {
      value = $(item).children()[0].next.data.trim();
    }
    if (type === '房屋户型') {
      tmp.property.rooms = value
    } else if (type === '所在楼层') {
      tmp.property.currentFloor = value
    } else if (type === '建筑面积') {
      tmp.property.structureAreas = value
    } else if (type === '户型结构') {
      tmp.property.structure = value
    } else if (type === '套内面积') {
      tmp.property.insideArea = value
    } else if (type === '建筑类型') {
      tmp.property.structureType = value
    } else if (type === '房屋朝向') {
      tmp.property.buildingHead = value
    } else if (type === '建筑结构') {
      tmp.property.buildingStructure = value
    } else if (type === '装修情况') {
      tmp.property.decorate = value
    } else if (type === '梯户比例') {
      tmp.property.elevatorRatio = value
    } else if (type === '配备电梯') {
      tmp.property.elevatorNum = value
    } else if (type === '产权年限') {
      tmp.property.periodYear = value
    }
  });

  // 城市信息
  const city = pageContent.match(/city_id\:.*\'(.*?)\'/ig);
  if (!_.isNil(city) && city.length > 0) {
    tmp.city.id = tUtils.clearStr(city[0], ['city_id: ', '\'']);
  }
  const cityCode = pageContent.match(/city_abbr\:.*\'(.*?)\'/ig);
  if (!_.isNil(cityCode) && cityCode.length > 0) {
    tmp.city.code = tUtils.clearStr(cityCode[0], ['city_abbr: ', '\'']);
  }
  const cityName = pageContent.match(/city_name\:.*\'(.*?)\'/ig);
  if (!_.isNil(cityName) && cityName.length > 0) {
    tmp.city.name = tUtils.clearStr(cityName[0], ['city_name: ', '\'']);
  }

  //小区
  const communityInfo = $('.aroundInfo .communityName .info');
  tmp.zone.community = communityInfo.text();
  const communityId = communityInfo.attr('href');
  if (!_.isNil(communityId) && communityId !== '') {
    const communityArr = communityId.split('/');
    tmp.zone.communityId = communityArr[2] || '';
  }

  // 区
  const zones = $('.aroundInfo .areaName .info a');
  if (zones.length > 0) {
    tmp.zone.zone = [];
    zones.each((index, item) => {
      const idArr = $(item).attr('href').split('/');
      tmp.zone.zone.push({
        id: idArr[2],
        name: $(item).text()
      });
    });
  }

  return tmp;
}

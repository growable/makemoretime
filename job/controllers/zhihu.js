const Crawler = require('../utils/crawler');
const _ = require ('lodash');
const moment = require('moment');
const zhihuModel = require('../models/zhihu_model');

/**
 * 第一次初始化获取部分用户数据
 * userName=mishisi
 */
exports.usersInit = async function (params = {}) {
  const userName = params[0] || '';
  let url = 'https://www.zhihu.com/api/v4/members/' + userName + '/followers?' +
              'include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2C' +
              'follower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3D' +
              'best_answerer)%5D.topics&offset=0&limit=20';

  for (let page = 0; page < 10000; page++) {
    if (url === '') {
      break;
    }

    try {
      const pageData = await Crawler.getSync({ url: url });
      // console.log(pageData)
      let pageContent = JSON.parse(pageData.body)|| {};
      if (!_.isNil(pageContent.paging) && !_.isNil(pageContent.paging.next)) {
        url = pageContent.paging.next;
      } else {
        url = '';
      }

      if (!_.isNil(pageContent.data) && pageContent.data.length > 0) {
        for (const user of pageContent.data) {
          const userMatch = {
            id: user.id || '',
            name: user.name || '',
            avatarUrl: user.avatar_url_template ? user.avatar_url_template.replace('{size}', 'xl') : '',
            urlToken: user.url_token || '',
            answers: user.answer_count || 0,
            gender: user.gender || 0,
            headline: user.headline || '',
            userType: user.user_type || '',
            updateTime: moment().format('YYYY-MM-DD HH:mm:ss')
          };
          const userDetails = await zhihuModel.getUserById(user.id);

          if (userDetails.length > 0) {
            await zhihuModel.updateUserDetail(userMatch, user.id);
            console.log('Update -- ' + user.name);
          } else {
            await zhihuModel.addUserDetail(userMatch);
            console.log('Add -- ' + user.name);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

/**
 * 获取用户数据
 */
exports.users = async function () {

};

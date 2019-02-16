var cronJob = require("cron").CronJob;

const ip = require('./controllers/ip');
const lianjia = require('./controllers/lianjia');

//每5分钟获取一次ip
new cronJob('0 */1 * * * *', function () {
  ip.get({}, function (err, result) {
    console.log(err)
  });
}, null, true, 'Asia/Chongqing');

//每5分钟验证一次ip
new cronJob('0 */5 * * * *', function () {
  ip.check({}, function (err, result) {
    console.log(err)
  });
}, null, true, 'Asia/Chongqing');

//每天执行一次获取二手房价格数据
new cronJob('1 0 * * * *', function () {
  lianjia.house({}, function (err, result) {
    console.log(err)
  });
}, null, true, 'Asia/Chongqing');

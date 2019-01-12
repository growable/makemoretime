/**
 * 调用方法
 * node index ip getIPs 11 22
 */
const _ = require('lodash');
const router = require('./router');

const args = process.argv;
const controller = args[2] || '';
const method = args[3] || '';
const params = Object.assign({}, args.splice(4));

// 检查控制器
if (!_.has(router, controller)) {
  console.log('Controller not exists');
  process.exit(0);
}

// 检查方法
if (!_.isFunction(router[controller][method])) {
  console.log('Method not exists');
  process.exit(0);
}

// 调用方法
(async () => function(){})()
.then (function() {
  router[controller][method](params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // console.log(result);
      console.log('exit');
    }
    process.exit(1);
  });
})
.catch (function (e) {
  console.log(e);
})


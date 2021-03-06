const _ = require('lodash');

/**
 * 清除指定字符串
 * @param {*} str 
 * @param {*} replace 
 */
exports.clearStr = function (str = '', replace = []) {
  if (_.isArray(replace)) {
    replace.forEach((item) => {
      str = str.replace(new RegExp(item, 'g'), '');
    });
  } else {
    str = str.replace(new RegExp(replace, 'g'), '');
  }

  return str;
}

/**
 * sleep
 * @param {*} time
 */
exports.sleep = function(time = 0) {
  const holder = new Promise(function (resolve, reject) {
    setTimeout(function (){
      resolve();
    }, time)
  });

  return holder;
};
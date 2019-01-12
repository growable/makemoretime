module.exports = [
  {
    name: 'xici',
    url: 'https://www.xicidaili.com/{type}/{pageNo}',
    type: ['nn'],
    pages: 5, // 需要获取页数
    regExp: '<tr class=".*?">[\s\S]*?<\/tr>' // 正则获取ip, port，city 字段
  }
];

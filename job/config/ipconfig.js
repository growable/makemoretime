module.exports = [
  {
    name: 'xici',
    url: 'https://www.xicidaili.com/{type}/{pageNo}',
    type: ['nn'],
    pages: 5, // 需要获取页数
    regExp: /<tr class=".*?">[\s\S]*?<td>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/g // 正则获取ip, port，city 字段
  },
  {
    name: 'kuaidaili',
    pages: 5, // 需要获取页数
    type: ['inha', 'intr'],
    url: 'http://www.kuaidaili.com/free/{type}/{pageNo}',
  },
  {
    name: '66daili',
    pages: 1, // 需要获取页数
    type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    url: 'http://www.66ip.cn/areaindex_{type}/{pageNo}.html'
  }
];

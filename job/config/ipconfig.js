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
  }
];

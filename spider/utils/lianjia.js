var cheerio = require('cheerio');

class LianjiaUtils {
  /**
   * filter page house urls
   * @param {*} html 
   * @param {*} callback 
   */
  filterHouseListUrls (html = '', callback) {
    let $ = cheerio.load(html)
    let houses = []
    let detail = {}
    
    $('.sellListContent li').each(function(idx, element) {
      let list = $(element);
      detail = {}
      detail.url = list.find('a').attr('href')
      detail.houseId = list.find('a').attr('data-housecode')
      detail.houseName = list.find('.title a').text()
      detail.address = list.find('.houseInfo a').text()
      detail.floor = list.find('.positionInfo').text()
      detail.tagSubway = list.find('.tag .subway').text()
      detail.tagTaxfree = list.find('.tag .taxfree').text()
      detail.tagHaskey = list.find('.tag .haskey').text()
      detail.totalPrice = list.find('.totalPrice span').text()

      houses.push(detail);
    });

    callback(null, houses);
  }
  /**
   * get house deatil data
   * @param {*} html 
   * @param {*} callback 
   */
  getHouseDetailInfo (html, callback) {

  }
}

module.exports = exports = new LianjiaUtils()
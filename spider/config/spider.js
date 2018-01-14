//spider config
module.exports = {
    "house":{
        lianjia:{
            domain       : 'lianjia.com',
            city         : ['sh'], //城市信息暂时配置到文件
            houseType    : ['ershoufang','zufang'],
            ershoufang   : ['p21','p22','p23','p24','p25','p26','p27'], //p21表示200W以下，p22表示200W～300W
            // loupan       : ['price1', 'price2', 'price3', 'price4', 'price5', 'price6', 'price7', 'price8'],
            zufang       : ['z1','z2','z3','z4','z5','z6'], //租房价格范围，在表示1000～2000
            maxPage      : 20
        },
        wiwj:{}
    },
    "ip":{
        "xici":{
            type    : ['nn', 'nt', 'wt'],
            maxPage : 5,
            url     : 'http://www.xicidaili.com/[type]/[page]',
            pattern : '<tr.*?>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<\/tr>'
        },
        "kuaidaili":{
            type    : ['inha','intr'],
            maxPage : 5,
            url     : 'http://www.kuaidaili.com/free/[type]/[page]/',
            pattern : '/<tr>[\s\S]*?<td data-title="IP">(.*?)<\/td>[\s\S]*?<td data-title="PORT">(.*?)<\/td>[\s\S]*?<\/tr>/i'
        },
        "66daili":{
            type    : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
            maxPage : 1,
            url     : 'http://www.66ip.cn/areaindex_[type]/[page].html',
            pattern : '/tr><td>(.*?)<\/td><td>(.*?)<\/td>[\s\S]*?<\/tr>/i'
        }
    }
}

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
        }
    }
}

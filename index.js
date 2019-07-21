const request = require('request');
const cheerio = require('cheerio');
const item = {};
const url = 'https://www.sej.co.jp/i/products/thisweek/'; // セブンイレブンの新商品情報

exports.handler = async (event) => {

function requestPromise(param){
    return new Promise((resolve, reject)=>{
        request(url,(e, response, body) => {
            if (e) {
                console.error(e)
            }
            try {
                const $ = cheerio.load(body);           //bodyの読み込み
                $('strong', '.itemName' ).each((i, elem) => {   //'itemName'クラス内のstrongタグ内要素に対して処理実行
                    item[i] = {};　　　　　//二次元配列にするための処理
                    item[i]["name"] = $(elem).text()        //配列にテキストを挿入していく
                });

                $('img', '.image' ).each((i, elem) => {
                    item[i]["image"] = Object.entries($(elem).attr())[0][1].toString()
                });

                $('.region', '.itemPrice' ).each((i, elem) => {
                    item[i]["region"] = $(elem).text()
                });
                
                $('.price', '.itemPrice' ).each((i, elem) => {
                    item[i]["price"] = $(elem).text()
                });
                resolve(item);
            } catch (e) {
                console.error(e)
            }
        });
    })
}


const makeRequest = async () => {
    // Grab the text parameter.
    const item = await requestPromise();
     const response = {
        statusCode: 200,
        body: JSON.stringify(item),
    };
    return response;
};

const response = makeRequest();

return response;


};

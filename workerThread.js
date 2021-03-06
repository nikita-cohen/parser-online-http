const {workerData} = require("worker_threads");
const axios = require('axios')
const cheerio = require('cheerio');

let userAgent = [{'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246', 'Accept-Language' : '*'}
, {'User-Agent' : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36", 'Accept-Language' : '*'},
    {'User-Agent' : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9", 'Accept-Language' : '*'},
    {'User-Agent' : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1", 'Accept-Language' : '*'},
    {'User-Agent' : "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36", 'Accept-Language' : '*'},
    {'User-Agent' : "APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)", 'Accept-Language' : '*'}
]

let hostObj = [];
let success = [];
let error = [];


axios.get("https://rootfails.com/proxy/f021011c43b83a07a58d3708aed53f5b").then(data => {
    let host = data.data.split("\n");

    host.forEach(proxy => {

        const obj = {};
        obj.host = proxy.split(":")[0];
        obj.port = proxy.split(":")[1];
        obj.headers = userAgent[Math.floor(Math.random() * 6)]
        obj.proxy = {};
        obj.proxy.host = proxy.split(":")[0];
        obj.proxy.port = proxy.split(":")[1];
        obj.proxy.headers = userAgent[Math.floor(Math.random() * 6)]

        hostObj.push(obj);
    })

})



async function parseData(url) {

    let data;

    try {
        data = await axios.get(url, hostObj[Math.floor(Math.random() * hostObj.length)])
    } catch (e) {
        data = await axios.get(url, hostObj[Math.floor(Math.random() * hostObj.length)])
    }

    const obj = {};
    const $ = cheerio.load(data.data);

    try {
        const category = $("h2.dt_title");
        const categoryArray = [];


        for (let i = 0; i < category.length; i++) {
            categoryArray.push($(category[i]).children("strong").text().replace(/[^a-zA-Z0-9 ]/g, '').trim())
        }

        const href = $("h5.seeprices-header");
        const hrefArray = [];

        for (let i = 0; i < href.length; i++) {
            hrefArray.push({"href":  $(href[i]).children("a").attr('href'), "text": $(href[i]).children("a").text().replace(/[^a-zA-Z0-9 ]/g, '').trim()})
        }


        for (let i = 0; i < hrefArray.length; i++) {
            let bigTry = 0;
            try {
                let datatwo;

                try {
                    datatwo = await axios.get(url.slice(0, -1) + hrefArray[i].href, hostObj[Math.floor(Math.random() * hostObj.length)])
                } catch (e) {
                    datatwo = await axios.get(url.slice(0, -1) + hrefArray[i].href, hostObj[Math.floor(Math.random() * hostObj.length)])
                }

                const cheeriot = cheerio.load(datatwo.data);


                const brand = cheeriot(`#middle-wrapper > div > div.col-sm-8.col-md-8`);
                const brandArray = [];

                for (let i = 0; i < brand.length; i++) {
                    brandArray.push($(brand[i]).children("h1").text().replace(/[^a-zA-Z0-9 ]/g, '').trim());
                }


                obj.brand = brandArray[0];
                obj.category = categoryArray[0];

                const element = cheeriot(`h5.seeprices-header`);
                const elementArray = [];

                for (let i = 0; i < element.length; i++) {
                    elementArray.push({"href":  $(element[i]).children("a").attr('href'), "text": $(element[i]).children("a").text().replace(/[^a-zA-Z0-9 ]/g, '').trim()});
                }

                for (let i = 0; i < elementArray.length; i++) {
                    let smallTry = 0;
                    try {

                        let datathree;

                        try {
                                datathree = await axios.get(url.slice(0, -1) + elementArray[i].href , hostObj[Math.floor(Math.random() * hostObj.length)]);
                        } catch (e) {
                                datathree = await axios.get(url.slice(0, -1) + elementArray[i].href, hostObj[Math.floor(Math.random() * hostObj.length)])
                        }

                        const cheeriote = cheerio.load(datathree.data);

                        const element2 = cheeriote('div.col-md-8.col-sm-8.col-xs-7 > h5')
                        const elementArray2 = [];

                        for (let i = 0; i < element2.length; i++) {
                            elementArray2.push({"href":  $(element2[i]).children("a").attr('href'), "text": $(element2[i]).children("a").text().replace(/[^a-zA-Z0-9 ]/g, '').trim()});
                        }


                        elementArray2.forEach((x, index) => {
                            obj.url = url.slice(0, -1) + x.href;
                            obj.title = x.text;

                            success.push(1)

                            axios.post("https://search.findmanual.guru/manual/search/insert", obj)
                                .then(data => console.log("ok " + index))
                                .catch(e => console.log(e));
                        })
                    } catch (e) {
                        console.error("here the problem " + i);
                        if (smallTry < 3) {
                            smallTry++;
                            i--;
                        } else {
                            error.push(0)
                            smallTry = 0;
                        }

                    }

                }

            } catch (e) {
                console.error("here problem with category " + i)
                if (bigTry < 3) {
                    i--;
                    bigTry++;
                } else {
                    error.push(0)
                    bigTry = 0;
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

parseData(workerData.url).then()







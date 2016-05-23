
const http = require("http");
const https = require("https");

function addhttp(url) {
    url = url.trim();
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

function getStatusAndBody(url, callback) {
    url = addhttp(url);
    let requestModule;
    if (url.startsWith("https")) {
        requestModule = https;
    } else {
        requestModule = http;
    }
    let req = requestModule.request(url, (res)=> {
        let statusCode = res.statusCode;
        if (statusCode>=200 && statusCode<=299 ) {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk)=> {
                body+=chunk;
            });
            res.on('end', ()=> {
                callback("Success", body);
            })
        } else if (statusCode>=300 && statusCode<=399) {
            callback("Redirect", res.headers["location"]);
        } else if (statusCode>399) {
            let status=res.statusCode+" "+res.statusMessage;
            callback(status, "");
        } else {
            callback("Something weird has just happened", "");
        }
    });

    req.setTimeout(2000);
    req.on('timeout', ()=> {
        req.abort();
    });

    req.on('error', (e)=> {
        callback("Error! "+ e.message, "");
    });

    req.end();
}

module.exports = getStatusAndBody;
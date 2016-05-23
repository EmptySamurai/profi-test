const express = require('express');
const router = express.Router();
const fetcher = require('../logic/page-fetcher');

/* GET home page. */
router.get('/', function (req, res, next) {
    let url = req.query.url;
    fetcher(url, function (status, body) {
        res.render('index',
            {title: 'Page fetcher',
            status: status,
            body: body});
    });

});

module.exports = router;

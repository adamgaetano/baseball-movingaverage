const express = require('express');
const path = require('path');
const app = express();
const request = require("request");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
    res.redirect('/public/index.html')
});

app.get('/stats', function name(req, res) {

    var playerName = req.query.player;
    
    request('https://www.baseball-reference.com/players/gl.fcgi?id=' + playerName + '&t=b&year=2018', function (error, response, body) {

        const dom = new JSDOM(body);
        var table = dom.window.document.getElementsByTagName('table')[4];
        table.deleteTHead();
        table.deleteTFoot();
        var tableBody = table.getElementsByTagName('tbody')[0];
        var theadElements = tableBody.querySelectorAll('tr.thead');

        Array.prototype.forEach.call(theadElements, function(thead){
            tableBody.removeChild(thead);
        });
        table.id = "data";
        res.send(table.outerHTML);
    });

});

app.listen(8080);
var http = require('http');
var express = require('express');
var app = express();
var consolidate = require('consolidate');
var bodyParser = require('body-parser');
var args = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var config = fs.existsSync('./config.json') ? JSON.parse(fs.readFileSync('./config.json')) : {};

app.engine('html', consolidate.hogan);
app.set('view engine', 'html');

var server = http.createServer(app);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser());

app.get('/', function(req, res) {
    res.render('index.html', {
        source: args.source || config.source || '/events'
    });
});

app.get('/events', function(req, res) {
    var counter = 0;
    var timeout;

    req.socket.setTimeout(Infinity);


    function timer() {
        clearTimeout(timeout);

        timeout = setTimeout(function() {
            counter++;

            res.write('id: ' + counter +'\n');
            res.write('data: ' + counter + '\n\n');

            timer();
        }, 2000);
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });

    res.write('\n');


    req.on('close', function() {
        console.log('connection closed');
    });

    timer();
});

app.all('*', function(req, res) {
    res.redirect('/');
});

app.all('*', function(error, req, res, next) {
    console.log(error);

    res.redirect('/');
});

server.listen(3000);
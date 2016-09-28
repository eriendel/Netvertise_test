var express = require('express');
var path = require('path');

var rootPath = path.normalize(__dirname + '/');
var port = 3000;

var app = express();
var server = require('http').createServer(app);
app.use(express.static(rootPath + 'public'));

app.get('/partials/*', function (req, res) {
	res.sendFile(rootPath + 'public/app/' + req.params[0]);
});

app.get('*', function (req, res) {
	res.sendFile(rootPath + 'index.html');
});

console.log(rootPath);
server.listen(port);
console.log('Hey I\'m listening on port ' + port + '...');

'use strict';

var express = require('express');
var app = express();

var port = 3031;
var host ='localhost';

app.use('/demo', express.static('demo'));
app.use('/node_modules', express.static('node_modules'));
app.use('/dist', express.static('dist'));
app.use('/src', express.static('src'));
app.use('/views', express.static('src/views'));
app.use('/filters', express.static('src/filters'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/demo/index.html');
});

app.listen(port);

console.log('Server running at http://' + host + ':' + port.toString() + '/');

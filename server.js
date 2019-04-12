'use strict';

var express = require('express');
var app = express();

var port = 3030;
var host ='localhost';
var serverPath ='/demo/';
var staticPath ='/';

var staticFilePath = __dirname + serverPath;
// remove trailing slash if present
if(staticFilePath.substr(-1) === '/'){
	staticFilePath = staticFilePath.substr(0, staticFilePath.length - 1);
}

app.configure(function(){
	// compress static content
	app.use(express.compress());
	app.use(serverPath, express.static(staticFilePath));		//serve static files

	app.use(express.bodyParser());		//for post content / files - not sure if this is actually necessary?
});

app.use(express.static('demo'));
app.use('/node_modules', express.static('node_modules'));
app.use('/dist', express.static('dist'));
app.use('/src', express.static('src'));
app.use('/views', express.static('src/views'));

//catch all route to serve index.html (main frontend app)
app.get('index.html', function(req, res){
	res.sendfile(staticFilePath + staticPath+ 'index.html');
});

app.listen(port);

console.log('Server running at http://'+host+':'+port.toString()+'/');

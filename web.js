var express = require("express");
var fs = require('fs');
var app = express();
var html = fs.readFileSync('index.html');
var channel_html = '<script src="//connect.facebook.net/en_US/all.js"></script>';
app.use(express.logger());

app.get('/', function(request, response) {
		response.setHeader("Content-Type", "text/html");
		if (request.params.name == 'channel.html'){ response.send(channel_html);}
		else {response.send(html);}
	});

var port = process.env.PORT || 5000;
app.listen(port, function() {
		console.log("Listening on " + port);
	});
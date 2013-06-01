var express = require("express");
var fs = require('fs');
var app = express();
var html = fs.readFileSync('index.html');
app.use(express.logger());

app.get('/', function(request, response) {
		response.setHeader("Content-Type", "text/html");
		response.send(html);
	});

var port = process.env.PORT || 5000;
app.listen(port, function() {
		console.log("Listening on " + port);
	});
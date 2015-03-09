var express             = require('express');
var app                 = express();
var port                = process.env.PORT || 8082;
var bodyParser          = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index', {
    	pageTitle : "Test Page"
    });
});

app.listen(port, function() {
    console.log('Running at http://localhost:' + port);
});
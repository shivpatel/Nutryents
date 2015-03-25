var express             = require('express');
var app                 = express();
var port                = process.env.PORT || 8082;
var key 				= process.env.DATAGOVKEY || 'DEMO_KEY';
var bodyParser          = require('body-parser');
var request 			= require('request');
var mongoose 			= require('mongoose');
var Item 				= require('./models/item');

app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://dev:pass@dbh15.mongolab.com:27157/nutryents');

var nutrientsWanted = ['Energy', 'Water', 'Protein', 'Sugars, total', 'Fiber, total dietary'];
var showAllnutrients = true;

app.get('/', function(req, res) {

	res.render('index');
});

app.get('/visual', function(req, res) {
	res.render('visual');
});

app.get('/api/item', function(req, res) {
	console.log('http://api.nal.usda.gov/usda/ndb/reports/?ndbno='+req.query.id+'&type=s&format=json&api_key=' + key)
	request.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno='+req.query.id+'&type=s&format=json&api_key=' + key, 
	function(err, httpResponse, body) {
		var response = JSON.parse(body);

		var nutrients = response.report.food.nutrients;
		var nutrientsResposne = [];

		for (i = 0; i < nutrients.length; i++) {
			if (nutrientsWanted.indexOf(nutrients[i].name) != -1 || showAllnutrients) {
				nutrientsResposne.push(nutrients[i]);
			}
		}

		res.json(nutrientsResposne);
	});
});

app.get('/api/search', function(req, res) {
	Item.find({name : new RegExp(req.query.query, 'i')}, {}, { limit: 25 }, function(err, items) {
		res.json(items);
	});
});

app.get('/api/search/category', function(req, res) {
	//food_group : req.query.query
	Item.find({}, {}, { limit: 100 }, function(err, items) {
		res.json(items);
	});
});

app.listen(port, function() {
    console.log('Running at http://localhost:' + port);
});
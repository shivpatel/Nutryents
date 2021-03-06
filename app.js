var express             = require('express');
var app                 = express();
var port                = process.env.PORT || 8082;
var key 				= process.env.DATAGOVKEY || 'DEMO_KEY';
var bodyParser          = require('body-parser');
var request 			= require('request');
var mongoose 			= require('mongoose');
var Item 				= require('./models/item');

//

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

// NO LONGER IN USE
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

// New Search based on Full Text Search/Score
app.get('/api/search', function(req, res) {

	find = {'$text':{'$search':req.query.query}};
	findScore = {'score':{'$meta':'textScore'}};
	sort = {'score': {'$meta':'textScore'} }

	Item.find(find, findScore).limit(25).sort(sort).exec(function(err, items) {
		formatDataForClient(items, function(formatted) {
			res.json(formatted);
		});
	});
	
});

// Old Search based on REGEX
// app.get('/api/search', function(req, res) {
// 	Item.find({name : new RegExp(req.query.query, 'i')}, {}, { limit: 25 }, function(err, items) {
// 		formatDataForClient(items, function(formatted) {
// 			res.json(formatted);
// 		});
// 	});
// });

// Return 50 food items from food category
app.get('/api/search/category', function(req, res) {
	//food_group : req.query.query
	var result = [];
	Item.find({food_group : req.query.query}, {}, { limit: 50 }, function(err, items) {
		formatDataForClient(items, function(formatted) {
			res.json(formatted);
		});
	});
});

app.listen(port, function() {
    console.log('Running at http://localhost:' + port);
});

// Format data for client json responses
function formatDataForClient(data, callback) {
	newData = [];

	for (var i = 0; i < data.length; i++) {
		var tmp = {};
		tmp.name = data[i].name;
		tmp.id = data[i].id;
		tmp.food_group = data[i].food_group;
		tmp.protein = getNutrientValue(data[i], "Protein");
		tmp.carbs = getNutrientValue(data[i], "Carbohydrate, by difference");
		tmp.fat = getNutrientValue(data[i], "Total lipid (fat)");
		tmp.energy = getNutrientValue(data[i], "Energy");
		tmp.sugar = getNutrientValue(data[i], "Sugars, total");
		tmp.vit_a = getNutrientValue(data[i], "Vitamin A, RAE");
		tmp.vit_c = getNutrientValue(data[i], "Vitamin C, total ascorbic acid");
		tmp.cholestrol = getNutrientValue(data[i], "Cholesterol");
		tmp.potassium = getNutrientValue(data[i], "Potassium, K");
		tmp.sodium = getNutrientValue(data[i], "Sodium, Na");
		tmp.iron = getNutrientValue(data[i], "Iron, Fe");
		newData.push(tmp);
	}

	callback(newData);
}

// Cast Strings into Number for JS
function getNutrientValue(item, nutrient) {
	for (var i = 0; i < item.data.length; i++) {
		if (item.data[i].name == nutrient) {
			return Number(item.data[i].value);
		}
	}
	return 0;
}
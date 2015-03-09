var express             = require('express');
var app                 = express();
var port                = process.env.PORT || 8082;
var bodyParser          = require('body-parser');
var request 			= require('request');

app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

var nutrientsWanted = ['Energy', 'Water', 'Protein', 'Sugars, total', 'Fiber, total dietary'];

app.get('/', function(req, res) {
	request.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno=01009&type=s&format=json&api_key=DEMO_KEY', 
	function(err, httpResponse, body) {
		var response = JSON.parse(body);

		var nutrients = response.report.food.nutrients;
		var nutrientsResposne = [];

		for (i = 0; i < nutrients.length; i++) {
			if (nutrientsWanted.indexOf(nutrients[i].name) != -1) {
				nutrientsResposne.push(nutrients[i]);
			}
		}

		res.render('index', {
			item : response.report.food.name,
			nutrients : nutrientsResposne
		});
	});
});

app.listen(port, function() {
    console.log('Running at http://localhost:' + port);
});
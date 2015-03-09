var request 			= require('request');
var mongoose 			= require('mongoose');
var Item 				= require('./models/item');
var key 				= process.env.DATAGOVKEY || 'DEMO_KEY';

mongoose.connect('mongodb://dev:pass@dbh15.mongolab.com:27157/nutryents');

// get all nutrients
var iterations = 18;

for (var i = 0; i < iterations; i++) {

	var offset = 1 + (i * 500);

	request.get('http://api.nal.usda.gov/usda/ndb/list?format=json&lt=f&sort=n&max=500&offset='+offset+'&api_key=' + key, 
		function(err, http, body) {
			var items = JSON.parse(body).list.item;
			for (var j = 0; j < items.length; j++) {
				console.log(items[j].name + '(' + items[j].id + ')');
				var tmp = new Item({
					id : items[j].id,
					name : items[j].name
				});
				tmp.save(function(err, saved) {
					if (err) {
						console.log("Error Saving");
					} else {
						console.log("Saved");
					}

				});
			}
	});

}

// request.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno=01009&type=s&format=json&api_key=DEMO_KEY', 
// function(err, httpResponse, body) {
// 	var response = JSON.parse(body);

// 	var nutrients = response.report.food.nutrients;
// 	var nutrientsResposne = [];

// 	for (i = 0; i < nutrients.length; i++) {
// 		if (nutrientsWanted.indexOf(nutrients[i].name) != -1) {
// 			nutrientsResposne.push(nutrients[i]);
// 		}
// 	}

// 	console.log(nutrientsResposne);
// });

// for each nutrient

// request.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno=01009&type=s&format=json&api_key=DEMO_KEY', 
// function(err, httpResponse, body) {
// 	var response = JSON.parse(body);

// 	var nutrients = response.report.food.nutrients;
// 	var nutrientsResposne = [];

// 	for (i = 0; i < nutrients.length; i++) {
// 		if (nutrientsWanted.indexOf(nutrients[i].name) != -1) {
// 			nutrientsResposne.push(nutrients[i]);
// 		}
// 	}

// 	console.log(nutrientsResposne);
// });
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
					name : items[j].name,
					data : []
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
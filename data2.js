var request 			= require('request');
var mongoose 			= require('mongoose');
var Item 				= require('./models/item');
var key 				= process.env.DATAGOVKEY || 'DEMO_KEY';
var temporal			= require('temporal');

mongoose.connect('mongodb://dev:pass@dbh15.mongolab.com:27157/nutryents');

var count = 0;
var length = 0;

Item.find({}, function(err, items) {
	length = items.length;
	temporal.loop(4000, function() {

		console.log("Running...");

		if (count == length) {

			this.stop();

		} else {

			request.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno='+items[count].id+'&type=s&format=json&api_key=' + key,
				function(err, http, body) {
					
					try {
						this.items[count].data = JSON.parse(body).report.food.nutrients;
						this.items[count].save(function(err) {
							if (err) {
								console.log("Not Saved 1: " + this.items[count].name + ' ' + this.items[count].id);
							} else {
								console.log("*** SAVED: " + this.items[count].name + ' ' + this.items[count].id);
							}
						}.bind({items:this.items}));
					} catch (e) {
						console.log("Not Saved 2: " + this.items[count].name + ' ' + this.items[count].id);
					}

					count++;

			}.bind({items:this.items}));

		}

	}.bind({items:items}));
});


// var request 			= require('request');
// var mongoose 			= require('mongoose');
// var Item 				= require('./models/item');
// var key 				= process.env.DATAGOVKEY || 'vYmReuOVpkV5QChUiKRsQb2hgm2rfAqwDYQoOLOu';
// var sleep				= require('sleep');

// mongoose.connect('mongodb://dev:pass@dbh15.mongolab.com:27157/nutryents');

// // get all nutrients
// var count = 0;
// var limit = 2;
// var sleep = 3605;

// Item.find({}, function(err, items) {
// 	for (var i = 0; i < items.length; i++) {
// 		if (count > limit) {
// 			count = 0;
// 			console.log("Taking a nap for " + sleep + " seconds.");
// 			sleep.sleep(sleep);
// 		} else {
// 			request.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno='+items[i].id+'&type=s&format=json&api_key=' + key,
// 				function(err, http, body) {
// 					count++;
// 					try {
// 						this.items[this.i].data = JSON.parse(body).report.food.nutrients;
// 						this.items[this.i].save(function(err) {
// 							if (err) {
// 								console.log("Not Saved 1: " + this.items[this.i].name + ' ' + this.items[this.i].id);
// 							} else {
// 								console.log("*** SAVED: " + this.items[this.i].name + ' ' + this.items[this.i].id);
// 							}
// 						}.bind({i:this.i,items:this.items}));
// 					} catch (e) {
// 						console.log("Not Saved 2: " + this.items[this.i].name + ' ' + this.items[this.i].id);
// 					}
// 			}.bind({i:i,items:items}));
// 		}
// 	}
// });
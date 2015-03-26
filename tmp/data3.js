var request 			= require('request');
var mongoose 			= require('mongoose');
var Item 				= require('../models/item');
var key 				= process.env.DATAGOVKEY || 'vYmReuOVpkV5QChUiKRsQb2hgm2rfAqwDYQoOLOu';
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

			request.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno='+items[count].id+'&type=f&format=json&api_key=' + key,
				function(err, http, body) {
					
					try {
						console.log(JSON.parse(body).report.food.fg);
						console.log(this.items[count].food_group);
						this.items[count].food_group = JSON.parse(body).report.food.fg;
						this.items[count].save(function(err) {
							if (err) {
								console.log("Not Saved 1: " + this.items[count].name + ' ' + this.items[count].id);
							} else {
								console.log("*** SAVED: ");
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
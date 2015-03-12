var mongoose 			= require('mongoose');
var Item 				= require('./models/item');

mongoose.connect('mongodb://dev:pass@dbh15.mongolab.com:27157/nutryents');

console.log("START");

Item.find({}, function(err, items) {
	console.log("Errors: " + err);
	console.log("Items found: " + items.length);
	for (var i = 0; i < items.length; i++) {
		if (items[i].data.length < 1) {
			console.log(i + " - NO DATA");
		} else {
			console.log(i + " - ...");
		}
	}
	console.log("END");
});
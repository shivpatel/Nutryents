var mongoose 			= require('mongoose');
var Item 				= require('./models/item');

mongoose.connect('mongodb://dev:pass@dbh15.mongolab.com:27157/nutryents');

console.log("START");

Item.find({}).skip(8000).limit(1000).exec(function(err, items) {
	console.log("Errors: " + err)
	console.log("Items founds: " + items.length)
	for (var i = 0; i < items.length; i++) {
		// console.log("ITEM");
		helper(items,i,function(newItem) {
			// console.log(newItem)
			// newItem.data.set(i, 'changed');
			newItem.save(function(err) {
				console.log("SAVE ERROR: " + err)
				console.log("SAVED");
			});
		});
	}
	console.log("END");
});

function helper(items, i, callback) {
	for (var j = 0; j < items[i].data.length; j++) {
		var store = {
			"name": items[i].data[j].name,
        	"group": items[i].data[j].group,
        	"unit": items[i].data[j].unit,
        	"value": items[i].data[j].value,
		}
		items[i].data.set(j, store);
	}
	callback(items[i]);
}
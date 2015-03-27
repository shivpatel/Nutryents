var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({

    id          : {type: String},
    name        : {type: String},
    data        : [],
    food_group  : {type: String, default: ''}

}).index({
	name		: 'text'
});

module.exports = mongoose.model('Item', itemSchema);
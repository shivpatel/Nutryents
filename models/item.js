var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({

    id          : {type: String},
    name        : {type: String},
    data        : []

});

module.exports = mongoose.model('Item', itemSchema);
var mongoose = require('mongoose');

Schema = mongoose.Schema;

var Event = module.exports = new Schema({
    title: String,
    time: Date,
    noOfPlayers: Integer
});


var mongoose = require('mongoose');

Schema = mongoose.Schema;

var Player = module.exports = new Schema({
    name: String,
    lastPlayed: Date,
    grade: Integer
});


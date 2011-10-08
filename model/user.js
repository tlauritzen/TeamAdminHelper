var mongoose = require('mongoose');

Schema = mongoose.Schema;

var User = module.exports = new Schema({
    email: {
	type: String,
	index: { unique: true }
    },
    name: String,
    lastseen: Date,
    isonline: Boolean,
    hashed_password: String,
    salt: String
});


var mongoose = require('mongoose');

Schema = mongoose.Schema;

var User = module.exports = new Schema({
    email: {
	type: String,
	index: { unique: true }
    },
    isAdmin: Boolean,
    name: String,
    lastseen: Date,
    isOnline: Boolean,
    hashed_password: String,
    salt: String
});


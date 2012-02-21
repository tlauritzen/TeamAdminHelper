var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

UserProvider = function() {}

UserProvider.prototype.openDb = function(host, port, callback) {
    this.db = new Db('teamadmin', new Server(host, port, {auto_reconnect: true}), {});
    this.db.open(callback);
};

//getCollection

UserProvider.prototype.getCollection= function(callback) {
  this.db.createCollection('users', function(error, user_collection) {
    if( error ) callback(error);
    else callback(null, user_collection);
  });
};

//findAll
UserProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, user_collection) {
	if( error ) callback(error);
	else {
            user_collection.find().toArray(function(error, results) {
		if( error ) callback(error);
		else callback(null, results);
            });
	}
    });
};

//findById

UserProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//verifyLogin
UserProvider.prototype.verifyLogin = function(username, password, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
          user_collection.findOne({'username': username, 'password': password}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save
UserProvider.prototype.save = function(users, callback) {
    this.getCollection(function(error, user_collection) {
	if( error ) callback(error)
	else {
            if( typeof(users.length)=="undefined")
		users = [users];
	    
	    /*
            for( var i =0;i< users.length;i++ ) {
		users = users[i];
		user.created_at = new Date();
		if( user.comments === undefined ) user.comments = [];
		for(var j =0;j< user.comments.length; j++) {
		    user.comments[j].created_at = new Date();
		}
            }
	    */
            user_collection.insert(users, function() {
		callback(null, users);
            });
	}
    });
};


//delete
UserProvider.prototype.delete = function(username, callback) {
    this.getCollection(function(error, user_collection) {
	if( error ) callback(error)
	else {
	    user_collection.update({'username': username}, {}, 'remove', function(err, count) {
		if( err ) console.log( err );
		else callback(null, count);
	    });
	}
    });
};


exports.UserProvider = UserProvider;
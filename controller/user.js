require('../model');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/db');
mongoose.model('User', User);
var User = db.model('User');


exports.list = function(req, res){
    User.find({}, function (err, users) {
      if (err) return next(err);
	res.render('users/list_users', {
	    title: 'User list',
            users: users
	});
    })};


exports.edit = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    User.findById(req.params.id, function(err, u) {
      if (err) return next(err);
      console.log(req.params.id);
      res.render('users/edit_user', {
	  title: 'Edit User',
	  locals: { u: u }
    });
    })};

exports.add = function(req, res) {
    console.log('New user');
    res.render('users/new_user', {
	title: 'New User',
	locals: { u: new User() }
    })};

// Create 
exports.create = function(req, res) {
    var u = new User();
    u.name = req.body.user.name;
    u.email = req.body.user.email;
    u.hashed_password = req.body.user.hashed_password;
    u.isAdmin = req.body.user.isAdmin;

    // Persist the changes
    u.save(function() {
	// Respond according to the request format
	switch (req.params.format) {
        case 'json':
            res.send(u.__doc);
            break;
	    
        default:
            res.redirect('/');
	}
    })};

exports.update = function(req, res) {
  // Load the user
    User.findById(req.body.user._id, function(err, u) {
	if (err) return next(err);
	// Do something with it
	u.name = req.body.user.name;
	u.email = req.body.user.email;
	u.hashed_password = req.body.user.hashed_password;
	u.isAdmin = req.body.user.isAdmin != null ? 1 : 0;
	console.log('isAdmin ' + req.body.user.isAdmin);

	// Persist the changes
	u.save(function() {
	    // Respond according to the request format
	    switch (req.params.format) {
            case 'json':
		res.send(u.__doc);
		break;
		
            default:
		res.redirect('/');
	    }
	});
    })};


exports.read = function(req, res) {
    // Load the user
    User.findById(req.params.id, function(err, u) {
	if (err) return next(err);
	res.render('users/show_user', {
	    title: 'Show User',
	    user: u
	});
    })};

exports.del = function(req, res) {
    User.findById(req.params.id, function(err, u) {
	if (err) return next(err);
	
	// Delete the user
	u.remove(function() {
	    // Respond according to the request format
	    switch (req.params.format) {
            case 'json':
          res.send(u.__doc);
		break;
		
            default:
		res.redirect('/');
	    }
	});
    })};
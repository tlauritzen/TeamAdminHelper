require('../model');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/db');
//var db = app.get('db');
mongoose.model('User', User);
var User = db.model('User');


exports.list = function(req, res) {
  res.render('sessions/new_session.jade', {
      title: "Login",
      locals: { u: new User() }
  });
};

exports.create = function(req, res) {
    // Find the user and set the currentUser session variable
    // Load the user

    User.findOne({'name' : req.body.user.name}, function(err, u) {
	if (err) return next(err);
	console.log(u + ' ' + u.name + ' ' + u._id +  ' ' + u.hashed_password);

	if(u.hashed_password == req.body.user.password) {
	    req.session.currentUser = u.name;
	    req.session.user_id = u._id;
	    res.redirect('/');
	}
	else {
	    res.redirect('/sessions/new');
	}
    });
};

exports.del = function(req, res) {
  // Remove the session
  if (req.session) {
    req.session.destroy(function() {});
  }
  res.redirect('/sessions/new');
};

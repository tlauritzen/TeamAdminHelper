
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var MongoStore = require('connect-mongo');
var mongoose = require('mongoose');
require('./model');

// Configuration


var conf = {
  db: {
    db: 'db',
    host: 'localhost',
//    port: 6646,  // optional, default: 27017
//    username: 'admin', // optional
//    password: 'secret', // optional
    collection: 'mySessions' // optional, default: sessions
  },
  secret: '076ee61d63aa10a125ea872411e433b9'
};


function loadUser(req, res, next) {
  if (req.session.user_id) {
      User.findById(req.session.user_id, function(err, user) {
      if (err) return next(err);
      if (user) {
	  console.log('user found ' + req.session.user_id);
          req.currentUser = user;
          next();
      } else {
	  console.log('user NOT found ' + req.session.user_id);
          res.redirect('/sessions/new');
      }
    });
  } else {
      console.log('No session.user_id');
      res.redirect('/sessions/new');
  }
}

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
	secret: conf.secret,
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore(conf.db)
    }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

var db = mongoose.connect('mongodb://localhost/db');
var User = db.model('User');

mongoose.model('User', User);

/*
User.remove({}, function() {});

var u = new User();
//u.email = 'ting@ting.dk'
u.name = 'Arnold';
u.save(function(err){
    if(err) { console.log('Error saving'); }
    console.log('Saved!');
});
*/


app.configure(function () {
    app.set('db', db);
});

// Routes

app.get('/', loadUser, function (req, res, next) {
    User.find({}, function (err, users) {
      if (err) return next(err);

      res.render('index', {
	  title: 'User list',
          users: users
      });
    });
  });

/*
app.get('/users', function(req, res){
    res.render('users/list_users', {
	title: 'User list',
        users: users
    });
});
*/

app.get('/users/:id.:format?/edit', loadUser, function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    User.findById(req.params.id, function(err, u) {
      if (err) return next(err);
      console.log(req.params.id);
      res.render('users/edit_user', {
	  title: 'Edit User',
	  locals: { u: u }
    });
  });
});

app.get('/users/new', loadUser, function(req, res) {
    console.log('New user');
    res.render('users/new_user', {
	title: 'New User',
	locals: { u: new User() }
    });
});



// Create 
app.post('/users.:format?', loadUser, function(req, res) {
    var u = new User();
    u.name = req.body.user.name;
    u.email = req.body.user.email;

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
});



app.put('/users/:id.:format?', loadUser, function(req, res) {
  // Load the user
    User.findById(req.body.user._id, function(err, u) {
	if (err) return next(err);
	// Do something with it
	u.name = req.body.user.name;
	u.email = req.body.user.email;
	
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
    });
});

app.del('/users/:id.:format?', loadUser, function(req, res) {
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
    });
});


// Sessions
app.get('/sessions/new', function(req, res) {
  res.render('sessions/new_session.jade', {
      title: "Login",
      locals: { u: new User() }
  });
});

app.post('/sessions', function(req, res) {
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
});

app.del('/sessions', loadUser, function(req, res) {
  // Remove the session
  if (req.session) {
    req.session.destroy(function() {});
  }
  res.redirect('/sessions/new');
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

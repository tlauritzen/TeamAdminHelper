/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var MongoStore = require('connect-mongo');
var mongoose = require('mongoose');
require('./model');
var controller_user = require('./controller/user.js');
var controller_event = require('./controller/event.js');
var controller_session = require('./controller/session.js');

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

mongoose.model('User', User);
var User = db.model('User');

/*
mongoose.model('Event', Event);
var Event = db.model('Event');
*/

app.configure(function () {
    app.set('db', db);
});

// Routes

app.get('/', loadUser, function (req, res, next) {
    res.render('index', {
	title: 'Welcome ' + req.currentUser.name
    });
});


// Users
app.get('/users', controller_user.list);
app.get('/users/:id.:format?/edit', loadUser, controller_user.edit);
app.get('/users/new', loadUser, controller_user.add);

app.post('/users.:format?', loadUser, controller_user.create);
app.put('/users/:id.:format?', loadUser, controller_user.update);
app.get('/users/:id.:format?', loadUser, controller_user.read);
app.del('/users/:id.:format?', loadUser, controller_user.del);


// Events
app.get('/events', loadUser, controller_event.list);
app.get('/events/:id.:format?/edit', loadUser, controller_event.edit);
app.get('/events/new', loadUser, controller_event.add);

app.post('/events.:format?', loadUser, controller_event.create);
app.put('/events/:id.:format?', loadUser, controller_event.update);
app.get('/events/:id.:format?', loadUser, controller_event.read);
app.del('/events/:id.:format?', loadUser, controller_event.del);


// Sessions
app.get('/sessions/new', controller_session.list);
app.post('/sessions', controller_session.create);
app.del('/sessions', loadUser, controller_session.del)

/*
app.get('/users', function(req, res){
    User.find({}, function (err, users) {
      if (err) return next(err);
	res.render('users/list_users', {
	    title: 'User list',
            users: users
	});
    });
});


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
    });
});



app.put('/users/:id.:format?', loadUser, function(req, res) {
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

*/
// Events
/*
app.get('/events', loadUser, function (req, res, next) {
    Event.find({}, function (err, events) {
      if (err) return next(err);

      res.render('events/list_events', {
	  title: 'Events',
          events: events
      });
    });
  });


app.get('/events/:id.:format?/edit', loadUser, function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    Event.findById(req.params.id, function(err, e) {
      if (err) return next(err);
      res.render('events/edit_event', {
	  title: 'Edit Event',
	  locals: { e: e }
    });
  });
});

app.get('/events/new', loadUser, function(req, res) {
    res.render('events/new_event', {
	title: 'New Event',
	locals: { e: new Event() }
    });
});

// Create 
app.post('/events.:format?', loadUser, function(req, res) {
    var e = new Event();
    e.title = req.body.event.title;
    e.date = req.body.event.date;
    e.time = req.body.event.time;
    e.noOfPlayers = req.body.event.noOfPlayers;


    // Persist the changes
    e.save(function() {
	// Respond according to the request format
	switch (req.params.format) {
        case 'json':
            res.send(e.__doc);
            break;
	    
        default:
            res.redirect('/');
	}
    });
});



app.put('/events/:id.:format?', loadUser, function(req, res) {
  // Load the event
    Event.findById(req.body.event._id, function(err, e) {
	if (err) return next(err);
	// Do something with it
	e.title = req.body.event.title;
	e.date = req.body.event.date;
	e.time = req.body.event.time;
	e.noOfPlayers = req.body.event.noOfPlayers;

	// Persist the changes
	e.save(function() {
	    // Respond according to the request format
	    switch (req.params.format) {
            case 'json':
		res.send(e.__doc);
		break;
		
            default:
		res.redirect('/');
	    }
	});
    });
});

app.del('/events/:id.:format?', loadUser, function(req, res) {
    Event.findById(req.params.id, function(err, e) {
	if (err) return next(err);
	
	// Delete the event
	e.remove(function() {
	    // Respond according to the request format
	    switch (req.params.format) {
            case 'json':
          res.send(e.__doc);
		break;
		
            default:
		res.redirect('/');
	    }
	});
    });
});
*/


// Sessions
/*
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
*/


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

require('../model');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/db');
mongoose.model('Event', Event);
var Event = db.model('Event');


exports.list = function (req, res, next) {
    Event.find({}, function (err, events) {
      if (err) return next(err);

      res.render('events/list_events', {
	  title: 'Events',
          events: events
      });
    });
  };

exports.edit = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId; 
    Event.findById(req.params.id, function(err, e) {
      if (err) return next(err);
      res.render('events/edit_event', {
	  title: 'Edit Event',
	  locals: { e: e }
    });
  });
};

exports.add = function(req, res) {
    res.render('events/new_event', {
	title: 'New Event',
	locals: { e: new Event() }
    });
};

// Create 
exports.create = function(req, res) {
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
};



exports.update = function(req, res) {
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
};

exports.read = function(req, res) {
    // Load the event
    Event.findById(req.params.id, function(err, e) {
	if (err) return next(err);
	res.render('events/show_event', {
	    title: 'Show Event',
	    event: e
	});
    })};



exports.del = function(req, res) {
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
};
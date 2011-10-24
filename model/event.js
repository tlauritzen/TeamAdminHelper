var mongoose = require('mongoose');

Schema = mongoose.Schema;

var Event = module.exports = new Schema({
    title: String,
    datetime: Date,
    noOfPlayers: Number
});

Event
    .virtual('date')
    .get(function () {
	var d;
	if(this.datetime != null) {
	    d = this.datetime;
	}
	else {
	    var d = new Date();
	}
	var yy = d.getFullYear();
	// Indexed from 0
	var mm = d.getMonth() + 1;
	var dd = d.getDate();
	return dd + "-" + mm + "-" + yy;
    })
    .set(function (value) {	
	console.log(value);
	var values = value.split("-");
	var newDate = new Date();
	newDate.setDate(values[0]);
	newDate.setMonth(values[1]) - 1;
	newDate.setFullYear(values[2]);
	//console.log(/(\w+)\(/.exec(newDate.constructor.toString())[1]);

	if(this.datetime != null) {
	    newDate.setHours(this.datetime.getHours());
	    newDate.setMinutes(this.datetime.getMinutes());
	}
	this.set('datetime', newDate);
    });

Event
    .virtual('time')
    .get(function () {
	return this.datetime != null ? this.datetime : new Date();
	/*
	if(this.datetime != null) {
	    var hh = this.get('datetime').getHours();
	    var mm = this.datetime.getMinutes();
	    return hh + ":" + mm;
	}
	else {
	    var d = new Date();
	    var hh = d.getHours();
	    var mm = d.getMinutes();
	    return hh + ":" + mm;
	}
	*/

    })
    .set(function (value) {	
	var newTime = new Date(value);
	if(this.datetime != null) {
	    newTime.setFullYear(this.datetime.getFullYear());
	    newTime.setMonth(this.datetime.getMonth());
	    newTime.setDate(this.datetime.getDate());
	}
	this.set('datetime', newTime);
    });
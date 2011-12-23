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
	var hh, mm;
	if(this.datetime != null) {
	    hh = this.get('datetime').getHours();
	    mm = this.datetime.getMinutes();
	}
	else {
	    d = new Date();
	    hh = d.getHours();
	    mm = d.getMinutes();
	}
	mm = mm < 10 ? '0' + mm : mm;
	hh = hh < 10 ? '0' + hh : hh;
	return hh + ":" + mm;
    })
    .set(function (value) {	
	var timeParts = value.split(":");
	var newTime = this.datetime != null ? this.datetime : new Date();
	newTime.setHours(timeParts[0]);
	newTime.setMinutes(timeParts[1]);
	this.set('datetime', newTime);
    });
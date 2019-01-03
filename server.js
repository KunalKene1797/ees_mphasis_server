var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors')
var app = express();
var url = "mongodb://kunalkene1797:kunalkene1797@ds127604.mlab.com:27604/mphasisee"

var Schema = mongoose.Schema;
var EventSchema = new Schema({
  title: String,
  nextdate: String,
  rating: String,
  shortdesc: String
});

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function () {
  console.log("We are connected to our Database");
});

app.use(cors());
app.get('/', function (req, res) {
  res.send("Connected")
});

app.get('/api/ongoing', function (req, res) {
  var location = req.query.location;
  var ongoing = mongoose.model('events', EventSchema);
  ongoing.find(function (err, events) {
    if (err) throw err;
    console.log("Data Fetched" + location);
    return res.status(200).json({
      status: 'success',
      data: events
    });
  });
});

app.get('/api/geteventdesc', function(req, res){
  var eventname = req.query.eventname;
  var eventslist = mongoose.model('events', EventSchema);
  eventslist.findOne({'title':eventname}, function(err, desc){
    if (err) throw err;
    console.log("Event Desc Fetched for "+ eventname);
    return res.status(200).json({
      status: 'success',
      data: desc.shortdesc
    });
  });
});

app.get('/api/upcoming', function (req, res) {
  var upcoming = mongoose.model('upcomingevents', EventSchema);
  upcoming.find(function (err, events) {
    if (err) throw err;
    console.log("Upcoming Data Fetched");
    return res.status(200).json({
      status: 'success',
      data: events
    });
  });
});

app.get('/api/past', function (req, res) {
  var past = mongoose.model('pastevents', EventSchema);
  past.find(function (err, events) {
    if (err) throw err;
    console.log("Past Data Fetched");
    return res.status(200).json({
      status: 'success',
      data: events
    });
  });
});

console.log("server running at 3000");
app.listen(3000);

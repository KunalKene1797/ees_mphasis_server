var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var app = express();
var url = "mongodb://kunalkene1797:kunalkene1797@ds127604.mlab.com:27604/mphasisee";
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Schemas 
var Schema = mongoose.Schema;
var AllEventSchema = new Schema({
    name: String,
    rating: String,
    eventdesc: String,
    pagelink: String,
    imagesrc: String
});

var ActiveEventSchema = new Schema({
  name: String,
  rating: String,
  date: {
    year: Number,
    month: Number,
    day: Number
  },
  location: String,
  eventdesc: String,
  pagelink: String,
  feedbacklink: String,
  imagesrc: String
},{
  versionKey: false
})
var EventSchema = new Schema({
    title: String,
    nextdate: String,
    rating: Number,
    shortdesc: String
});
// Mongoose Connect
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    console.log("We are connected to our Database");
});

app.use(cors());


// Functions
app.get('/', function(req, res){
   res.send("Mphasis Employee Engagement Server Running Here!") 
});

app.get('/api/updaterating', function(req, res){
    var event = req.query.eventname;
    var rating = req.query.rating;
    var allevents = mongoose.model('all_events', AllEventSchema);
    allevents.update({'name': event}, {'rating': rating}, function(err, docs){
      if (err) throw err;
      console.log("Event Rating Updated Successfully");
    })
});

app.get('/api/activeevents', function(req,res){
    var location = req.query.location;
    var activeevents = mongoose.model('active_events', ActiveEventSchema);
      activeevents.find(function (err, events){
        if (err) throw err;
        console.log("Data Fetched for Location: " + location);
        return res.status(200).json({
            status: 'success',
            data: events
        });
    });
    
});

app.get('/api/editevent', function(req, res){
  var elementid = req.query.elementid;
  var editevent = mongoose.model('active_events', ActiveEventSchema);
  editevent.findOne({'_id':elementid}, function(err, edit){
    if (err) throw err;
    return res.status(200).json({
      status: 'success',
      data: edit
    })
  })
})

app.get('/api/deleteevent', function(req, res){
  var elementid = req.query.elementid;
  var activeevents = mongoose.model('active_events', ActiveEventSchema);
  activeevents.findOneAndDelete({'_id':elementid}, function(err, res){
    if (err) throw err;
  });
  res.send("Deleted Successfully");
});

app.post('/api/updateevent', function(req, res){
  var postmodel = req.body;
  var elementid = req.query.elementid;
  if(postmodel.rating===""){
    var allevents = mongoose.model('all_events', AllEventSchema);
    allevents.findOne({'name': postmodel.name}, function(err, events){
      if (err) throw err;
      postmodel.rating = events.rating;
      postmodel.imagesrc = events.imagesrc;
      if(postmodel.eventdesc===""){
        postmodel.eventdesc = events.eventdesc;
      }
      console.log(postmodel);

      // Push it to active Events
      var active_eventspost = mongoose.model('active_events', ActiveEventSchema);
      actuve_eventspost.findOneAndUpdate({'_id': elementid}, postmodel, function(err, docs){
        if (err) throw err;
        console.log("Event Updated Successfully")})
      });
  }
  res.send("Success");
});

app.post('/api/postevent', function(req, res){
  var postmodel = req.body;
  if(postmodel.rating===""){
    var allevents = mongoose.model('all_events', AllEventSchema);
    allevents.findOne({'name': postmodel.name}, function(err, events){
      if (err) throw err;
      postmodel.rating = events.rating;
      postmodel.imagesrc = events.imagesrc;
      if(postmodel.eventdesc===""){
        postmodel.eventdesc = events.eventdesc;
      }
      console.log(postmodel);

      // Push it to active Events
      var active_eventspost = mongoose.model('active_events', ActiveEventSchema);
      active_eventspost.create(postmodel, function(err, docs){if (err) throw err;
      console.log("New Event Created")})
    });
  }
  res.send("Success");
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


console.log("server running on heroku now");
app.listen(process.env.PORT || 5000);
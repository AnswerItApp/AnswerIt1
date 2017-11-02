var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var rp = require('request-promise');
var secret = require('./config/secret');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var passport = require('passport');
var expressValidator = require('express-validator');


var nodemailer = require('nodemailer');
var app = express();




mongoose.connect(secret.database,{useMongoClient: true}, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

app.set('port', (process.env.PORT || 4001));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');
var mainRoutes = require('./routes/main');
app.use(mainRoutes);

app.get('/', function(req, res){
  res.render('home', { message: req.flash('message'), errors: req.flash('errors')});
});

app.get('/policy', function(req, res){
  res.render('policy');
});


app.get('/:id', function(req, res){
     const options = {
       uri: `https://api.answerit.online/auth/verify/${req.params.id}`,
       json: true
   }
 rp(options)
   .then(success => res.render('veryfi', {msg: success.message}))
   .catch(err => res.render('veryfi', {msg: err.error.message}))
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

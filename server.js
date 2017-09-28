var express = require('express');
var morgan = require('morgan');
var ejs = require('ejs');
var engine = require('ejs-mate');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 4000));

app.get('/', function(req, res){
  res.render('home');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

var express = require('express');
var morgan = require('morgan');
var ejs = require('ejs');
var engine = require('ejs-mate');
var router = require('express').Router();

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 4000));

app.get('/', function(req, res){
  res.render('home');
});

router.post('/contact', function(req, res){
  req.check('email', 'Niepoprawny email').isEmail();
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
  }
  var transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu", // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  auth: {
    user: 'kontakt@monache-sklep.pl',
    pass: 'monika20'
  }
});

var mailOptions = {
  from: 'Monache <kontakt@monache-sklep.pl>',
    to: 'kontakt@monache-sklep.pl',
    subject: 'Zapytanie',
   text: 'Masz następującą wiadomość:  Imię: ' + req.body.name+ 'Email: '+req.body.email+ 'Treść: '+req.body.message,
   html: '<p> Masz następującą wiadomość: </p><ul><li>Imię: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Treść: '+req.body.message+'</li></ul>',
};

transporter.sendMail(mailOptions, function(error, info){
   if(error) {
    console.log(error);
     res.redirect('/');
  } else {
    res.redirect('/');
  };
   });
   });


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

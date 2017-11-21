var nodemailer = require('nodemailer');
var Mails = require('../models/newslettermails');
var router = require('express').Router();
var rp = require('request-promise');

router.post('/savemail', function(req, res, next){
  var mails = new Mails();

  mails.email = req.body.email;

  Mails.findOne({email: req.body.email}, function(err, existingMails){
    if (existingMails) {
      req.flash('errors', 'The email is already in our database, please provide another.');
      return res.redirect('/');
    } else {
      mails.save(function(err, mails){
        if (err) return next(err);
        req.flash('message', 'Thank you for subscribing to the newsletter.');
      return res.redirect('/');
      });
    }
  });
});

router.post('/newpass/reset-pass', function(req, res, next){
        const id = req.body.location.split('/').pop();
        delete req.body.location
        const options = {
            uri: `https://api.answerit.online/auth/reset/${id}`,
            body: req.body,
            json: true,
            method:'POST'
        }

        if(!req.body) return res.render('veryfi-resetpass', {msg: ''})
        rp(options)
            .then(success => res.render('veryfi-resetpass', {msg: success.message}))
            .catch(err => res.render('veryfi-resetpass', {msg: err.error.message}))

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
    to: 'damianjakalski@gmail.com',
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




module.exports = router;

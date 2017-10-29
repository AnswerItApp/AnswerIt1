var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailsSchema = new Schema({
  email: {type: String, unique: true}
});

module.exports = mongoose.model('Mails', MailsSchema);

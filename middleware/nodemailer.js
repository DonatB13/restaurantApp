var nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('handlebars');
var dotenv = require('dotenv').config();

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err); 
           throw err;
            
        }   
        else {
            callback(null, html);
        }
    });
};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASSWORD
    }
  });

function sendMail(name, email, code) {
    readHTMLFile('./middleware/htmlTemplate/resetPasswordEmail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
             name,
             code
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'noreply.restaurant.project@gmail.com',
            to : email,
            subject : "Here's how to reset your password.",
            html : htmlToSend
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
    });
}

  module.exports = sendMail
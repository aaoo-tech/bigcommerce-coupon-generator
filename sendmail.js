// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL 
//     auth: {
//         user: 'user@gmail.com',
//         pass: 'pass'
//     }
// });

// var mailOptions = {
//     from: 'bsspirit ', // sender address
//     to: 'xxxxx@163.com', // list of receivers
//     subject: 'Hello ', // Subject line
//     text: 'Hello world ', // plaintext body
//     html: '<b>Hello world </b>', // html body
//     attachments: [
//         {
//             filename: 'XXX.csv',
//             path: 'assets/download/XXX.csv'
//         }
//     ]
// };

// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         console.log(error);
//     }else{
//         console.log('Message sent: ' + info.response);
//     }
// });

var EmailTemplate = require('email-templates').EmailTemplate;
// var async = require('async');
var path = require('path');
 
var templateDir = path.join(__dirname, 'views', 'newsletter')
 console.log(templateDir);
var newsletter = new EmailTemplate(templateDir);
console.log(newsletter);
var user = {name: 'Joe', pasta: 'spaghetti'};
newsletter.render(user, function (err, result) {
    console.log(err);
});
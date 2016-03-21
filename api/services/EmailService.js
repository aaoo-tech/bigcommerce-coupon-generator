var nodemailer = require('nodemailer'),
    EmailTemplate = require('email-templates').EmailTemplate;

module.exports = {
  send: function(template, params, cb) {
    var root = sails.config.rootPath;

    var transporter = nodemailer.createTransport();

    var templateSender = transporter.templateSender(
      new EmailTemplate(root + template), {
        from: params.from
      }
    );

    templateSender({
      to: params.to,
      subject: params.subject
    }, params, function(err, info) {
      cb(err, info);
    });
  }
};


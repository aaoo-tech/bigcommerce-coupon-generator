var async = require('async'),
    _ = require('underscore');

module.exports = {
  get: function(field, callback) {
    Setting.findOne({
      field: field
    }).exec(function(err, setting) {
      callback(err, setting);
    });
  }, 
  set: function(field, value, callback) {
    this.get(field, function(err, setting) {
      if (err) {
        callback(err);
      } else {
        if (_.isUndefined(setting)) {
          Setting.create({
            field: field,
            value: value
          }).then(function(setting) {
            callback(null);
          });
        } else {
          Setting.update({
            field: field
          }, {
            value: value
          }).exec(function() {
            callback(null);
          });
        }
      }
    });
  }
};
var _ = require('underscore');

var https = require('https'),
    util = require('util');

module.exports = {
  fetch: function(bigcommerces, params, callback) {
    BigcommerceService.gets(bigcommerces, '/api/v2/categories.json', params, function (data){
      callback(data);
    });
  }
};

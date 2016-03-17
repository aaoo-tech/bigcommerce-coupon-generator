var https = require('https'),
    util = require('util');
var fs = require('fs'),
    json2csv = require('json2csv'),
    moment = require('moment'),
    _ = require('underscore'),
    async = require('async'),
    randomstring = require('randomstring');

module.exports = {
  fetch: function(bigcommerces, params, callback) {
    BigcommerceService.gets(bigcommerces, '/api/v2/coupons.json', params, function (data){
      callback(data);
    });
  },
  generate: function(params, old_codes, callback) {
    switch(params._charset){
        //none
        case 0:
            _charset = 'alphanumeric';
        break;
        //number
        case 1:
            _charset = 'numeric';
        break;
        //lowercase
        case 2:
            _charset = 'abcdefghijqlmnopqrstuvwxyz';
        break;
        //lowercase and number
        case 3:
            _charset = 'abcdefghijqlmnopqrstuvwxyz0123456789';
        break;
        //uppercase
        case 4:
            _charset = 'ABCDEFGHIJQLMNOPQRSTUVWXYZ';
        break;
        //uppercase and number
        case 5:
            _charset = 'ABCDEFGHIJQLMNOPQRSTUVWXYZ0123456789';
        break;
        //uppercase and lowercase
        case 6:
            _charset = 'alphabetic';
        break;
        //uppercase and lowercase and number
        case 7:
            _charset = 'alphanumeric';
        break;
        //default
        default:
            _charset = 'alphanumeric';
    }
    var fields = ['code'];
    var data = [];
    for (var i = 0; i < parseInt(params.number); i++) {
        var _code = randomstring.generate({
          length: parseInt(params.len),
          charset: 'alphanumeric',
        });
        var coupon_code = {"code": params._prefix + "-" + _code + "-" + params.suffix};
        // var coupon_code = params._prefix + "-" + _code + "-" + params.suffix;
        var evens = _.where(data, coupon_code);
        if(_.size(old_codes) > 0){
            var old_code_evens = _.where(old_codes, coupon_code);
        }else{
            var old_code_evens = null;
        }
        if(_.size(evens) > 0 || _.size(old_code_evens) > 0){
            params.number++;
        }else{
            data.push(coupon_code);
        }
    }
    CsvService._write(data, function (filename){
      callback({"filename": filename, "data": data});
    });
  }
};

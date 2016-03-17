/**
 * CouponService
 *
 * @description :: Service for managing coupon
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

var  _ = require('underscore');
    
module.exports = {
  fetch: function(bigcommerces, params, callback) {
    BigcommerceService.gets(bigcommerces, '/api/v2/coupons.json', params, function (data){
      callback(data);
    });
  },
  generate: function(params, old_codes, callback) {
    switch(params._charset){
        case 0:
            // Number Only
            _charset = '0123456789';
            break;
        case 1:
            // Lowercase Letter Only
            _charset = 'abcdefghijqlmnopqrstuvwxyz';
            break;
        //lowercase and number
        case 2:
            // Uppercase Letter Only
            _charset = 'ABCDEFGHIJQLMNOPQRSTUVWXYZ';
            break;
        case 3:
        default:
            _charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJQLMNOPQRSTUVWXYZ0123456789';
    }

    var fields = ['code'];
    var data = [];
    for (var i = 0; i < parseInt(params.number); i++) {
        var coupon_code = {};

        do {
            var _code = '';
            for (var j = 0; j < params.len; j++) {
                _code += _charset.charAt(Math.floor(Math.random() * _charset.length));
            }

            coupon_code = {
                "code": params._prefix + "-" + _code + "-" + params.suffix
            };
        } while (_.where(data, coupon_code).length > 0 || _.where(old_codes, coupon_code).length > 0);

        data.push(coupon_code);
    }

    CsvService._write(data, function (filename){
      callback({
        "filename": filename, 
        "data": data
      });
    });
  }
};

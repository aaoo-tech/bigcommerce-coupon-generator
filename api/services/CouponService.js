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
    console.log(params);
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

    // generate coupons
    var data = [];
    for (var i = 0; i < parseInt(params.number); i++) {
        var coupon_code = {};

        do {
            var _code = '';
            for (var j = 0; j < params.len; j++) {
                _code += _charset.charAt(Math.floor(Math.random() * _charset.length));
            }

            coupon_code = {
                'name': params.coupon_name,
                'code': params._prefix + _code + params.suffix,
                'discount_type': params.discount_type,
                'discount_amount': params.discount_amount,
                'max_uses': params.max_uses,
                'num_uses': params.num_uses,
                'expire_date': params.expire_date
            };
        } while (_.where(data, coupon_code).length > 0 || _.where(old_codes, coupon_code).length > 0);

        data.push(coupon_code);
    }

    // fill the csv files
    var fields = ['name', 'code', 'discount_type', 'discount_amount', 'max_uses', 'num_uses', 'expire_date'];

    CsvService._write(data, fields, function (filename){
      callback({
        "filename": filename, 
        "data": data,
        'fields': fields
      });
    });
  }
};

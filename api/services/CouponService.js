/**
 * CouponService
 *
 * @description :: Service for managing coupon
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

var  _ = require('underscore');
    
module.exports = {
  charsets: [
    { name: 'Number Only', chars: '0123456789' },
    { name: 'Lowercase Letter Only', chars: 'abcdefghijqlmnopqrstuvwxyz' },
    { name: 'Uppercase Letter Only', chars: 'ABCDEFGHIJQLMNOPQRSTUVWXYZ' },
    { name: 'Alphanumeric', chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJQLMNOPQRSTUVWXYZ0123456789' },
  ],
  discount_types: [
    { name: 'Dollar amount off the order total' },
    { name: 'Dollor amount off each item in the order' },
    { name: 'Percentage off each item in the order' },
    { name: 'Dollar amount off the shipping total' },
    { name: 'Free shipping' },
  ],
  fetch: function(bigcommerces, params, callback) {
    BigcommerceService.gets(bigcommerces, '/api/v2/coupons.json', params, function (data){
      callback(data);
    });
  },
  generate: function(params, old_codes, callback) {
    _charset = this.charsets[params._charset].chars;

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
      callback(filename, {
        "data": data,
        'fields': fields
      });
    });
  }
};

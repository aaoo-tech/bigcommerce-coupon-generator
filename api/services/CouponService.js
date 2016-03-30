/**
 * CouponService
 *
 * @description :: Service for managing coupon
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

var  _ = require('underscore');
    
module.exports = {
  errors: {
    NUMBER_NOT_VALID: 'Number not valid.',
    NAME_NOT_VALID: 'Name not valid.',
    CHARSET_NOT_VALID: 'Charset not valid.',
    DISCOUNT_TYPE_NOT_VALID: 'Discount type not valid',
  },
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
  generate: function(params, old_codes) {

    if (params.number <= 0 || UtilityService.is_int(params.number) === false) {
      throw new Error(this.errors.NUMBER_NOT_VALID);
    }

    if (_.isNull(params.coupon_name) === true || 
        _.isUndefined(params.coupon_name) === true ||
        params.coupon_name === '') {
      throw new Error(this.errors.NAME_NOT_VALID);
    }

    if (params._charset < 0 || params._charset >= this.charsets.length ||
        _.isNull(params._charset) === true || _.isUndefined(params._charset) === true) {
      throw new Error(this.errors.CHARSET_NOT_VALID);
    }

    if (params.discount_type < 0 || params.discount_type >= this.discount_types.length ||
        _.isNull(params.discount_type) === true || _.isUndefined(params.discount_type) === true) {
      throw new Error(this.errors.DISCOUNT_TYPE_NOT_VALID);
    }

    if (_.isNull(params._prefix) === true ||
        _.isUndefined(params._prefix) === true) {
      params._prefix = '';
    }

    if (_.isNull(params.suffix) === true || 
        _.isUndefined(params.suffix) === true) {
      params.suffix = '';
    }

    _charset = this.charsets[params._charset].chars;

    // generate coupons
    // [TODO] improve performance
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
        } while (_.where(data, {code: coupon_code.code}).length > 0 || _.where(old_codes, {code: coupon_code.code}).length > 0);
        
        data.push(coupon_code);
    }

    return data;

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

var should = require('should');

var _ = require('underscore');

describe('CouponService', function() {
  describe('#generate()', function() {

    var valid_case = {
      number: 10,
      len: 6,
      coupon_name: 'test',
      _charset: 0,
      discount_type: 0,
      discount_amount: 10,
      max_uses: 0,
      num_uses: 0,
      expire_date: '2017-01-01'
    };

    it('success without pre set codes', function(done) {
      var params = UtilityService.clone(valid_case);

      params.number = 10;
      var codes = CouponService.generate(params, []);

      var check_codes = [];
      _.each(codes, function(code) {
        code.name.should.equal('test');
        code.discount_type.should.equal(0);
        code.discount_amount.should.equal(10);
        code.max_uses.should.equal(0);
        code.num_uses.should.equal(0);
        code.expire_date.should.equal('2017-01-01');

        check_codes.indexOf(code.code).should.equal(-1);
        check_codes.push(code.code);
      });

      done();
    });

    it('should check params:number > 0', function(done) {
      var params = UtilityService.clone(valid_case);

      params.number = 0;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.NUMBER_NOT_VALID);

      params.number = 0;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.NUMBER_NOT_VALID);

      done();
    });

    it('should check params:number NAN', function(done) {
      var params = UtilityService.clone(valid_case);

      params.number = 'abc';
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.NUMBER_NOT_VALID);

      params.number = null;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.NUMBER_NOT_VALID);

      done();
    });

    it('should check params:coupon_name not empty', function(done) {
      var params = UtilityService.clone(valid_case);

      delete params.coupon_name;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.NAME_NOT_VALID);

      params.coupon_name = '';
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.NAME_NOT_VALID);

      done();
    });

    it('should check params:_charset not valid', function(done) {
      var params = UtilityService.clone(valid_case);

      params._charset = -1;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.CHARSET_NOT_VALID);

      params._charset = CouponService.charsets.length;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.CHARSET_NOT_VALID);

      delete params._charset;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.CHARSET_NOT_VALID);

      done();
    });

    it('should check params:discount_type not valid', function(done) {
      var params = UtilityService.clone(valid_case);

      params.discount_type = -1;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.DISCOUNT_TYPE_NOT_VALID);

      params.discount_type = CouponService.discount_types.length;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.DISCOUNT_TYPE_NOT_VALID);

      delete params.discount_type;
      (function() {
        CouponService.generate(params, []);
      }).should.throw(CouponService.errors.DISCOUNT_TYPE_NOT_VALID);

      done();
    });

    it('should check params:discount_amount not valid', function(done) {
      var params = UtilityService.clone(valid_case);



      done();
    });

  });
});
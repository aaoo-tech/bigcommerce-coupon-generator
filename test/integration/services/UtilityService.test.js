var should = require('should');

describe('UtilityService', function() {
  describe('#is_int()', function() {
    it('should return true when 123', function(done) {
      UtilityService.is_int(123).should.equal(true);
      UtilityService.is_int('123').should.equal(true);
      done();
    });

    it('should return false when 1.2', function(done) {
      UtilityService.is_int(1.2).should.equal(false);
      UtilityService.is_int('1.2').should.equal(false);
      done();
    });

    it ('should return false when abc', function(done) {
      UtilityService.is_int('abc').should.equal(false);
      UtilityService.is_int('[]').should.equal(false);
      done();
    });

    it ('should return false when []', function(done) {
      UtilityService.is_int([]).should.equal(false);
      UtilityService.is_int([1]).should.equal(false);
      UtilityService.is_int([1, 2]).should.equal(false);
      done();
    });
  });

  describe('#validate_email', function() {
    it('should return true', function(done) {
      // [TODO] more cases
      UtilityService.validate_email('test@aaoo-tech.com').should.equal(true);
      done();
    });

    it('should return false', function(done) {
      // [TODO] more cases
      UtilityService.validate_email('123').should.equal(false);
      done();
    });
  });

  describe('#validate_url', function() {
    it('should return true', function(done) {
      // [TODO] more cases
      UtilityService.validate_url('www.aaoo-tech.com').should.equal(true);
      done();
    });

    it('should return false', function(done) {
      // [TODO] more cases
      UtilityService.validate_url('123').should.equal(false);
      done();
    });
  });
});
var should = require('should');

var _ = require('underscore');

describe('SettingModel', function() {
  describe('#find()', function() {

    it('not existed', function(done) {
      Setting.find({
        where: { field: 'test' }
      }).exec(function(err, setting) {
        should.equal(err, null);
        setting.should.deepEqual([]);
        done();
      });
    });
    
  });

  describe('#create()', function() {

    it('success', function(done) {

      Setting.create({
        'field': 'test',
        'value': 'test-value'
      }).then(function(setting) {
        setting.field.should.equal('test');
        setting.value.should.equal('test-value');
        done();
      });

    });

  });

  describe('#find()', function() {

    it('existed', function(done) {
      Setting.find({
        where: { field: 'test' }
      }).exec(function(err, setting) {
        should.equal(err, null);
        setting.length.should.equal(1);
        setting = setting[0];
        setting.field.should.equal('test');
        setting.value.should.equal('test-value');
        done();
      });
    });

  });

  describe('#delete()', function() {

    it('success', function(done) {
      Setting.destroy({
        'field': 'test'
      }).exec(function(err) {
        should.equal(err, null);
        done();
      });
    });

  });

  describe('#default', function() {
    it('cron_running', function(done) {
      
      Setting.find({
        where: { field: 'cron_running' }
      }).exec(function(err, setting) {
        should.equal(err, null);
        setting.length.should.equal(1);
        setting = setting[0];
        setting.field.should.equal('cron_running');
        done();
      });

    });
  });
});
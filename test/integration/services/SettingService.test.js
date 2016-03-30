var should = require('should');

var _ = require('underscore'),
    async = require('async');

describe('SettingService', function() {
  describe('#get()', function() {

    it('existed', function(done) {
      SettingService.get('cron_running', function(err, setting) {
        should.equal(err, null);
        setting.field.should.equal('cron_running');
        done();
      });
    });

    it('not existed', function(done) {
      SettingService.get('not_existed_field', function(err, setting) {
        should.equal(err, null);
        should.equal(setting, undefined);
        done();
      });
    });

  });

  describe('#set()', function() {

    it('existed', function(done) {
      var cron_running = null;
      async.waterfall([
        function (cb) {
          SettingService.get('cron_running', function(err, setting) {
            should.equal(err, null);
            setting.field.should.equal('cron_running');
            cron_running = setting.value;
            cb();
          });
        },
        function (cb) {
          SettingService.set('cron_running', 'testing', function() {
            cb();
          });
        },
        function (cb) {
          SettingService.get('cron_running', function(err, setting) {
            should.equal(err, null);
            setting.field.should.equal('cron_running');
            setting.value.should.equal('testing');
            cb();
          });
        },
        function (cb) {
          SettingService.set('cron_running', cron_running, function() {
            cb();
          });
        },
      ], function() {
        done();
      });
    });

    it('not existed', function(done) {
      async.waterfall([
        function (cb) {
          SettingService.set('not_existed_field', 'testing', function() {
            cb();
          });
        },
        function (cb) {
          SettingService.get('not_existed_field', function(err, setting) {
            should.equal(err, null);
            setting.field.should.equal('not_existed_field');
            setting.value.should.equal('testing');
            cb();
          });
        },
        function (cb) {
          Setting.destroy({
            'field': 'not_existed_field'
          }).exec(function(err) {
            should.equal(err, null);
            cb();
          });
        }
      ], function() {
        done();
      });
    });

  });
});
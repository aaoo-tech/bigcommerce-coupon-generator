var fs = require('fs'),
    json2csv = require('json2csv'),
    moment = require('moment'),
    randomstring = require('randomstring');

module.exports = {
  run: function() {
    async.waterfall([
      function(cb) { // check whether cron job is running
        Setting.find({field: 'cron_running'}).exec(function(err, settings) {
         // console.log(settings);
          if (settings[0].value == '1') {
            cb(null, false);
          } else {
            Setting.update(
              {id: settings[0].id}, 
              {value: '1'}
            ).exec(function(err) {
              // console.log(err);
              cb(null, true);
            });
          }
        });
      },
      function(_can_run, cb) {
        if (_can_run == false) {
          // cb(null, false);
          return;
        }
        Tasks.find({
          where: { status: 1 },
          sort: 'id ASC'
        }).exec(function(tasks) {
          async.eachSeries(tasks, function(_task, _task_callback) {//get confirm tasks
            Website.findOne({
              task_id: _task.id
            }).exec(function(websites) {
              _task.coupons.push(websites.coupon);
              _task_callback();
            }).catch(function(err) {
              _task.coupons = [];
              _task_callback();
            });
          }, function done() {
            console.log('Get tasks !');
            cb(null, tasks);
          });
        }).catch(function(err) {
          console.log(err);
        });
      },
      function(tasks, cb) {
        async.eachSeries(tasks, function (_task, _task_callback){
          Tasks.update({//task is running status
            id: _task.id
          },{
            status: 2
          }).then(function(updated) {
            console.log(_task.id + 'Task is running');
          }).catch(function(err) {
            console.log(err);
          });
          CsvService._read(_task.csv_filename, function(codes) {//read csv
            var repeat_code = [];
            async.eachSeries(codes, function(_code, _code_callback){
              if(_.where(_task.coupons, {code: _code.code}).length > 0){
                repeat_code.push(_code);
                _code_callback();
              }else{
                _task.coupons.push(_code);
                BigCommerceService.create({//create bigcommerce coupons
                  username: _task.username,
                  host: _task.url,
                  token: _task.token
                }, {
                    'name': _task._rules.coupon_name,
                    'type': _task._rules.discount_type,
                    'code': _code.code,
                    'amount': _task._rules.discount_amount,
                    'enabled': true,
                    'applies_to': {
                        'entity': 'categories',
                        'ids': '[' + _task.category + ']'
                    },
                    'max_uses': _task._rules.max_uses,
                    'num_uses' _task._rules.num_uses,
                }, function (response){
                  console.log(response.id + 'is created coupon');
                  _code_callback();
                });
              }
            }, function done() {
              if(_task.is_upload == 0){
                if(repeat_code.length > 0){
                  CouponService.generate(_task._rules, _task.coupons, function(csv_filename, coupon_codes) {
                    async.eachSeries(coupon_codes.data, function(_coupon_code, _coupon_code_callback){
                      if(_task.is_upload == 0){
                        var _create_params = {
                          'name': _task._rules.coupon_name,
                          'type': _task._rules.discount_type,
                          'code': _coupon_code.code,
                          'amount': _task._rules.discount_amount,
                          'enabled': true,
                          'applies_to': {
                              'entity': 'categories',
                              'ids': '[' + _task.category + ']'
                          },
                          'max_uses': _task._rules.max_uses,
                          'num_uses' _task._rules.num_uses,
                          },
                        }
                      }else{
                        var _create_params = {
                          'name': _coupon_code.name,
                          'type': _coupon_code.discount_type,
                          'code': _coupon_code.code,
                          'amount': _coupon_code.discount_amount,
                          'enabled': true,
                          'applies_to': {
                              'entity': 'categories',
                              'ids': '[' + _coupon_code.category + ']'
                          },
                          'max_uses': _coupon_code._rules.max_uses,
                          'num_uses' _coupon_code._rules.num_uses,
                          },
                        }
                      }
                      BigCommerceService.create({
                        username: _task.username,
                        host: _task.url,
                        token: _task.token
                      }, _create_params,
                      }, function (response){
                        coupon_code_callback();
                        console.log(response.id + 'is created coupon repeat');
                      });
                    }, function done (){
                      Tasks.update({
                        id: _task.id
                      },{
                        status: 3
                      }).then(function(updated) {
                        console.log(updated);
                        _task_callback();
                      }).catch(function(err) {
                        console.log(err);
                        _task_callback();
                      });
                    });
                  });
                }else{
                  Tasks.update({
                    id: _task.id
                  },{
                    status: 3
                  }).then(function(updated) {
                    console.log(updated);
                    _task_callback();
                  }).catch(function(err) {
                    console.log(err);
                    _task_callback();
                  });
                }
              }else{
                Tasks.update({
                    id: _task.id
                },{
                    status: 3
                }).then(function(updated) {
                  console.log('Is repeat' + repeat_code.length + 'codes, others we created');
                  _task_callback();
                  console.log(updated);
                }).catch(function(err) {
                  console.log(err);
                  _task_callback();
                });
              }
              EmailService('views/emails/',{
                form:,
                to:,
                subject: 'aaoo',
                attachments: [
                    {
                        filename: _task.csv_filename,
                        path: 'assets/download/' + _task.csv_filename
                    }
                ]
              }, function(info) {
                console.log(info);
              });
            });
          });
        }, function done() {
          cb(null);
        });
      }
    ]);
  }
};
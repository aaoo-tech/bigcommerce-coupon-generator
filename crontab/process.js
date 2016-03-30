var _ = require('underscore'),
    async = require('async'),
    sleep = require('sleep');

var SLEEP_INTERVAL = 2;

module.exports = {
  run: function() {
    async.waterfall([
      // check whether cron job is running
      function(cb) { 
        SettingService.get('cron_running', function(err, setting) {
          cb(
            (setting.value != '0') ? 
              'Cron job is running' : null
          );
        });
      },
      // update cron job status
      function(cb) {
        SettingService.set('cron_running', '1', function() {
          cb(null);
        });
      },
      // fetch the task
      function(cb) {
        Tasks.findOne({
          where: { status: 1 },
          sort: 'id ASC'
        }).exec(function(err, task) {
          if (err) {
            cb(err);
          } else {
            if (_.isUndefined(task) === true) {
              SettingService.set('cron_running', '0', function() {
                cb('No more task to run.');
              });
            } else {
              task._rules = JSON.parse(task._rules);
              cb(null, task);
            }
          }
        });
      },
      // update the task status
      function(task, cb) {
        Tasks.update({
          id: task.id
        }, {
          status: 2
        }).then(function() {
          cb(null, task);
        });
      },
      // fetch task related csv file
      function(task, cb) {
        CsvService.read(task.csv_filename, function(err, csvs) {
          if (err) {
            cb(err);
          } else {
            task.coupon = csvs.map(function(entry) {
              return entry.code;
            });

            cb(null, task, csvs);
          }
        });
      },
      // fetch the website
      function(task, csvs, cb) {
        Website.findOne({
          url: task.url
        }).exec(function(err, website) {
          if (err) {
            cb(err);
          } else {
            website.coupon = JSON.parse(website.coupon);
            website.coupon = website.coupon.map(function(entry) {
              return entry.code;
            });
            cb(null, task, website, csvs);
          }
        });
      },
      // prepare the task
      function(task, website, csvs, cb) {
        // check duplicate coupons
        var duplicated_codes = _.intersection(website.coupon, task.coupon);
        var code_collection = _.union(website.coupon, task.coupon);

        if (duplicated_codes.length > 0) {
          if (task.is_upload == 1) {
            task.coupon = _.difference(task.coupon, duplicated_codes);
          }

          if (task.is_upload == 0) {
            var rules = UtilityService.clone(task._rules);
            rules.number = duplicated_codes.length;

            task.coupon = _.union(
              CouponService.generate(rules, code_collection),
              _.difference(task.coupon, duplicated_codes)
            );
          }
        }

        var coupons = [];

        if (task.is_upload == 0) {
          _.each(task.coupon, function(coupon) {
            var tmp = {};
            tmp['name'] = task._rules.coupon_name + ' (' + coupon + ')';
            tmp['type'] = task._rules.discount_type;
            tmp['amount'] = task._rules.discount_amount;
            tmp['code'] = coupon;
            tmp['enabled'] = true;
            tmp['applies_to'] = {};

            if (_.isNull(task._rules.max_uses) === false && 
                _.isUndefined(task._rules.max_uses) === false) {
              tmp['max_uses'] = task._rules.max_uses;
            }

//            if (_.isNull(task._rules.num_uses) === false && 
//                _.isUndefined(task._rules.num_uses) === false) {
//              tmp['num_uses'] = task._rules.num_uses;
//            }

            if (task.category.length > 0) {
              tmp['applies_to'] = {
                'entity': 'categories',
                'ids': task.category.split(',')
              };
            }

            coupons.push(tmp);
          });
        } else {
          _.each(csvs, function(entry) {
            if (task.coupon.indexOf(entry.code) == -1) {
              return;
            }

            var tmp = {};
            tmp['name'] = entry.name + ' (' + entry.code + ')';
            tmp['type'] = entry.discount_type;
            tmp['amount'] = entry.discount_amount;
            tmp['code'] = entry.code;
            tmp['enabled'] = true;
            tmp['applies_to'] = {};

            if (_.isNull(entry.max_uses) === false && 
                _.isUndefined(entry.max_uses) === false) {
              tmp['max_uses'] = entry.max_uses;
            }

//            if (_.isNull(entry.num_uses) === false && 
//                _.isUndefined(entry.num_uses) === false) {
//              tmp['num_uses'] = entry.num_uses;
//            }

            // if (entry.category.length > 0) {
            //   tmp['applies_to'] = {
            //     'entity': 'categories',
            //     'ids': entry.category.split(',')
            //   };
            // }

            coupons.push(tmp);
          });
        }

        cb(null, task, website, csvs, coupons);
      },
      // run the task
/* ONLY ENALBE ON LIVE
      function(task, website, csvs, coupons, cb) {
        async.eachSeries(coupons, function(coupon, cb) {
          CouponService.upload({
            username: task.username,
            host: task.url,
            token: task.token 
          }, coupon, function(response) {
            sleep.sleep(SLEEP_INTERVAL);
            console.log(response);
            cb();
          });
        }, function() {
          cb(null, task, website, csvs, coupons);
        });
      },
*/
      // update task status
      function(task, website, csvs, coupons, cb) {
        Tasks.update({
          id: task.id
        },{
          status: 3
        }).then(function(updated) {
          cb(null, task, website, csvs, coupons);
        }).catch(function(err) {
          cb(err);
        });
      },
      // set cronjob status
      function(task, website, csvs, coupons, cb) {
        SettingService.set('cron_running', '0', function() {
          cb(null, task, website, csvs, coupons);
        });
      },
      // send email
      function(task, website, csvs, coupons, cb) {
        EmailService.send(
          sails.config.email.template.complete,
          {
            'from': sails.config.email.from,
            'to': task.email,
            'subject': 'Task Complete #' + task.id + ' from AAOO Tech',
            'task': task
          },
          function(err, info) {
            cb(err, task);
          }
        );
      }
    ], function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
};

var _ = require('underscore'),
    async = require('async'),
    sleep = require('sleep');

var SLEEP_INTERVAL = 2;

module.exports = {
  run: function() {
    async.waterfall([
      // check whether cron job is running
      function(cb) { 
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
      // fetch the task
      function(_can_run, cb) {
        if (_can_run === false) {
          cb(null, false);
          return;
        }

        Tasks.findOne({
          where: { status: 1 },
          sort: 'id ASC'
        }).exec(function(err, task) {
          if (err) {
          } else {
            Tasks.update({
              id: task.id
            }, {
              status: 2
            }).then(function() {
              cb(null, _can_run, task);
            });
          }
        }
      },
      // fetch the website
      function(_can_run, task, cb) {
        if (_can_run === false) {
          cb(null, false);
          return;
        }

        Website.findOne({
          // task_id: task.id
          url: task.url
        }).exec(function(err, website) {
          if (err) {

          } else {
            cb(null, _can_run, task, website);
          }
        });
      },
      // run the task
      function(_can_run, task, website, cb) {
        if (_can_run === false) {
          cb(null, false);
          return;
        }

        var website_codes = JSON.parse(website.coupon);
        website_codes = website_codes.map(function(entry) {
          return entry.code;
        });

        CsvService._read(task.csv_filename, function(csvs) {
          var csv_codes = csvs.map(function(entry) {
            return entry.code;
          });

          var duplicated_codes = _.intersect(website_codes, csv_codes);
          var code_collection = _.union(website_codes, csv_codes);
          var rules = task._rules;

          // regenerate duplocated coupons
          if (task.is_upload == 0 && duplicated_codes.length > 0) {
            rules.number = duplicated_codes.length;

            code_collection = _.union(
              code_collection, 
              CouponService.generate(rules, code_collection)
            );
          }

          var task_name = rule.coupon_name,
              task_discount_type = rule.discount_type,
              task_discount_amount = rule.discount_amount,
              task_max_uses = rule.max_uses,
              task_num_uses = rule.num_uses;

          if (task.is_upload == 1) {
            task_name = csvs.name;
            task_discount_type = csvs.discount_type;
            task_discount_amount = csvs.discount_amount;
            task_max_uses = csvs.max_uses;
            task_num_uses = csvs.num_uses;
          } 

          async.eachSeries(code_collection, function(code, cb) {
            BigCommerceService.create({
              username: task.username,
              host: task.url,
              token: task.token 
            }, {
              'name': task_name,
              'type': task_discount_type,
              'code': _code.code,
              'amount': task_discount_amount,
              'enabled': true,
              'applies_to': {
                  'entity': 'categories',
                  'ids': '[' + _task.category + ']'
              },
              'max_uses': task_max_uses,
              'num_uses': task_num_uses
            }, function(response) {
              sleep(SLEEP_INTERVAL);
              cb();
            });
          });
        }, function done() {
          cb(null, task);
        });
      },
      // update task status
      function(task, cb) {
        Tasks.update({
          id: task.id
        },{
          status: 3
        }).then(function(updated) {
          cb(null, task);
        }).catch(function(err) {
          cb(err);
        });
      },
      // send email
      function(task, cb) {
        EmailService.send(
          sails.config.email.template.complete,
          {
            'from': sails.config.email.from,
            'to': task.email,
            'subject': 'Task Complete #' + task.id + ' from AAOO Tech',
            'task': task
          },
          function(err, info) {
            cb(null, task);
          }
        );
      }
    ]);
  }
};
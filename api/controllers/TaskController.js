/**
 * TaskController
 *
 * @description :: Server-side logic for managing task
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var _ = require('underscore'),
     async = require('async');

 module.exports = {
    valid_create: function(params) {
        // valid email
        if (params.email.length <= 0 || UtilityService.validate_email(params.email) === false) {
            return false;
        }

        // valid website
        if (params.url.length <= 0 || UtilityService.validate_url(params.url) === false) {
            return false;
        }

        // username and token
        if (params.username.length <= 0 || params.token.length <= 0) {
            return false;
        }

        return true;
    },
    create: function(req, res) {
        console.log(req.session);
        var params = req.allParams();

        if (params.url.substr(0, 7) == 'http://') {
            params.url = substr(7);
        }

        if (params.url.substr(0, 8) == 'https://') {
            params.url = substr(8);   
        }

        if (this.valid_create(params) === false) {
            return res.json({
                success: false,
                message: 'parameters not valid.'
            });
        }

        // [TODO] one website only allowed to run one task at the same time
        // [TODO] check session

        async.waterfall([
            // create task
            function (cb) {
                Tasks.create({
                    'email': params.email,
                    'url': params.url,
                    'username': params.username,
                    'token': params.token,
                    
                    'csv_filename': req.session._filename,
                    '_rules': JSON.stringify(req.session._rules),

                    'is_upload': req.session.is_upload,
                    'status': 0
                }).then(function(task) {
                    req.session.task_id = task.id;
                    cb(null, task);
                });
            },

            // fetch coupons
            function (task, cb) {
                CouponService.fetch({
                    'host': task.url,
                    'username': task.username,
                    'token': task.token
                }, {}, function(coupons) {
                    if (coupons.error) {
                        return res.json({
                            success: false,
                            message: 'API call failure.'
                        });
                    }

                    cb(null, task, coupons);
                });
            },

            // fetch categories
            function (task, coupons, cb) {
                console.log(task);
                console.log(coupons.length);
                CategoryService.fetch({
                    'host': task.url,
                    'username': task.username,
                    'token': task.token
                }, {}, function (categories) {
                    if (categories.error) {
                        return res.json({
                            success: false,
                            message: 'API call failure.'
                        });
                    }
                    cb(null, task, coupons, categories);
                });
            },

            // update database
            function (task, coupons, categories, cb) {
                Website.findOne({
                    'url': task.url
                }).exec(function(err, website) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Unknown erros occured.'
                        });
                    }

                    if (_.isUndefined(website)) {
                        // create
                        Website.create({
                            url: task.url,
                            coupon: JSON.stringify(coupons),
                            categories: JSON.stringify(categories),
                            task_id: task.id
                        }).then(function(website) {
                            cb(null, coupons, categories);
                        });
                    } else {
                        // update
                        Website.update({
                            'url': task.url
                        }, {
                            coupon: JSON.stringify(coupons),
                            categories: JSON.stringify(categories),
                            task_id: task.id
                        }).exec(function() {
                            cb(null, task, coupons, categories);
                        });
                    }
                });
            }
        ], function(err, task, coupons, categories) {
            // prepare output

            if (_.isArray(categories) === true) {
                categories = categories.map(function(entry) {
                    return {
                        id: entry.id,
                        name: entry.name
                    };
                });
            } else {
                categories = [];
            }

            coupons = coupons.map(function(entry) {
                return entry.code;
            });

            CsvService._read(task.csv_filename, function(codes) {
                console.log(codes);

                var existed = coupons.length,
                    expected = codes.length + coupons.length;

                coupons = _.union(coupons, codes);

                var duplicated = expected - coupons.length;

                return res.json({
                    success: true,
                    data: {
                        coupons: {
                            existed: existed,
                            duplicated: duplicated
                        }, 
                        categories: categories
                    }
                });

            });

            
        });
    },
    confirm: function(req, res) {
        var params = req.allParams();

        // [TODO] check parameters
        if (_.isUndefined(params.category) == true) {
            params.category = "";
        }

        async.waterfall([
            function(cb) {
                // update confirmation
                Tasks.update({
                    id: req.session.task_id
                },{
                    status: 1,
                    category: params.category
                }).then(function(task) {
                    cb(null, task[0]);
                }).catch(function(err) {
                    cb(err);
                });
            },
            function(task, cb) {
                task.categories = task.category.split(',');
                task.filename = '/coupon/download?filename=' + task.csv_filename;

                EmailService.send(
                    sails.config.email.template.confirmation,
                    {
                        'from': 'AAOO Tech Ltd. <contact@aaoo-tech.com>',
                        'to': task.email,
                        'subject': 'Task Confirmation #' + task.id + ' from AAOO Tech',
                        'task': task
                    },
                    function(err, info) {
                        cb(null, task);
                    }
                );
            }
        ], function(err) {
            // prepare the output
            if (_.isUndefined(err) === false && _.isNull(err) === false) {
                res.json({
                    success: false,
                    message: err
                });
            } else {
                res.json({
                    success: true,
                    data: {}
                });
            }
        });
    }
 }

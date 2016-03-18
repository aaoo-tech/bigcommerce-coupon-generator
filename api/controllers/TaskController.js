/**
 * TaskController
 *
 * @description :: Server-side logic for managing task
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var fs = require('fs'),
    json2csv = require('json2csv'),
    moment = require('moment'),
    _ = require('underscore'),
    async = require('async'),
    randomstring = require('randomstring');
 module.exports = {
    create: function(req, res) {
        var params = req.allParams();
        var _email = params.email,
            _url = params.url,
            _token = params.token,
            username = params.username;
        // var code_form = parseInt("" + uppercase + lowercase + digital, 2);

        Tasks.create({
            email: _email,
            url: _url,
            token: _token,
            username: username,
            csv_filename: req.session._filename,
            // is_upload: 0,
            _rules: JSON.stringify(req.session._rules),
            // status: 0
        }).then(function (tasked) {
            CouponService.fetch({ 
                'username': tasked.username,
                'host': tasked.url,
                'token': tasked.token
                }, {}, function (coupons){//get all coupons
                if (coupons.error && coupons.error == true) {
                    console.log('error occured during order request ');
                    return res.json({
                        data: false
                    });
                }else{
                    var repeat_code_len,
                        another_code_len;
                    CsvService._read(tasked.csv_filename, function(codes) {
                        var repeat_code = [];
                        async.eachSeries(codes, function(_code, _code_callback){
                            var evens = _.where(coupons, _code);
                            if(_.size(evens) > 0){
                                repeat_code.push(_code);
                            }
                            _code_callback();
                        }, function done() {
                            repeat_code_len = repeat_code.length;
                            console.log(codes.length);
                            another_code_len = codes.length - repeat_code.length;
                        });
                    });
                    CategoryService.fetch({
                    'username': tasked.username,
                    'host': tasked.url,
                    'token': tasked.token
                    }, {}, function (category){//get all cotegories
                        Website.create({//create this store coupons and categories
                            url: tasked.url,
                            coupon: JSON.stringify(coupons),
                            categories: JSON.stringify(category),
                            task_id: tasked.id
                        }).then(function (created){
                            console.log('Task has submit !');
                            req.session.task_id = tasked.id;
                            return res.json({
                                data: {
                                    had_codes: coupons.length,
                                    category_len: category.length,
                                    categories: category,
                                    repeat_code: repeat_code_len,
                                    another_code: another_code_len
                                }
                            });
                        }).catch(function (err){

                        });
                    });
                }
            });
        }).catch(function (err) {
            console.log(err);
            return res.json({
                data: false
            });
        });
    },
    confirm: function(req, res) {
        var params = req.allParams();
        console.log(params);
        Tasks.update({
            id: req.session.task_id
        },{
            status: 1,
            category: params.category
        }).then(function(updated) {
            console.log(updated);
        }).catch(function(err) {
            console.log(err);
        });
    }
 }
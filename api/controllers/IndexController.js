/**
 * IndexController
 *
 * @description :: Server-side logic for managing index
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var fs = require('fs'),
    json2csv = require('json2csv'),
    moment = require('moment'),
    _ = require('underscore'),
    async = require('async'),
    path = require('path'),
    randomstring = require('randomstring');
 module.exports = {
  index: function (req,res){
//     // req.session.user = {'id':7, 'email': '312313@qq.com'};
//     CouponService.fetch(AuthService['hk'], {}, function (coupons){
//         console.log(coupons);
//     });
// // CsvService._read('coupon-code-2016-03-15-hv78T8A.csv', function (codes) {
// //     // console.log(codes);
// //     // JSON.parse(codes)
// //     _.each(codes, function(_code){
// //         console.log(_code.code);
// //     });
//       return res.json({
//         message: 'codes'
//       });
// // });
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
    '<form action="http://localhost:1337/index/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="avatar" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
    )
  },
  upload: function  (req, res) {
    req.file('avatar').upload({dirname: path.resolve(sails.config.appPath, '/assets/images')},function (err, files) {
      if (err)
        return res.serverError(err);

      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });
  },
    // index: function(req, res) {
    //     return res.view('index/task-form');
    // },
    // upload: function(req, res) {
    //     var params = req.allParams();
    //     console.log(req.file('file_test'));
    //     req.file('file_test').upload({
    //       dirname: require('path').resolve(sails.config.appPath, '/assets/images')
    //     },function (err, uploadedFiles) {
    //       if (err) return res.negotiate(err);

    //       return res.json({
    //         message: uploadedFiles.length + ' file(s) uploaded successfully!'
    //       });
    //     });
    // },
    tasks: function(req, res) {
        var params = req.allParams();
        var _email = params.email,
            _url = params.url,
            _token = params.token,
            uppercase = params.uppercase ? params.uppercase:0,
            lowercase = params.lowercase ? params.lowercase:0,
            digital = params.digital ? params.digital:0,
            _prefix = params._prefix,
            _suffix = params.suffix,
            _length = params._length,
            _number = params.number;
        var code_form = parseInt("" + uppercase + lowercase + digital, 2);

        Tasks.create({
            email: _email,
            url: _url,
            token: _token,
            charset: code_form,
            prefix: _prefix,
            suffix: _suffix,
            length: _length,
            number: _number
        }).then(function (tasked) {
            console.log(tasked);
            return res.json({
                data: 'OKa!'
            });
        }).catch(function (err) {
            console.log(err);
            return res.json({
                data: 'No!'
            });
        });
    },
    test: function(req, res) {
        waterfall([
            function (cb){
                CouponService.gets(store, {}, function (coupons){
                    cb(null, coupons);
                });
            },
            function (coupons,cb){
                var _old_codes = [];
                var _create = function (num, old_codes){//create coupon if repeat do this again
                    CreatecodeService.generate({
                        charset: 0,
                        prefix: 'YY',
                        suffix: 'KK',
                        length: '12',
                        number: num
                    }, old_codes, function (codes){//generate codes
                        async.eachSeries(codes, function(_code, _code_callback){
                            _old_codes.push(_code);
                            var evens = _.where(coupons, _code);
                            if(_.size(evens) > 0){
                                repeat_code.push(_code);
                                _code_callback();
                            }else{
                                CouponService.create(store, {}, function (response){//create coupon code without repeat
                                    console.log(response);
                                    _code_callback();
                                });
                            }
                        }, function done (){
                            console.log(repeat_code.length);
                            if(repeat_code > 0){
                                _create(repeat_code.length, _old_codes);
                            }else{
                                cb(null);
                            }
                        });
                    });
                }
                _create(1000,[]);
                // console.log(codes);
                // var repeat_code = [];
                // CouponService.gets(store, {}, function (coupons){
                //     console.log(coupons);
                //     // cb(null, coupons);
                //     async.eachSeries(codes, function(_code, _code_callback){
                //         var evens = _.where(coupons, _code);
                //         if(_.size(evens) > 0){
                //             repeat_code.push(_code);
                //             _code_callback();
                //         }else{
                //             CouponService.create(store, {}, function (response){
                //                 console.log(response);
                //                 _code_callback();
                //             });
                //         }
                //         console.log(_code);
                //     }, function done (){
                //         console.log('12');
                //         console.log(repeat_code);
                //         cb(null);
                //     });
                // });
            }
        ],function (err){
            console.log(err);
        });
        return res.json({
            data: '!'
        });
    },
    gets: function(req, res) {
        var stores = [
          { // us
            'username': 'ecif',
            'host': 'www.nativeunion.com',
            'token': '5c1c89d2039ff9f336fcef681d9f1b7af5203c8b',
          },
          { // uk
            'username': 'ecif',
            'host': 'www.nativeunion.co.uk',
            'token': '9b01fb23c617895e04de95469d9b39efec7e9800',
          },
          { // eu
            'username': 'ecif',
            'host': 'www.nativeunion.eu',
            'token': '4a62ba6b0a19558cbab5626205a733114955f605',
          },
          { // hk
            'username': 'ecif',
            'host': 'www.nativeunion.hk',
            'token': '93e2e7a39a33ae5f4a4fd55fdc3f1cf50ab58e60',
          },
          { // au
            'username': 'ecif',
            'host': 'www.nativeunion.com.au',
            'token': 'f40d63338108dd96ce44152387a47380574411ab',
          },
          { // ca
            'username': 'ecif',
            'host': 'www.nativeunion.ca',
            'token': '1285895c41b5f41162d95d8627716813fcc5490b',
          }
        ];
        CouponService.gets(stores[1], {}, function(coupons) {
            console.log(coupons);
        });
        return res.json({
            data: 'No!'
        });
    },
    code: function(req, res) {
        // var params = req.allParams();
        // var email = params.email,
        //     url = params.url,
        //     token = params.token,
        //     uppercase = params.uppercase ? params.uppercase:0,
        //     lowercase = params.lowercase ? params.lowercase:0,
        //     digital = params.digital ? params.digital:0,
        //     _prefix = params._prefix,
        //     suffix = params.suffix,
        //     _length = params._length,
        //     number = params.number;
        // var _charset,
        //     code_form = parseInt("" + uppercase + lowercase + digital, 2);
        async.waterfall([
            function(cb) {
                Tasks.find({ 
                    where: { status: 0 },
                    sort: 'id ASC'
                }).then(function (tasks) {
                    // console.log(tasks);
                    cb(null, tasks);
                }).catch(function (err) {

                });
            },
            function(task_list, cb){
                async.eachSeries(task_list, function (_task, _task_callback){
                    switch(_task.charset){
                        //none
                        case 0:
                            _charset = 'alphanumeric';
                        break;
                        //number
                        case 1:
                            _charset = 'numeric';
                        break;
                        //lowercase
                        case 2:
                            _charset = 'abcdefghijqlmnopqrstuvwxyz';
                        break;
                        //lowercase and number
                        case 3:
                            _charset = 'abcdefghijqlmnopqrstuvwxyz0123456789';
                        break;
                        //uppercase
                        case 4:
                            _charset = 'ABCDEFGHIJQLMNOPQRSTUVWXYZ';
                        break;
                        //uppercase and number
                        case 5:
                            _charset = 'ABCDEFGHIJQLMNOPQRSTUVWXYZ0123456789';
                        break;
                        //uppercase and lowercase
                        case 6:
                            _charset = 'alphabetic';
                        break;
                        //uppercase and lowercase and number
                        case 7:
                            _charset = 'alphanumeric';
                        break;
                        //default
                        default:
                            _charset = 'alphanumeric';
                    }
                    var fields = ['code'];
                    var data = [];
                    for (var i = 0; i < parseInt(_task.number); i++) {
                        var _code = randomstring.generate({
                          length: parseInt(_task.length),
                          charset: _charset,
                        });
                        var coupon_code = {"code": _task.prefix + "-" + _code + "-" + _task.suffix};
                        var evens = _.where(data, coupon_code);
                        if(_.size(evens) > 0){
                            number++;
                        }else{
                            data.push(coupon_code);
                        }
                    }
                    json2csv({ data: data, fields: fields }, function(err, csv) {
                        if(err){
                            console.log(err);
                        }
                        var filename = 'assets/download/coupon-code-' + moment().format('YYYY-MM-DD') + '-' + randomstring.generate(7) + ".csv";
                        fs.writeFile(filename, csv, function(err) {
                            console.log(_task.id);
                            _task_callback();
                        });
                    });
                },function done () {
                    console.log('123456 ... done');
                });
            }
        ], function (err){
            console.log(err);
        });
        return res.json({
            data: 'OK!'
        });
        // var _charset;
        // switch(code_form){
        //     //none
        //     case 0:
        //         _charset = 'alphanumeric';
        //     break;
        //     //number
        //     case 1:
        //         _charset = 'numeric';
        //     break;
        //     //lowercase
        //     case 2:
        //         _charset = 'abcdefghijqlmnopqrstuvwxyz';
        //     break;
        //     //lowercase and number
        //     case 3:
        //         _charset = 'abcdefghijqlmnopqrstuvwxyz0123456789';
        //     break;
        //     //uppercase
        //     case 4:
        //         _charset = 'ABCDEFGHIJQLMNOPQRSTUVWXYZ';
        //     break;
        //     //uppercase and number
        //     case 5:
        //         _charset = 'ABCDEFGHIJQLMNOPQRSTUVWXYZ0123456789';
        //     break;
        //     //uppercase and lowercase
        //     case 6:
        //         _charset = 'alphabetic';
        //     break;
        //     //uppercase and lowercase and number
        //     case 7:
        //         _charset = 'alphanumeric';
        //     break;
        //     //default
        //     default:
        //         _charset = 'alphanumeric';
        // }
        // var fields = ['code'];
        // var data = [];
        // for (var i = 0; i < parseInt(number); i++) {
        //     var _code = randomstring.generate({
        //       length: parseInt(_length),
        //       charset: _charset,
        //     });
        //     var coupon_code = {"code": _prefix + "-" + _code + "-" + suffix};
        //     var evens = _.where(data, coupon_code);
        //     if(_.size(evens) > 0){
        //         number++;
        //     }else{
        //         data.push(coupon_code);
        //     }
        //     // data.push(coupon_code);
        // }
        // json2csv({ data: data, fields: fields }, function(err, csv) {
        //     if(err){
        //         console.log(err);
        //     }
        //     var filename = 'assets/download/coupon-code-' + moment().format('YYYY-MM-DD') + '-' + randomstring.generate(7) + ".csv";
        //     fs.writeFile(filename, csv, function(err) {
        //         console.log('file save');
        //     });
        // });
    }
 }
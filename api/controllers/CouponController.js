/**
 * CouponController
 *
 * @description :: Server-side logic for managing coupon
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var fs = require('fs'),
     moment = require('moment');

 module.exports = {
    valid_params: function (params) {
        // check the cout
        if (UtilityService.is_int(params.number) === false) {
            return false;
        }
        params.number = +params.number;
        if (params.number < 0 || params.number > 100000) {
            return false;
        }

        // check the name
        if (params.coupon_name.length <= 0 || params.coupon_name.length > 30) { 
            return false;
        }

        // check the prefix and suffix
        if (params._prefix.length > 10 || params.suffix.length > 10) {
            return false;
        }

        // check length
        if (UtilityService.is_int(params.len) === false) {
            return false;
        }
        params.len = +params.len;
        if (params.len < 6 || params.len > 10){
            return false;
        }

        // check the charset
        if (UtilityService.is_int(params._charset) === false) {
            return false;
        }
        params._charset = +params._charset;
        if (params._charset < 0 || params._charset >= CouponService.charsets.length) {
            return false;
        }

        // check discount type and discount amount
        if (UtilityService.is_int(params.discount_type) === false) {
            return false;
        }
        params.discount_type = +params.discount_type;
        if (params.discount_type < 0 || params.discount_type >= CouponService.discount_types.length) {
            return false;
        }

        // free shipping doesn't require parameters
        if (params.discount_type < 4) {
            if (UtilityService.is_int(params.discount_amount) === false) {
                return false;
            }
            params.discount_amount = +params.discount_amount;
        }

        // max_uses
        if (UtilityService.is_int(params.max_uses) === false) {
            return false;
        }

        // num_uses
        if (UtilityService.is_int(params.num_uses) === false) {
            return false;
        }

        // expire date
        if (moment(params.expiry_data).isValid() === false) {
            return false;
        }

        return true;
    },
    express: function(req, res) {
        var params = req.allParams();
        
        params._charset = 0;
        params._prefix = 'AA-';
        params.suffix = '-OO';
        params.len = 8;
        params.is_express = 1;

        // set default properties
        params.coupon_name = 'Coupon by AAOO';
        params.max_uses = 1;
        params.num_uses = 1;
        params.expiry_date = '2100-01-01';

        switch (params.discount) {
        case '0':
            params.discount_type = 0;
            params.discount_amount = 10;
            break;
        case '1':
            params.discount_type = 2;
            params.discount_amount = 10;
            break;
        case '2':
            params.discount_type = 4;
            params.discount_amount = 0;
        }

        if (this.valid_params(params) === false) {
            return res.json({
                success: false,
                message: 'Parameters are not correctly set.'
            });
        }

        CouponService.generate(params, [], function(filename, coupons) {
            req.session._rules = params;
            req.session._filename = filename;
            req.is_upload = 0;
            return res.json({
                success: true,
                data: { filename: filename }
            });
        });
    },
    advanced: function(req, res) {
        var params = req.allParams();
        params.is_express = 0;
        // if (params._prefix == '') { params._prefix = 'AA-'; }
        // if (params.suffix == '') { params.suffix = '-OO'; }
        if (params.max_uses == '') { params.max_uses = -1; }
        if (params.num_uses == '') { params.num_uses = -1; }

        if (_.isUndefined(params.expiry_date) === true) { params.expiry_date = '2100-01-01'; }
        
        if (this.valid_params(params) === false) {
            return res.json({
                success: false,
                message: 'Parameters are not correctly set.'
            });
        }

        CouponService.generate(params, [], function(filename, coupons) {
            console.log(filename);
            req.session._rules = params;
            req.session._filename = filename.filename;
            req.is_upload = 0;
            return res.json({
                success: true,
                data: { filename: filename }
            });
        });
    },
    upload: function(req, res) {
        req.file('csv_file').upload({ dirname: './' }, function (err, files) {
            // [TODO] check file type
            console.log(files);
            if (err){
                return res.serverError(err);
            }else{
                // async.eachSeries(files, function(_file) {
                //     var point = _file.filename.lastIndexOf(".");
                //     var type = _file.filename.substr(point);
                //     if(type == '.csv'){
                        
                //     }
                // },function done() {
                //     return res.json({
                //         message: files.length + ' file(s) uploaded successfully!',
                //         files: files
                //     });
                // });
            }
        });
    },
    download: function(req, res) {
        res.set({
            'Content-Type': 'application/csv',
            'Content-Disposition': "attachment;filename=" + req.param('filename')
        });
        fs.createReadStream('assets/download/' + req.param('filename')).pipe(res);
    }
 }
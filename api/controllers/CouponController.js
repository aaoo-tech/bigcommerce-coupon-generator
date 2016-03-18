/**
 * CouponController
 *
 * @description :: Server-side logic for managing coupon
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var fs = require('fs');
 module.exports = {
    express: function(req, res) {
        var params = req.allParams();
        if (params.number.match(/^\d{1,6}$/g) == null) {
            return res.json({
                message: 'Number must be an integer between 1 and 100000.'
            });
        }
        params._charset = 0;
        params._prefix = 'AA-';
        params.suffix = '-OO';
        params.len = 8;
        params.is_express = 1;

        // set default properties
        params.coupon_name = 'Coupon by AAOO';
        params.max_uses = 1;
        params.num_uses = 1;
        params.expire_date = '2100-01-01';

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

        CouponService.generate(params, [], function(filename) {
            console.log(filename);
            req.session._rules = params;
            req.session._filename = filename.filename;
            console.log(req.session._filename);
            return res.json({
                data: filename
            });
        });
    },
    advanced: function(req, res) {
        var params = req.allParams();
        params.is_express = 0;
        console.log(params);

        // check the parameters
        if (params.number.match(/^\d{1,6}$/g) == null) {
            return res.json({
                message: 'Number must be an integer between 1 and 100000.'
            });
        }
        if(params.coupon_name.match(/^.{0,300}.*[^ ].*$/g) == null){
            return res.json({
                message: 'Coupon name must be between 1 and 300.'
            });
        }
        if(params._prefix.length > 10 || params.suffix.length > 10){
            return res.json({
                message: 'The length of the prefix or suffix can not be more than 10.'
            });
        }
        if(params.len < 6 || params.len > 20 || params.len.match(/^[1-9]\d*$/g) == null){
            return res.json({
                message: 'Length must be an integer between 6 and 20.'
            });
        }
        // if(params.discount_type || discount_amount.match() == null){
        //     return res.json({
        //         message:
        //     });
        // }
        if(params.max_uses.match(/^-?[1-9]\d*$/g) == null && params.max_uses != '' || params.num_uses.match(/^-?[1-9]\d*$/g) == null && params.num_uses != ''){
            return res.json({
                message: 'The max_uses and num_uses must be an integer.'
            });
        }
        if(params.expire_date != '' && params.expire_date.match(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/g) == null){
            return res.json({
                message: 'Expire date must be an date.'
            });
        }
        if (params._prefix == '') { params._prefix = 'AA-'; }
        if (params.suffix == '') { params.suffix = '-OO'; }
        if (params.max_uses == '') { params.max_uses = -1; }
        if (params.num_uses == '') { params.num_uses = -1; }
        if (_.isUndefined(params.expire_date)) { params.expire_date = '2100-01-01'; }

        CouponService.generate(params, [], function(filename) {
            console.log(filename);
            req.session._rules = params;
            req.session._filename = filename.filename;
            return res.json({
                data: filename
            });
        });
    },
    upload: function(req, res) {
        req.file('csv_file').upload({dirname: './'},function (err, files) {
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
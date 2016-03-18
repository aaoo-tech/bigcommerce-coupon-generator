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
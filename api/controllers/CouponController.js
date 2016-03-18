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
        params._prefix = 'AA';
        params.suffix = 'OO';
        params.len = 8;
        params.is_express = 1;
        // params.number = 100;
        // console.log(params);
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
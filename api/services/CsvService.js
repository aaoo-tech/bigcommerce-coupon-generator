 var fs = require('fs'),
     async = require('async'),
     json2csv = require('json2csv'),
     csv2json = require('csv2json-convertor'),
     moment = require('moment'),
     randomstring = require('randomstring');


module.exports = {
    base_path: 'assets/download/',
    write: function(data, fields, callback) {
        var filename = 'coupon-code-' + moment().format('YYYY-MM-DD') + '-' + randomstring.generate(7) + ".csv",
            path = CsvService.base_path + filename;

        async.waterfall([
            // generate csv
            function(cb) {
                json2csv({ data: data, fields: fields }, function(err, csv) {
                    cb(err, csv);
                });
            },
            // write file
            function(csv, cb) {
                fs.writeFile(path, csv, function(err) {
                    cb(err);
                });
            }
        ], function(err) {
            callback(err, filename);
        });
    },
    read: function(filename, callback) {
        var path = CsvService.base_path + filename;
        fs.stat(path, function(err, stat) {
            if (err || stat.isFile() === false) {
                callback(err);
            } else {
                callback(
                    null, 
                    csv2json.csvtojson(path)
                );
            }
        });
    }
}
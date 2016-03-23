 var fs = require('fs'),
    json2csv = require('json2csv'),
    csv2json = require('csv2json-convertor'),
    moment = require('moment'),
    _ = require('underscore'),
    async = require('async'),
    randomstring = require('randomstring');
    var base_path = 'assets/download/';
module.exports = {
    _write: function(data, fields, callback) {
        // var fields = ['code'];
        json2csv({ data: data, fields: fields }, function(err, csv) {
            if(err){
                console.log(err);
            }
            var filename = 'coupon-code-' + moment().format('YYYY-MM-DD') + '-' + randomstring.generate(7) + ".csv";
            fs.writeFile(base_path + filename, csv, function(err) {
                callback(filename);
            });
        });
    },
    _read: function(filename, callback) {
        fs.stat(base_path + filename, function(err, stat) {
            if(err == null && stat.isFile()) {
                var data = csv2json.csvtojson(base_path + filename);
                callback(data);
            }else{
                callback(false);
            }
        });
    }
}
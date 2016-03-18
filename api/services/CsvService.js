 var fs = require('fs'),
    json2csv = require('json2csv'),
    csv2json = require('csv2json-convertor'),
    moment = require('moment'),
    _ = require('underscore'),
    async = require('async'),
    randomstring = require('randomstring');
module.exports = {
    _write: function(data, fields, callback) {
        // var fields = ['code'];
        json2csv({ data: data, fields: fields }, function(err, csv) {
            if(err){
                console.log(err);
            }
            var filename = 'coupon-code-' + moment().format('YYYY-MM-DD') + '-' + randomstring.generate(7) + ".csv";
            fs.writeFile('assets/download/' + filename, csv, function(err) {
                callback(filename);
            });
        });
    },
    _read: function(filename, callback) {
        var data = csv2json.csvtojson('assets/download/' + filename);
        callback(data);
        // fs.readFile('assets/download/' + filename, 'utf8', function(err, data) {
        //     callback(data);
        // });
    }
}
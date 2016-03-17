var _ = require('underscore');

var https = require('https'),
    util = require('util');

var host, headers;

var error_message = '{"error": true}';

var _get = function(path, callback) {
  var options = {
    host: host,
    path: path,
    method: 'GET',
    headers: headers
  };
  var req = https.request(options, function(response) {
    var str = '';
    // console.log(options.path);
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      if (_.isFunction(callback) == true) {
        callback(str);
      }
    });
  });

  req.on('error', function(err) {
    callback(error_message);
  });

  req.end();
};

var _post = function(path, params, _callback) {
    var _headers = headers;
    _headers['Content-Length'] = Buffer.byteLength(JSON.stringify(params));
    var options = {
      host: host,
      path: path,
      method: 'POST',
      headers: _headers
    };

    var req = https.request(options, function(response) {
        var str = '';
            response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function() {
            if (_.isFunction(_callback) == true) {
                _callback(str);
            }
        });
    });

    req.on('error', function(err) {
        console.log(err);
        callback(error_message);
    });

    req.write(JSON.stringify(params));
    req.end();
};

module.exports = {
  gets: function(bigcommerce, auth, params, callback) {

    host = bigcommerce.host;
    var username = bigcommerce.username,
        token = bigcommerce.token,
        authorization = util.format('%s: %s', username, token);

    headers = {
      'Authorization': 'Basic ' + new Buffer(authorization).toString('base64'),
      'Content-Type': 'application/json'
    };

    params.limit = 250;

    var p = [];
    _.each(params, function(param, idx) {
      p.push(idx + '=' + encodeURIComponent(param));
    });

    var _jsons = [];
    var _gets = function(_page) {
      var _p = p;
      _p.push('page=' + _page);
      console.log(p);
      var _path = util.format(auth + '?%s', _p.join('&'));
      // console.log(_path);
      _get(_path, function(response) {
        if (response.length == 0) {
          callback(coupons);
          return;
        }

        // console.log(response);

        var data = JSON.parse(response);
        // console.log(_path);
        if(data.error && data.error === true){
          console.log('error');
          callback(data);
          return;
        }
        async.waterfall([
          function(_callback) {
            async.eachSeries(data, function(odd, __callback) {
              _jsons.push(odd);
              __callback();
            }, function done() {
              _callback();
            });
          }
        ], function() {
          if (data.length == 250) {
            _gets(_page+1);
          } else {
            callback(_jsons);
          }
        });
      });
    };
    _gets(1);
  },
  posts: function(bigcommerce, params, callback) {

    host = bigcommerce.host;
    var username = bigcommerce.username,
        token = bigcommerce.token,
        authorization = util.format('%s: %s', username, token);

    headers = {
        'Authorization': 'Basic ' + new Buffer(authorization).toString('base64'),
        'Content-Type': 'application/json'
    };
    var _path = auth;
    _post(_path, params, function (response) {
        var data = JSON.parse(response);
        callback(data);
    });
  }
};

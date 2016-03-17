var _ = require('underscore'),
    moment = require('moment'),
    async = require('async'),
    sleep = require('sleep');

var https = require('https'),
    util = require('util');

var BigCommerce = function(opt) {
  var username = opt.username,
      host = opt.host,
      token = opt.token;

  var authorization = util.format('%s: %s', username, token);

  var headers = {
    'Authorization': 'Basic ' + new Buffer(authorization).toString('base64'),
    'Content-Type': 'application/json'
  };

  var _get = function(path, callback) {
    var options = {
      host: host,
      path: path,
      method: 'GET',
      headers: headers
    };

    var req = https.request(options, function(response) {
      var str = '';
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
      console.log(err);
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
    });

    req.write(JSON.stringify(params));
    req.end();
  };

  var _delete = function(path, callback) {
    var options = {
      host: host,
      path: path,
      method: 'DELETE',
      headers: headers
    };

    var req = https.request(options, function(response) {
      var str = '';
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
      console.log(err);
    });

    req.end();
  }

  return {
    Address: {
      create: function(customerId, address, callback) {
        var _path = util.format('/api/v2/customers/%d/addresses.json', customerId);
        _post(_path, address, callback);
      }
    }, Country: {
      gets: function(callback) {
        var _path = '/api/v2/countries.json?limit=250';
        _get(_path, callback);
      },
      count : function(callback) {
        var _path = '/api/v2/countries/count.json?';
        _get(_path, callback);
      }
    }, Coupon: {
      gets: function(page, limit, callback) {
        var _path = util.format('/api/v2/coupons.json?limit=%d&page=%d', limit, page);
        _get(_path, callback);
      },
      count: function(callback) {
        var _path = '/api/v2/coupons/count.json';
        _get(_path, callback);
      },
      create: function(coupon, callback) {
        var _path = '/api/v2/coupons.json';
        _post(_path, coupon, callback);
      }
    }, Customer: {
      create: function(customer, callback) {
        var _path = '/api/v2/customers.json';
        _post(_path, customer, callback);
      },
      get: function(id, callback) {
        var _path = util.format('/api/v2/customers/%d.json', id);
        _get(_path, callback);
      },
      gets: function(page, limit, callback) {
        var _path = util.format('/api/v2/customers.json?limit=%d&page=%d', limit, page);
        _get(_path, callback);
      },
      count: function(callback) {
        var _path = '/api/v2/customers/count.json';
        _get(_path, callback);
      },
      delete: function(id, callback) {
        var _path = util.format('/api/v2/customers/%d.json', id);
        _delete(_path, callback);
      }
    }, Order: {
      create: function(order, callback) {
        var _path = '/api/v2/orders.json';
        _post(_path, order, callback);
      },
      delete: function(orderId, callback) {
        var _path = util.format('/api/v2/orders/%d.json', orderId);
        _delete(_path, callback);
      },
      gets: function(params, callback) {
        params.limit = 250;

        var p = [];
        _.each(params, function(param, idx) {
          p.push(idx + '=' + param);
        });

        var orders = [];
        var _gets = function(page) {
          var _p = p;
          _p.push('page=' + page);
          var _path = util.format('/api/v2/orders.json?%s', p.join('&'));  
          _get(_path, function(response) {
            var data = JSON.parse(response);
            _.each(data, function(order) {
              orders.push(order);
            });

            if (data.length == 250) {
              _gets(page+1);
            } else {
              callback(orders);
            }
          });
        };
        _gets(1);
      },
    }
  };
};

module.exports = BigCommerce;
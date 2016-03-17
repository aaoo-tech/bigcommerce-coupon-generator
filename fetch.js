var BigCommerce = require('../index.js');

var _ = require('underscore'),
    async = require('async'),
    util = require('util'),
    sprintf = require('sprintf'),
    sleep = require('sleep'),
    fs = require('fs');

var s = [];
for (var i = 0; i <= 999999; i++) {
  s[i] = i;
}

var codes = [];

for (var i = 0; i < 500; i++) {
  var idx = Math.floor(Math.random() * 1000000),
      code = sprintf('WELCOME-%06d', s[idx]);

  codes.push(code);

  if (idx == 0) { s[0] = s[1]; }
  s[idx] = s[idx-1];
}

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

console.log(stores[5]);
var bigCommerce = new BigCommerce(stores[5]);

async.waterfall([
  function(callback) {
    bigCommerce.Coupon.count(function(response) {
      response = JSON.parse(response);
      console.log(response.count);
      callback(null, response.count);
    });
  }, function(count, callback) {
    var i = 0, 
        page = 1,
        pages = [];

    while (i < count) {
      i += 250;
      pages.push(page);
      page ++;
    }

    var coupons = [];
    async.eachSeries(pages, function(page, _callback) {
      bigCommerce.Coupon.gets(page, 250, function(response) {
        response = JSON.parse(response);

        _.each(response, function(coupon) {
          coupons.push(coupon);
        });

        _callback();
      });
    }, function done() {
      callback(null, coupons);
    });


  }
], function(err, result) {
  fs.writeFileSync('ca.coupons.json', JSON.stringify(result));
});

// async.eachSeries(codes, function(code, callback) {
//   console.log(code);

//   bigCommerce.Coupon.create({
//     'name': 'Welcome 10% off ' + code,
//     'type': 'percentage_discount',
//     'code': code,
//     'amount': 10,
//     'enabled': true,
//     'applies_to': {
//       'entity': 'categories',
//       'ids': [0, 27]
//     },
//     'max_uses': 1
//   }, function(response) {
//     // console.log(response);
//     callback();
//   });
// });

// for (var i = 0; i < 100; i++) {
//   var code = codes[i];
//   console.log(code);

//   bigCommerce.Coupon.create({
//     'name': 'Customer Service 10% off',
//     'type': 'percentage_discount',
//     'code': code,
//     'amount': 10,
//     'enabled': true,
//     'applies_to': {
//       'entity': 'categories',
//       'ids': [0, 94]
//     },
//     'max_uses': 1
//   }, function(response) {
//     console.log(response);
//   });
//   break;
//   // sleep.sleep(5);
// }




// var idx = 0;
// _.each(stores, function(store) {
//   console.log(store);
//   var bigCommerce = new BigCommerce(store);

//   for (var i = 0; i < 100; i++) {
//     var code = codes[idx];
//     console.log(code);
//     bigCommerce.Coupon.create({
//       'name': 'Customer Service 10% off',
//       'type': 'percentage_discount',
//       'code': code,
//       'amount': 10,
//       'enabled': true,
//       'applies_to': {
//         'entity': 'categories',
//         'ids': [0, 94]
//       },
//     }, function(response) {
//       console.log(response);
//       console.log('complete');
//     });
//     idx ++;
//     sleep.sleep(5);
//   }
// });
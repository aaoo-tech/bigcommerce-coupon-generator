var _ = require('underscore'),
    sprintf = require('sprintf'),
    async = require('async'),
    sleep = require('sleep'),
    fs = require('fs');


var codes = [];

var coupons = JSON.parse(fs.readFileSync('us.coupons.json', 'utf-8'));
_.each(coupons, function(coupon) {
  var code = coupon.code;

  var tmp = code.split('-');
  if (tmp[0] == 'REVIEW') {
    console.log(code);
    codes.push(tmp[1]);
  }
});

coupons = JSON.parse(fs.readFileSync('uk.coupons.json', 'utf-8'));
_.each(coupons, function(coupon) {
  var code = coupon.code;

  var tmp = code.split('-');
  if (tmp[0] == 'REVIEW') {
    console.log(code);
    codes.push(tmp[1]);
  }
});

coupons = JSON.parse(fs.readFileSync('eu.coupons.json', 'utf-8'));
_.each(coupons, function(coupon) {
  var code = coupon.code;

  var tmp = code.split('-');
  if (tmp[0] == 'REVIEW') {
    console.log(code);
    codes.push(tmp[1]);
  }
});

coupons = JSON.parse(fs.readFileSync('hk.coupons.json', 'utf-8'));
_.each(coupons, function(coupon) {
  var code = coupon.code;

  var tmp = code.split('-');
  if (tmp[0] == 'REVIEW') {
    console.log(code);
    codes.push(tmp[1]);
  }
});

coupons = JSON.parse(fs.readFileSync('au.coupons.json', 'utf-8'));
_.each(coupons, function(coupon) {
  var code = coupon.code;

  var tmp = code.split('-');
  if (tmp[0] == 'REVIEW') {
    console.log(code);
    codes.push(tmp[1]);
  }
});

coupons = JSON.parse(fs.readFileSync('ca.coupons.json', 'utf-8'));
_.each(coupons, function(coupon) {
  var code = coupon.code;

  var tmp = code.split('-');
  if (tmp[0] == 'REVIEW') {
    console.log(code);
    codes.push(tmp[1]);
  }
});

console.log(codes.length);

var todos = [];
var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

for (var i = 0; i < 500; i++) {
  var idx = '';
  do {
    for (var j = 0; j < 6; j++) {
      idx += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  } while (_.indexOf(codes, idx) != -1);
  todos.push(idx);
}

// console.log(todos);

// var BigCommerce = require('../index.js');
// var stores = [
//   { // us
//     'username': 'ecif',
//     'host': 'www.nativeunion.com',
//     'token': '5c1c89d2039ff9f336fcef681d9f1b7af5203c8b',
//   },
//   { // uk
//     'username': 'ecif',
//     'host': 'www.nativeunion.co.uk',
//     'token': '9b01fb23c617895e04de95469d9b39efec7e9800',
//   },
//   { // eu
//     'username': 'ecif',
//     'host': 'www.nativeunion.eu',
//     'token': '4a62ba6b0a19558cbab5626205a733114955f605',
//   },
//   { // hk
//     'username': 'ecif',
//     'host': 'www.nativeunion.hk',
//     'token': '93e2e7a39a33ae5f4a4fd55fdc3f1cf50ab58e60',
//   },
//   { // au
//     'username': 'ecif',
//     'host': 'www.nativeunion.com.au',
//     'token': 'f40d63338108dd96ce44152387a47380574411ab',
//   },
//   { // ca
//     'username': 'ecif',
//     'host': 'www.nativeunion.ca',
//     'token': '1285895c41b5f41162d95d8627716813fcc5490b',
//   }
// ];

// var bigCommerce = new BigCommerce(stores[5]);
// var c = 0;
// async.eachSeries(todos, function(todo, callback) {
//   c++;
//   console.log(c);

//   sleep.sleep(3);
//   var code = 'REVIEW-' + todo;
//   console.log(code);
  
//   bigCommerce.Coupon.create({
//     'name': 'Reviews 10% Off (' + todo + ')',
//     'type': 'percentage_discount',
//     'code': code,
//     'amount': 10,
//     'enabled': true,
//     'applies_to': {
//       'entity': 'categories',
//       'ids': [0]
//     },
//     'max_uses': 1
//   }, function(response) {
//     console.log(response);
//     callback();
//   });
// });
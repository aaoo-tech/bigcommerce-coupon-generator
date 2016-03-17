        async.waterfall([
            function(cb) {
                Tasks.find({ 
                    where: { status: 1 },
                    // is_upload: 0,
                    sort: 'id ASC'
                }).then(function (tasks) {//get task
                    async.eachSeries(tasks, function(_task, _task_callback) {
                        Website.findOne({
                            task_id: _task.id
                        }).then(function (websites){//get coupons
                            _task.coupons.push(websites.coupon);
                            _task_callback();
                        }).catch(function (err){

                        });
                    },function done(){
                        console.log('Get tasks !');
                        cb(null, tasks);
                    });
                    // console.log(tasks);
                }).catch(function (err) {

                });
            },
            function(task_list, cb){
                async.eachSeries(task_list, function (_task, _task_callback){
                    Tasks.update({
                        id: _task.id
                    },{
                        status: 2
                    }).then(function(updated) {
                        console.log(updated);
                    }).catch(function(err) {
                        console.log(err);
                    });
                    CsvService._read(_task.csv_filename, function(codes) {
                        var repeat_code = [];
                        if(_task.is_upload == 0){//is not upload
                            async.eachSeries(codes, function(_code, _code_callback){
                                var evens = _.where(_task.coupons, _code);
                                if(_.size(evens) > 0){
                                    repeat_code.push(_code);
                                    _code_callback();
                                }else{
                                    _task.coupons.push(_code);
                                    BigCommerceService.create({//create bigcommerce coupons
                                        username: _task.username,
                                        host: _task.url,
                                        token: _task.token
                                    }, {
                                        'name': _task._rules.coupon_name,
                                        'type': _task._rules.type,
                                        'code': _code.code,
                                        'amount': 10,
                                        'enabled': true,
                                        'applies_to': {
                                            'entity': 'categories',
                                            'ids': [0, 94]
                                        },
                                        'max_uses': _task._rules.max_uses,
                                        'num_uses' _task._rules.num_uses,
                                    }, function (response){
                                        console.log(response.id + 'is created coupon');
                                        _code_callback();
                                    });
                                }
                            }, function done (){
                                _task._rules.number = repeat_code.length;
                                if(repeat_code.length > 0){
                                    CouponService.generate(_task._rules, _task.coupons, function(coupon_codes) {
                                        async.eachSeries(coupon_codes.data, function(_coupon_code, _coupon_code_callback){
                                            BigCommerceService.create({
                                                username: _task.username,
                                                host: _task.url,
                                                token: _task.token
                                            }, {
                                                'name': 'Customer Service 10% off',
                                                'type': 'percentage_discount',
                                                'code': _coupon_code.code,
                                                'amount': 10,
                                                'enabled': true,
                                                'applies_to': {
                                                    'entity': 'categories',
                                                    'ids': [0, 94]
                                                },
                                            }, function (response){
                                                coupon_code_callback();
                                                console.log(response.id + 'is created coupon repeat');
                                            });
                                        }, function done (){
                                            Tasks.update({
                                                id: _task.id
                                            },{
                                                status: 3
                                            }).then(function(updated) {
                                                console.log(updated);
                                                _task_callback();
                                            }).catch(function(err) {
                                                console.log(err);
                                            });
                                            cb(null);
                                        });
                                    });
                                }else{
                                    Tasks.update({
                                        id: _task.id
                                    },{
                                        status: 3
                                    }).then(function(updated) {
                                        _task_callback();
                                        console.log(updated);
                                    }).catch(function(err) {
                                        console.log(err);
                                    });
                                    cb(null);
                                }
                            });
                        }else{//is upload
                            async.eachSeries(codes, function(_code, _code_callback){
                                var evens = _.where(_task.coupons, _code);
                                if(_.size(evens) > 0){
                                    repeat_code.push(_code);
                                    _code_callback();
                                }else{
                                    BigCommerceService.create({
                                        username: _task.username,
                                        host: _task.url,
                                        token: _task.token
                                    }, {
                                        'name': 'Customer Service 10% off',
                                        'type': 'percentage_discount',
                                        'code': code,
                                        'amount': 10,
                                        'enabled': true,
                                        'applies_to': {
                                            'entity': 'categories',
                                            'ids': [0, 94]
                                        },
                                    }, function (response){
                                        console.log(response.id + 'is created coupon is upload');
                                        _code_callback();
                                    });
                                }
                            }, function done (){
                                Tasks.update({
                                    id: _task.id
                                },{
                                    status: 3
                                }).then(function(updated) {
                                    _task_callback();
                                    console.log(updated);
                                }).catch(function(err) {
                                    console.log(err);
                                });
                                console.log('is repeat' + repeat_code.length);
                                cb(null);
                            });
                        }
                    });
                },function done () {
                    console.log('123456 ... done');
                });
            }
        ], function (err){
            console.log(err);
        });
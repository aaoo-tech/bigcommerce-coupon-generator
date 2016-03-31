(function($) {
  $(function() {
    $('select').customSelect();


    var showLoading = function(){
        $('body').append("<div id='loading'><div><ul><li></li><li></li><li></li><li></li></ul><ul><li></li><li></li><li></li><li></li></ul></div></div>");
    };
    var closeLoading = function(){
        $("#loading").remove();
    };
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g,
    };
    var valid_params = function (params,rules){

    }
    // express form
    $('body').on('click', '.quick .submit', function (event) {
        var $form = $(event.target).closest('form'),
            _data = $form.serializeObject();
        $.ajax({
            url: './coupon/express',
            data: _data,
            type: 'POST',
            beforeSend: function(xhr) {
                if (_data.number.match(/^[1-9]\d*$/g) == null) {
                    $('.quick form input[type="number"]').addClass('error');
                    return false;
                }else{
                    $('.advanced form input[name="number"]').removeClass('error');
                }
                showLoading();
            }
        }).done(function (response){
            closeLoading();
            if (response.success == true) {
                Lobibox.alert('success', {
                    msg: 'Your coupon codes are successfully generated.',
                    beforeClose: function($this) {
                        $(".upload .tips a").attr('href', "./coupon/download?filename=" + response.data.filename);
                        $('section.quick').removeClass('active');
                        $('section.upload').addClass('active');
                    }
                });
            } else {
                Lobibox.alert('error', {
                    msg: response.message
                })
            }
        });

        return false;
    });

    // advanced form
    $('body').on('click', '.advanced .submit', function (event){
        var $form = $(event.target).closest('form'),
            _data = $form.serializeObject();
            _data.day = ""+parseInt(_data.day),
            _data.month = ""+parseInt(_data.month);
            console.log(_data);
            if(_data.day != '' || _data.month != '' || _data.year != ''){
                if(_data.day.match(/^[1-9]\d*$/g) == null || _data.day > (new Date(_data.year,_data.month,0)).getDate() || _data.month.match(/^[1-9]\d*$/g) == null || _data.month > 12 || _data.year.match(/^[1-9]\d*$/g) == null || _data.year < (new Date()).getFullYear()){
                    $('.expiry-date input').addClass('error');
                    Lobibox.alert('error', {
                        msg: 'Please fill in the date according to the specification.'
                    });
                    return false;
                }else{
                    $('.expiry-date input').removeClass('error');
                    _data.expiry_date = _data.year + '-' + _data.month + '-' + _data.date;
                }
            }
        $.ajax({
            url: './coupon/advanced',
            data: _data,
            type: 'POST',
            beforeSend: function(xhr) {
                if (_data.number.match(/^[1-9]\d*$/g) == null) {
                    $('.advanced form input[name="number"]').addClass('error');
                }else{
                    $('.advanced form input[name="number"]').removeClass('error');
                }
                if (_data.coupon_name.match(/^.*[^ ].*$/g) == null) {
                    $('.advanced form input[name="coupon_name"]').addClass('error');
                }else{
                    $('.advanced form input[name="coupon_name"]').removeClass('error');
                }
                if(_data.number.match(/^[1-9]\d*$/g) == null || _data.coupon_name.match(/^.*[^ ].*$/g) == null){
                    return false;
                }
                showLoading();
            }
        }).done(function (response) {
            closeLoading();
            if (response.success == true) {
                Lobibox.alert('success', {
                    msg: 'Your coupon codes are successfully generated.',
                    beforeClose: function($this) {
                        $(".upload .tips a").attr('href', "./coupon/download?filename=" + response.data.filename);
                        $('section.advanced').removeClass('active');
                        $('section.upload').addClass('active');
                    }
                });
            } else {
                Lobibox.alert('error', {
                    msg: response.message
                });
            }
        });
        return false;
    });

    // submit website information
    $('body').on('click', '.upload .submit', function (event){
        $form = $(event.target).closest('form');
        var _data = $form.serializeObject();
        
        Lobibox.alert('info', {
            msg: 'It will take some time for us to validate your API token and fetch coupons\' and categories\' information.',
            beforeClose: function($this) {
                $.ajax({
                    url: './task/create',
                    data: _data,
                    type: 'POST',
                    beforeSend: function(xhr) {
                        if(_data.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) == null){
                            $('.upload form input[name="email"]').addClass('error');
                            // return false;
                        }else{
                            $('.upload form input[name="email"]').removeClass('error');
                        }
                        if(_data.url.match(/^([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/g) == null){
                            $('.upload form input[name="url"]').addClass('error');
                            // return false;
                        }else{
                            $('.upload form input[name="url"]').removeClass('error');
                        }
                        if(_data.username.match(/^.*[^ ].*$/g) == null){
                            $('.upload form input[name="username"]').addClass('error');
                            // return false;
                        }else{
                            $('.upload form input[name="username"]').removeClass('error');
                        }
                        if(_data.token.match(/^.*[^ ].*$/g) == null){
                            $('.upload form input[name="token"]').addClass('error');
                            // return false;
                        }else{
                            $('.upload form input[name="token"]').removeClass('error');
                        }
                        if(_data.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) == null || _data.url.match(/^([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/g) == null || _data.username.match(/^.*[^ ].*$/g) == null || _data.token.match(/^.*[^ ].*$/g) == null){
                            return false;
                        }
                        showLoading();
                    }
                }).done(function (response) {
                    closeLoading();
                    if (response.success == true) {
                        Lobibox.alert('success', {
                            msg: 'Information has been correctly fetched.',
                            beforeClose: function($this) {
                                $('.confirmation .placeholder').html(
                                    _.template($('#tpl-confirmation').html())(response.data)
                                );
                                
                                $('section.upload').removeClass('active');
                                $('section.confirmation').addClass('active');
                            }
                        });
                    } else {
                        Lobibox.alert('error', {
                            msg: response.message
                        });
                    }
                });
            }
        });
        return false;
    });

    // create task with website info
    $('body').on('click', '.confirmation .submit', function (event){
        $form = $(event.target).closest('form');
        var _data = $form.serializeObject();

        $.ajax({
            url: './task/confirm',
            data: _data,
            type: 'POST',
            beforeSend: function() { showLoading(); }
        }).done(function (response) {
            closeLoading();
            if (response.success == true) {
                Lobibox.alert('success', {
                    msg: 'Your task has been confirmed and will receive a confirmation email shortly.',
                    beforeClose: function($this) {
                        $('section.confirmation').removeClass('active');
                        $('section.successful').addClass('active');
                    }
                });
            } else {
                Lobibox.alert('error', {
                    msg: response.message
                });
            }
        });
        return false;
    });

    // $('body').on('click', '.btn-upload', function (event){
    //     // $form = $(event.target).closest('form');
    //     // var _data = $form.serializeObject();
    //     console.log($(".csv_file").val());
    //     $.ajax({
    //         url: '/coupon/upload',
    //         data: $(".csv_file").val(),
    //         type: 'POST',
    //         enctype: 'multipart/form-data',
    //         beforeSend: function() {
    //             // console.log('va');
    //         }
    //     }).done(function (response){
    //         console.log(response);
    //         alert('Done!');
    //     });
    //     return false;
    // });

    // preset
    var generate_coupon = function(set_id, prefix, suffix, len) {
        var charsets = [
            '0123456789',
            'abcdefghijqlmnopqrstuvwxyz',
            'ABCDEFGHIJQLMNOPQRSTUVWXYZ',
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJQLMNOPQRSTUVWXYZ0123456789'
        ];

        var text = '';
        for (var i = 0; i < len; i++) {
            text += charsets[set_id].charAt(Math.floor(Math.random() * charsets[set_id].length));
        }

        return prefix + text + suffix;
    };

    var refresh_coupon = function() {
        var set_id = $('#select-hash-type').val(),
            len = $('#ipt-len').val(),
            prefix = $('#ipt-prefix').val(),
            suffix = $('#ipt-suffix').val();

        $('.preview p').html(generate_coupon(set_id, prefix, suffix, len));
    };

    $('body').on('change', '.advanced .prefix input', refresh_coupon);
    $('body').on('change', '.advanced .lan input', refresh_coupon);
    $('body').on('change', '.advanced .type select', refresh_coupon);
    $('body').on('change', '.advanced .sufix input', refresh_coupon);

    refresh_coupon();
    
    // upload
    $('a.show-upload').click(function(){
        $('.hide').slideToggle(500);
        return false;
    });


    Dropzone.autoDiscover = false;
    $('.dropzone').dropzone({
        maxFilesize: 512,
        acceptedFiles: ".csv,.txt,.doc,.docx,.xls",
        paramName: "csv_file",
        maxFiles: 1,
        //addRemoveLinks: true,
        init: function() {
            this.on("success", function(file, res) {
                if(res.success === true){
                    $(".upload .tips a").attr('href', "./coupon/download?filename=" + res.data.filename);
                    $('.dropzone').css('background', '#40d498');
                    var para=document.createElement("p");
                    var node=document.createTextNode("The file has been uploaded !");
                    para.appendChild(node);
                    file.previewTemplate.appendChild(para);
                    setTimeout("$('section.quick').removeClass('active');$('section.advanced').removeClass('active');$('section.upload').addClass('active');",2000);
                }else{
                    $('.dropzone').css('background', '#F3FF93');
                    var para=document.createElement("p");
                    var node=document.createTextNode("The file has been uploaded, CSV files must be filled in according to the specified field !");
                    para.appendChild(node);
                    file.previewTemplate.appendChild(para);
                }
            })
        }
    });

    // express and advanced switch
    $('body').on('click','.quick .form .change a',function(){
        $('section.quick').removeClass('active');
        $('section.advanced').addClass('active');
        // $('section.advanced select').customSelect();
        return false;
    });
    $('body').on('click','.advanced .form .change a',function(){
        $('section.advanced').removeClass('active');
        $('section.quick').addClass('active');
        return false;
    });
    
    // customize select look and feel
    // $('section.quick select').customSelect();

  });
})(jQuery);

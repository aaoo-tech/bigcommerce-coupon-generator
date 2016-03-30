(function($) {
  $(function() {
    $('select').selectmenu();
    $('input.date').datepicker({
        minDate: 0,
        dateFormat: 'mm-dd-yy',
        changeYear: true,
        changeMonth: true,
    });
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g,
    };

    // express form
    $('body').on('click', '.quick .submit', function (event) {
        var $form = $(event.target).closest('form'),
            _data = $form.serializeObject();
        // $.fancybox.showLoading();
        $.ajax({
            url: '/coupon/express',
            data: _data,
            type: 'POST',
            beforeSend: function(xhr) {
                if (_data.number == '') {
                    $('.quick form input[type="number"]').addClass('error');
                    // Lobibox.alert('error', {
                    //     msg: 'The number is required.'
                    // });
                    return false;
                }
            }
        }).done(function (response){
            // $.fancybox.hideLoading(); 
            if (response.success == true) {
                Lobibox.alert('success', {
                    msg: 'Your coupon codes are successfully generated.',
                    beforeClose: function($this) {
                        $(".upload .tips a").attr('href', "/coupon/download?filename=" + response.data.filename);
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
        $.ajax({
            url: '/coupon/advanced',
            data: _data,
            type: 'POST',
            beforeSend: function(xhr) {
                if (_data.number == '') {
                    $('.advanced form input[name="number"]').addClass('error');
                    // Lobibox.alert('error', {
                    //     msg: 'The number is required.'
                    // });
                    return false;
                }
                if (_data.coupon_name == '') {
                    $('.advanced form input[name="coupon_name"]').addClass('error');
                    // Lobibox.alert('error', {
                    //     msg: 'The coupon name is required.'
                    // });
                    return false;
                }
            }
            // beforeSend: function() { $.fancybox.showLoading(); }
        }).done(function (response) {
            $.fancybox.hideLoading(); 
            if (response.success == true) {
                Lobibox.alert('success', {
                    msg: 'Your coupon codes are successfully generated.',
                    beforeClose: function($this) {
                        $(".upload .tips a").attr('href', "/coupon/download?filename=" + response.data.filename);
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
                    url: '/task/create',
                    data: _data,
                    type: 'POST',
                    beforeSend: function(xhr) {
                        if(_data.email == ''){
                            $('.upload form input[name="email"]').addClass('error');
                            return false;
                        }
                        if(_data.url == ''){
                            $('.upload form input[name="url"]').addClass('error');
                            return false;
                        }
                        if(_data.username == ''){
                            $('.upload form input[name="username"]').addClass('error');
                            return false;
                        }
                        if(_data.token == ''){
                            $('.upload form input[name="token"]').addClass('error');
                            return false;
                        }
                    }
                }).done(function (response) {
                    $.fancybox.hideLoading();
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
            url: '/task/confirm',
            data: _data,
            type: 'POST',
            // beforeSend: function() { $.fancybox.showLoading(); }
        }).done(function (response) {
            $.fancybox.hideLoading();
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
                    $(".upload .tips a").attr('href', "/coupon/download?filename=" + res.data.filename);
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
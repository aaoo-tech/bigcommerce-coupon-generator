(function($) {
  $(function() {

    //
    $('body').on('click', '.quick .submit', function (event){
        $form = $(event.target).closest('form');
        var _data = $form.serializeObject();
        console.log(_data);
        $.ajax({
            url: '/coupon/express',
            data: _data,
            type: 'POST',
            beforeSend: function() {
                // console.log('va');
            }
        }).done(function (response){
            alert('Done!');
            console.log(response);
            $(".upload .tips a").attr('href', "/coupon/download?filename=" + response.data.filename);
            $('section.quick').removeClass('active');
            $('section.upload').addClass('active');
        });
        return false;
    });

    $('body').on('click', '.advanced .submit', function (event){
        $form = $(event.target).closest('form');
        var _data = $form.serializeObject();
        console.log(_data);
        $.ajax({
            url: '/coupon/advanced',
            data: _data,
            type: 'POST',
            beforeSend: function() {
                // console.log('va');
            }
        }).done(function (response){
            alert('Done!');
            console.log(response);
            $(".upload .tips a").attr('href', "/coupon/download?filename=" + response.data.filename);
            $('section.advanced').removeClass('active');
            $('section.upload').addClass('active');
        });
        return false;
    });

    $('body').on('click', '.upload .submit', function (event){
        $form = $(event.target).closest('form');
        var _data = $form.serializeObject();
        console.log(_data);
        $.ajax({
            url: '/task/create',
            data: _data,
            type: 'POST',
            beforeSend: function() {
                // console.log('va');
            }
        }).done(function (response){
            alert('Done!');
            console.log(response);
            $('.confirmation .text').html('<h2>Summary</h2><p><a href="">'+ response.data.had_codes +'</a> exsiting coupon codes are found.<br/>There are <a href="">'+ response.data.repeat_code +'</a> coupon codes duplicated. If you have used our coupon generator another <a href="">'+ response.data.another_code +'</a> valid coupons will bere-generated.Otherwise,we will skip duplicated ones anyway.</p><p><a href="">'+ response.data.category_len +'</a> categories are found as following:<br/>( Please leave them unchecked if you do not want to add any category restrictions.)</p>');
            for (var i = 0; i < response.data.categories.length; i++) {
                $('.confirmation .form form .checkbox').append('<input type="checkbox" name="category-'+ response.data.categories[i].id +'" value="' + response.data.categories[i].id + '" /><label>' + response.data.categories[i].name + '</label>');
            }
            $('section.upload').removeClass('active');
            $('section.confirmation').addClass('active');
        });
        return false;
    });

    $('body').on('click', '.confirmation .submit', function (event){
        $form = $(event.target).closest('form');
        var _data = $form.serializeObject();
        console.log(_data);
        $.ajax({
            url: '/task/confirm',
            data: _data,
            type: 'POST',
            beforeSend: function() {
                // console.log('va');
            }
        }).done(function (response){
            alert('Done!');
            console.log(response);
            // $('section.upload').removeClass('active');
            // $('section.confirmation').addClass('active');
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

    var prevset=["","6",0,""];
    $('body').on('change','.advanced .prefix input',function(){
        prevset[0]=$(this).val();
        prev();
    });
    $('body').on('change','.advanced .lan input',function(){
        prevset[1]=$(this).val();
        if ($(this).val()<6||$(this).val()>20) {
            alert("Please set the 'Lan' greater than 6 and less than 20.");
        };
        prev();
    });
    $('body').on('change','.advanced .type select',function(){
        prevset[2]=$(this).find('option:selected').index();
        prev();
    });
    $('body').on('change','.advanced .sufix input',function(){
        prevset[3]=$(this).val();
        prev();
    });

    
    var prev=function(){

        var number=parseInt(prevset[1]);
        var type=[  "90987461687315498651",
                    "fbhyapuapaswdbuheloi",
                    "JQWTIZXCG7QWEOIHAOSQ",
                    "a6s4d9d7zsa1c6as874f",
                    "JP2B46EVS6I76T6S2X4H",
                    "JVyluBvMasPaisdIaBvI",
                    "4OFQWRac3fh7aK75ASzx" ];
        var type_text=type[prevset[2]]
        var text=type_text.substr(20-number);
        $('.preview p').html(""+prevset[0]+text+prevset[3]);
    };

    prev();

    $('.tip a').click(function(){
        $('.hide').slideDown(500);
        return false;
    });


    Dropzone.autoDiscover = false;
    $('.dropzone').dropzone({
        maxFilesize: 512,
        acceptedFiles: ".csv",
        paramName: "csv_file",
        //addRemoveLinks: true,
        init: function() {
            this.on("success", function(file) {
                var para=document.createElement("p");
                var node=document.createTextNode("OK!");
                para.appendChild(node);
                file.previewTemplate.appendChild(para);
            })
        }
    });

    $('body').on('click','.quick .form .change a',function(){
        $('section.quick').removeClass('active');
        $('section.advanced').addClass('active');
        return false;
    });
    $('body').on('click','.advanced .form .change a',function(){
        $('section.advanced').removeClass('active');
        $('section.quick').addClass('active');
        return false;
    });
    // $('body').on('click','section .form .submit a',function(){

    // });

  });
})(jQuery);
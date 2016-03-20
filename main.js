(function($) {
  $(function() {

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
        acceptedFiles: ".xlsm",
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
    $('body').on('click','section .form .submit a',function(){

    });

    // customize selector
    $('select').customSelect();

  });
})(jQuery);
// (function($) {
//     $(function() {
//         $('body').on('click', '.btn-set .btn-action', function (event){
//             $form = $(event.target).closest('form');
//             var _data = $form.serializeObject();
//             console.log(_data);
//             $.ajax({
//                 url: '/coupon/advanced',
//                 data: _data,
//                 type: 'POST',
//                 beforeSend: function() {
//                     console.log('va');
//                 }
//             }).done(function (response){
//                 alert('Done!');
//                 console.log(response);
//             });
//         });
//     });
// })(jQuery);
"use strict";

$(document).ready(function(){
    $("#form").validate({

       rules:{
            name:{
                required: true,
                minlength: 3,
                maxlength: 16,
            },
            secondname:{
                required: true,
                minlength: 3,
                maxlength: 16,
            },
            email:{
               required: true,
               email:true,
            },
            gender:{
                required: true,
            },
            pass:{
              minlength: 6,
              required: true,
            },
           agreement:{
              required: true,
            },
       },
      highlight: function(element) {
             $(element).closest('.input-group').addClass('has-error');
         },
      unhighlight: function(element) {
             $(element).closest('.input-group').removeClass('has-error');
         },
      errorElement: 'span',
      errorClass: 'help-block',
      errorPlacement: function(error, element) {
             if(element.parent('.input-group').length) {
                 error.insertAfter(element.parent());
             } else {
                 error.insertAfter(element.parent());
             }
         },
    });
    });

    function submitForm() {
     	var msg = $('#form').serialize();
            $.ajax({
              type: 'POST',
              url: 'http://codeit.pro/frontTestTask/user/registration',
              data: msg,
    		  success: function(data) {
    			alert(data.message);
    			if(data.status == "OK"){window.location.replace("companies.html");}
    			$.getJSON('http://codeit.pro/frontTestTask/user/registration', function(data) {
    		  });
              },
              error:  function(){
    			alert('Error');
              }
            });
    }

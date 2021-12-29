$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
    $(this).remove();
    });
    }
    });

    $(document).ready(function(){
        $('.header').height($(window).height());
    })

    $('.navbar-nav>li>a').on('click', function(){
        $('.navbar-collapse').collapse('hide');
    });


$('.contact1-form-btn').click(function() {
    $.ajax({
        url: "php/mail.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val(),

        },
        success: function(result) {
            console.log(result);
        },
    });
});
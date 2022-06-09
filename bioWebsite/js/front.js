$(function () {


    // ---------------------------------------------- //
    // Scroll Spy
    // ---------------------------------------------- //

    $('body').scrollspy({
        target: '.navbar',
        offset: 80
    });

    // ---------------------------------------------- //
    // Preventing URL update on navigation link click
    // ---------------------------------------------- //

    $('.navbar-nav a, #scroll-down').bind('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 1000);
        e.preventDefault();
    });

    $('#contact-form').submit(function() {
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
                $('#name').val('');
                $('#email').val('');
                $('#message').val('');
                $('#confirm').text(result.message);
                $('#confirmation').modal('show');
            },
            error: function(err) {
                console.log(err);
            }
        });
        return false;
    });

    $('.close').click(function() {
        $('#confirmation').modal('hide');
    });

    $('.loader').hide();
});
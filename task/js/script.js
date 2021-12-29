// changing given number to HH:MM format

function numToTime (number) {
    const inMinutes = number * 60;
    const minutesLeft = inMinutes % 60;
    const hoursCount = (inMinutes - minutesLeft) / 60;
    let hours;
    let minutes;
    if (hoursCount < 10) {
        hours = '0' + hoursCount;
    } else {
        hours = hoursCount;
    } 
    if (minutesLeft > 0) {
        minutes = minutesLeft;
    } else {
        minutes = minutesLeft + '0';
    }
    return hours + ':' + minutes;
}

//ajax

$('#btn1').click(function() {
    $.ajax({
        url: "php/geoCodeAddress.php",
        type: 'POST',
        dataType: 'json',
        data: {
            Query: encodeURIComponent($('#query').val()),

        },
        success: function(result) {
            console.log(JSON.stringify(result));
            if (result.status.name == "ok") {

                $('#res1').html("Latitude: " + result['data']['lat']);
                $('#res2').html("Longitude: " + result['data']['lng']);
                $('#res3').html("Country code: " + result['data']['countryCode']);
                $('#res4').html("");
                $('#res5').html("");
                $('#res6').html("");

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            $('#res1').html(errorThrown);
            $('#res2').html('Supported countries and regions: Austria, Australia, Åland, Cocos, Switzerland, ' + 
            'Christmas Island, Czechia, Denmark, Estonia, Spain, Finland, France, French Guiana, Guadeloupe, Iceland, Luxembourg, Martinique, Norfolk Island, ' + 
            'Netherlands, Norway, Poland, Puerto Rico, Réunion, Singapore, Slovenia, Svalbard and Jan Mayen, Slovakia, United States, Mayotte.');
            $('#res3').html("");
            $('#res4').html("");
            $('#res5').html("");
            $('#res6').html("");
            
        }
    });
});

$('#btn2').click(function() {
    $.ajax({
        url: "php/timezone.php",
        type: 'POST',
        dataType: 'json',
        data: {
            Latitude: $('#Latitude').val(),
            Longitude: $('#Longitude').val()

        },
        success: function(result) {
            console.log(JSON.stringify(result));
            if (result.status.name == "ok") {

                if ('status' in result['data']) {

                    $('#res1').html(result['data']['status']['message']);
                    $('#res2').html("");
                    $('#res3').html("");
                    $('#res4').html("");
                    $('#res5').html("");
                    $('#res6').html("");
    

                } else {
                    
                    const stTime = result['data']['rawOffset'];
                    const timezoneId = result['data']['timezoneId'];
                    const countryName = result['data']['countryName'];
                    const localTime = result['data']['time'];
                    const sunrise = result['data']['sunrise'];
                    const sunset = result['data']['sunset'];

                    $('#res1').html('Standard time: UTC+' + ((result['data'].hasOwnProperty('rawOffset')) ? numToTime(stTime) : "no data"));
                    $('#res2').html('Timezone ID: ' + ((result['data'].hasOwnProperty('timezoneId')) ? timezoneId : "no data"));
                    $('#res3').html('Country name: ' + ((result['data'].hasOwnProperty('countryName')) ? countryName : "no data"));
                    $('#res4').html('Local time: ' + ((result['data'].hasOwnProperty('time')) ? localTime : "no data"));
                    $('#res5').html('Sunrise: ' + ((result['data'].hasOwnProperty('sunrise')) ? sunrise : "no data"));
                    $('#res6').html('Sunset: ' + ((result['data'].hasOwnProperty('sunset')) ? sunset : "no data"));
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            $('#res1').html('Something went wrong');
            $('#res2').html(errorThrown);
            $('#res3').html("");
            $('#res4').html("");
            $('#res5').html("");
            $('#res6').html("");
        }
    });
});

$('#btn3').click(function() {
    $.ajax({
        url: "php/address.php",
        type: 'POST',
        dataType: 'json',
        data: {
            Latitude: $('#ALatitude').val(),
            Longitude: $('#ALongitude').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                if ('status' in result['data']) {

                    $('#res1').html(result['data']['status']['message']);
                    $('#res2').html("");
                    $('#res3').html("");
                    $('#res4').html("");
                    $('#res5').html("");
                    $('#res6').html("");
    

                } else {

                    if (result['data'].hasOwnProperty('address')) {

                        const street = result['data']['address']['street'];
                        const postal = result['data']['address']['postalcode'];
                        const locality = result['data']['address']['locality'];
                        const adminName1 = result['data']['address']['adminName1'];
                        const countryCode = result['data']['address']['countryCode'];

                        $('#res1').html('Street name: ' + ((street == '') ? 'no data' : street));
                        $('#res2').html('Postal code: ' + ((postal == '') ? 'no data' : postal));
                        $('#res3').html('Locality: ' + ((locality == '') ? 'no data' : locality));
                        $('#res4').html('Admin name: ' + ((adminName1 == '') ? 'no data' : adminName1));
                        $('#res5').html('Country code: ' + ((countryCode == '') ? 'no data' : countryCode));
                        $('#res6').html("");

                    } else {
                        $('#res1').html("No results found for a given lat/lng pair.");
                        $('#res2').html("");
                        $('#res3').html("");
                        $('#res4').html("");
                        $('#res5').html("");
                        $('#res6').html("");
                    } 
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown);
            $('#res1').html(errorThrown);
            $('#res2').html('');
            $('#res3').html("");
            $('#res4').html("");
            $('#res5').html("");
            $('#res6').html("");

        }
    });
});

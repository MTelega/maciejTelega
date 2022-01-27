$(function() {
  $.ajax({
      url: "php/countrySelector.php",
      type: 'GET',
      dataType: 'json',
      success: function(result) {

          if (result.status.name == "ok") {
            for(let i = 0; i < result.data.length; i++){
              $('#select').append(`<option value="${result.data[i].properties.iso_a2}">${result.data[i].properties.name}</option>`);
              var select = $('select');
              select.html(select.find('option').sort(function(x, y) {
                return $(x).text() > $(y).text() ? 1 : -1;
              }));
            };
             $('#select').prepend(`<option value="" selected>Select Country</option>`);
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(errorThrown);
          console.log(textStatus);      
      }
  });
});

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer.provider('Jawg.Streets', {
    variant: 'jawg-terrain',
    accessToken: '6oG0Hxo13keGOII2LHv78deYiRkASGVGTynxQ9fiKZRXiHRR6Xo9dWQXy7X1G0T8'
}).addTo(map);




var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer.provider('Jawg.Streets', {
    variant: 'jawg-terrain',
    accessToken: '6oG0Hxo13keGOII2LHv78deYiRkASGVGTynxQ9fiKZRXiHRR6Xo9dWQXy7X1G0T8'
}).addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

$('#select').click(function() {
  $.ajax({
      url: "../php/countrySelector.php",
      type: 'GET',
      dataType: 'json',
      success: function(result) {
          console.log(JSON.stringify(result));
          if (result.status.name == "ok") {
            $('#select').append(`<option value="${data.features.properties.iso_a2}">${data.features.properties.name}</option>`);
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(errorThrown);
          console.log(textStatus);      
      }
  });
});
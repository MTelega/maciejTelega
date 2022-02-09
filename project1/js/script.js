$( document ).ready(function() {
  $('#countryInfo').modal({show: false});
//select list 
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
             $('#select').prepend(`<option value="" selected disabled>Select Country</option>`);
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(errorThrown);
          console.log(textStatus);      
      }
  });
});

//map
var mapOptions = {
  zoom: 10,
  zoomControl: false
}

var map = L.map('map', mapOptions);

// zoom control options
var zoomOptions = {
  zoomInText: '+',
  zoomOutText: '-',
  position: 'bottomright'
};
// Creating zoom control
var zoom = L.control.zoom(zoomOptions);
zoom.addTo(map);

L.tileLayer.provider('Jawg.Streets', {
    variant: 'jawg-terrain',
    accessToken: '6oG0Hxo13keGOII2LHv78deYiRkASGVGTynxQ9fiKZRXiHRR6Xo9dWQXy7X1G0T8'
}).addTo(map);

let currentCountry;
var geoJsonCountry;

//country borders on start
navigator.geolocation.getCurrentPosition((position) => {
  $.ajax({
    url: "php/openCage.php",
    type: 'POST',
    dataType: 'json',
    data: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    },
    success: function(result) {
        if (result.status.name == "ok") {
          currentCountry = result['data']['country'];
          $.ajax({
            url: "php/openCageBounds.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: encodeURIComponent(result['data']['country']),
                countryCode: result['data']['ISO_3166-1_alpha-2']
            },
            success: function(result) {
                if (result.status.name == "ok") {
                  const northeast = [result['data']['northeast']['lat'], result['data']['northeast']['lng']],
                        southwest = [result['data']['southwest']['lat'], result['data']['southwest']['lng']];
                        map.fitBounds([northeast, southwest]);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(errorThrown, textStatus);
            }
        });
        $.ajax({
          url: "php/countrySelector.php",
          type: 'GET',
          dataType: 'json',
          success: function(result) {
              if (result.status.name == "ok") {
                for(let i = 0; i < result['data'].length; i++){
                  if(result['data'][i]['properties']['name'] == currentCountry){
                    geoJsonCountry = result['data'][i];
                    L.geoJson(geoJsonCountry).addTo(map);
                  }
                }
              }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              // your error code
              console.log(errorThrown);
              console.log(textStatus);      
          }
      });
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown, textStatus);
    }
});
});

$('#select').change(function() {
  L.geoJson().removeLayer(geoJsonCountry);
  var optionSelected = $(this).find("option:selected");
  var valueSelected  = optionSelected.val();
  var textSelected   = optionSelected.text();
  if(textSelected == 'Bosnia and Herz.'){
    textSelected = 'Bosnia and Herzegovina';
  } else if (textSelected == 'Central African Rep.'){
    textSelected = 'Central African Republic';
  } else if (textSelected == 'Dem. Rep. Korea') {
    textSelected = 'North Korea';
  } else if (textSelected == 'Eq. Guinea') {
    textSelected = 'Equatorial Guinea';
  } else if (textSelected == 'Lao PDR') {
    textSelected == 'Laos';
  } else if (textSelected == 'N. Cyprus') {
    textSelected = 'Cyprus';
  }

  $.ajax({
    url: "php/openCageBounds.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country:   encodeURIComponent(textSelected),
        countryCode: valueSelected
    },
    success: function(result) {
        if (result.status.name == "ok") {
          const northeast = [result['data']['northeast']['lat'], result['data']['northeast']['lng']],
                southwest = [result['data']['southwest']['lat'], result['data']['southwest']['lng']];
                map.fitBounds([northeast, southwest]);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown, textStatus);
    }
});

$.ajax({
  url: "php/countrySelector.php",
  type: 'GET',
  dataType: 'json',
  success: function(result) {
      if (result.status.name == "ok") {
        for(let i = 0; i < result['data'].length; i++){
          if(result['data'][i]['properties']['iso_a2'] == valueSelected){
            var geoJsonCountry = result['data'][i];
            L.geoJson(geoJsonCountry).addTo(map);
          }
        }
      }
  },
  error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);      
  }
});
//flag image
  const flagUrl = 'https://countryflagsapi.com/png/' + valueSelected;
  $('#flagImg').attr('src', flagUrl);
  $('#flagImg').attr('alt', textSelected + ' flag');

//demographic and geographic info
  $.ajax({
    url: "php/restCountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode:   valueSelected,
    },
    success: function(result) {
      if (result.status.name == "ok") {
      $('#official').html(result['data'][0]['name']['official']);
      $('#name').html(result['data'][0]['name']['common']);
      $('#name').html(result['data'][0]['name']['common']);
      $('#lang').html(Object.values(result['data'][0]['languages']).join(', '));
      $('#popul').html(result['data'][0]['population']);
      Object.keys(result['data'][0]["currencies"]).forEach(function(key) {
        $('#curr').html(result['data'][0]["currencies"][key].name + " " + result['data'][0]["currencies"][key].symbol);
      });
      $('#capital').html(result['data'][0]['capital']);
      $('#continent').html(result['data'][0]['continents']);
      $('#area').html(result['data'][0]['area']);
      $('#lat').html(result['data'][0]['latlng'][0]);
      $('#lng').html(result['data'][0]['latlng'][1]);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown, textStatus);
        console.warn(jqXHR.responseText)
    }
});
//modal on
  $('#countryInfo').modal('show');
});


});

$( document ).ready(function() {
  
  $('#countryInfo').modal({show: false});

  //map
const mapOptions = {
  zoom: 10,
  zoomControl: false,
  center: [51.5002, -0.126236]
}

const map = L.map('map', mapOptions);

const controlLoader = L.control.loader().addTo(map);
controlLoader.show();
// zoom control options
const zoomOptions = {
  zoomInText: '+',
  zoomOutText: '-',
  position: 'bottomright'
};
// Creating zoom control
const zoom = L.control.zoom(zoomOptions);
zoom.addTo(map);

L.tileLayer.provider('Jawg.Streets', {
    variant: 'jawg-terrain',
    accessToken: '6oG0Hxo13keGOII2LHv78deYiRkASGVGTynxQ9fiKZRXiHRR6Xo9dWQXy7X1G0T8'
}).addTo(map);

let currentCountry;
let geoJsonCountry;
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
              const select = $('select');
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
                    controlLoader.hide();
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
      //capital city marker
      $.ajax({
        url: "php/income.php",
        type: 'POST',
        dataType: 'json',
        data: {
          countryCode: result['data']['ISO_3166-1_alpha-2']
        },
        success: function(result) {
          if (result.status.name == "ok") {
            let marker = L.marker([result['data'][1][0]['latitude'], result['data'][1][0]['longitude']]).addTo(map);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown, textStatus);
            console.warn(jqXHR.responseText)
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

  let optionSelected = $(this).find("option:selected");
  let valueSelected  = optionSelected.val();
  let textSelected   = optionSelected.text();

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
  } else if (textSelected == 'W. Sahara') {
    textSelected = 'Western Sahara';
  } else if (textSelected == 'Czech Rep.') {
    textSelected = 'Czech Republic';
  } else if (textSelected == 'Dominican Rep.') {
    textSelected = 'Dominican Republic';
  }
  
  //bounds

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

        //earthquakes

        $.ajax({
          url: "php/earthquakes.php",
          type: 'POST',
          dataType: 'json',
          data: {
            north: result['data']['northeast']['lat'],
            south: result['data']['northeast']['lng'],
            east: result['data']['southwest']['lat'],
            west: result['data']['southwest']['lng']
          },
          success: function(result) {
            if (result.status.name == "ok") {
              if(result['data']['earthquakes'].length == 0){
                $('#earthquakes, #eq0, #eq1, #eq2, #eq3, #eq4').addClass('d-none');
                $('#noDataEarthquakes').removeClass('d-none');
              } else {
                $('#noDataEarthquakes').addClass('d-none');
                $('#eq0, #eq1, #eq2, #eq3, #eq4').addClass('d-none');
                $('#earthquakes').removeClass('d-none');
                for(let i = 0; i < result['data']['earthquakes'].length; i++) {
                  $('#eq' + i).removeClass('d-none');
                  $('#eDate' + i).html(result['data']['earthquakes'][i]['datetime']);
                  $('#mag' + i).html(result['data']['earthquakes'][i]['magnitude']);
                  $('#depth' + i).html(result['data']['earthquakes'][i]['depth']);
                  $('#eLat' + i).html(result['data']['earthquakes'][i]['lat']);
                  $('#eLng' + i).html(result['data']['earthquakes'][i]['lng']);
                }
              }
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown, textStatus);
          }
        }); 

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
            let geoJsonCountry = result['data'][i];
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
      $('#name, #countryInfoLabel').html(result['data'][0]['name']['common']);
      $('#lang').html(Object.values(result['data'][0]['languages']).join(', '));
      $('#popul').html(result['data'][0]['population']);
        let currenciesString = '';
      Object.keys(result['data'][0]['currencies']).forEach(function(key) {
          currenciesString += result['data'][0]['currencies'][key]['name'] + ' ' + result['data'][0]['currencies'][key]['symbol'] + ', ';
        });
      $('#curr').html(currenciesString.slice(0, -2));
      $('#capital').html(result['data'][0]['capital']);
      $('#continent').html(result['data'][0]['continents']);
      $('#area').html(result['data'][0]['area']);

//weather data

      $.ajax({
        url: "php/openWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
          lat: result['data'][0]['latlng'][0],
          lng: result['data'][0]['latlng'][1]
        },
        success: function(result) {
          if (result.status.name == "ok") {
            $('#description').html(result['data']['weather'][0]['description']);
            $('#temp').html(Math.round(result['data']['main']['temp'] * 10) / 10);
            $('#feelTemp').html(Math.round(result['data']['main']['feels_like'] * 10) / 10);
            $('#pressure').html(result['data']['main']['pressure']);
            $('#humid').html(result['data']['main']['humidity']);
            $('#wind').html(result['data']['wind']['speed']);
            $('#clouds').html(result['data']['clouds']['all']);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown, textStatus);
            console.warn(jqXHR.responseText)
        }
      }); 


      $.ajax({
        url: "php/airPollution.php",
        type: 'POST',
        dataType: 'json',
        data: {
          lat: result['data'][0]['latlng'][0],
          lng: result['data'][0]['latlng'][1]
        },
        success: function(result) {
          if (result.status.name == "ok") {
           const index = result['data']['list'][0]['main']['aqi'];
           if (index == 1) {
             $('#aqi').html('Good');
           } else if (index == 2) {
            $('#aqi').html('Fair');
           } else if (index == 3) {
            $('#aqi').html('Moderate');
           } else if (index == 4) {
            $('#aqi').html('Poor');
           } else if (index == 5) {
            $('#aqi').html('Very poor');
           } else {
            $('#aqi').html('No data found');
           }
           $('#co').html(result['data']['list'][0]['components']['co']);
           $('#no').html(result['data']['list'][0]['components']['no']);
           $('#no2').html(result['data']['list'][0]['components']['no2']);
           $('#o3').html(result['data']['list'][0]['components']['o3']);
           $('#so2').html(result['data']['list'][0]['components']['so2']);
           $('#pm25').html(result['data']['list'][0]['components']['pm2_5']);
           $('#pm10').html(result['data']['list'][0]['components']['pm10']);
           $('#nh3').html(result['data']['list'][0]['components']['nh3']);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown, textStatus);
            console.warn(jqXHR.responseText)
        }
      }); 

      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown, textStatus);
        console.warn(jqXHR.responseText)
    }
});

// News

$.ajax({
  url: "php/news.php",
  type: 'POST',
  dataType: 'json',
  data: {
    country: encodeURIComponent(textSelected),
  },
  success: function(result) {
    if (result.status.name == "ok") {
      $('#firstNewsTitle').html(result['data']['articles'][0]['title']);
      $('#secondNewsTitle').html(result['data']['articles'][1]['title']);
      $('#thirdNewsTitle').html(result['data']['articles'][2]['title']);

      $('#firstNewsImg').attr('src', result['data']['articles'][0]['urlToImage']);
      $('#secondNewsImg').attr('src', result['data']['articles'][1]['urlToImage']);
      $('#thirdNewsImg').attr('src', result['data']['articles'][2]['urlToImage']);

      $('#firstNews').attr('href', result['data']['articles'][0]['url']);
      $('#secondNews').attr('href', result['data']['articles'][1]['url']);
      $('#thirdNews').attr('href', result['data']['articles'][2]['url']);
    }
  },
  error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(errorThrown, textStatus);
      console.warn(jqXHR.responseText)
  }
}); 

//income and lat/lng of capital city

$.ajax({
  url: "php/income.php",
  type: 'POST',
  dataType: 'json',
  data: {
    countryCode: valueSelected,
  },
  success: function(result) {
    if (result.status.name == "ok") {
      $('#income').html(result['data'][1][0]['incomeLevel']['value']);
      $('#lat').html(result['data'][1][0]['latitude']);
      $('#lng').html(result['data'][1][0]['longitude']);
      let marker = L.marker([result['data'][1][0]['latitude'], result['data'][1][0]['longitude']]).addTo(map);
      }
  },
  error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(errorThrown, textStatus);
      console.warn(jqXHR.responseText)
  }
}); 

//wikipedia links

$.ajax({
  url: "php/geonamesWiki.php",
  type: 'POST',
  dataType: 'json',
  data: {
    country: encodeURIComponent(textSelected),
  },
  success: function(result) {
    console.log(result);
    if (result.status.name == "ok") {
      $('#wikiLinkOne').attr('href', 'https://' + result['data'][0]['wikipediaUrl']);
      $('#wikiLinkTwo').attr('href', 'https://' + result['data'][1]['wikipediaUrl']);
      $('#wikiLinkThree').attr('href', 'https://' + result['data'][2]['wikipediaUrl']);
      $('#wikiLinkOne').html(result['data'][0]['title']);
      $('#wikiLinkTwo').html(result['data'][1]['title']);
      $('#wikiLinkThree').html(result['data'][2]['title']);
    }
  },
  error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(errorThrown, textStatus);
      console.warn(jqXHR.responseText)
  }
}); 

//neighbours

$.ajax({
  url: "php/neighbours.php",
  type: 'POST',
  dataType: 'json',
  data: {
    countryCode: valueSelected,
  },
  success: function(result) {
    if (result.status.name == "ok") {
      if(result['data'].length == 0){
        $('#neighbours').html('');
        $('#noNeighbours').html('none');
      } else {
        $('#neighbours').html('');
        $('#noNeighbours').html('');
        for(let i = 0; i < result['data'].length; i++) {
          $('#neighbours').append('<li>' + result['data'][i]['name'] + '</li>');
        }
      }
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


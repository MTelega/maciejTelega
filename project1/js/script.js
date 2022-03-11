$( document ).ready(function() {

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
  zoomOutText: '-'
};
// Creating zoom control
const zoom = L.control.zoom(zoomOptions);
zoom.addTo(map);

L.tileLayer.provider('Jawg.Streets', {
    variant: 'jawg-terrain',
    accessToken: '6oG0Hxo13keGOII2LHv78deYiRkASGVGTynxQ9fiKZRXiHRR6Xo9dWQXy7X1G0T8'
}).addTo(map);

let countryCode;
let country;
let layer;
let ctlInfoButton;
let ctlWeatherButton;
let ctlEqButton;
let ctlNewsButton;
let ctlCityButton;
let ctlAirButton;
let ctlReserveButton;
let ctlAirportButton;

let citiesGroup = L.markerClusterGroup({
	iconCreateFunction: function(cluster) {
		return L.divIcon({ html: '<div class="cityCluster"><span>' + cluster.getChildCount() + '</span></div>' });
	}
});

let earthquakesGroup = L.markerClusterGroup({
	iconCreateFunction: function(cluster) {
		return L.divIcon({ html: '<div class="eqCluster"><span>' + cluster.getChildCount() + '</span></div>' });
	}
});

let reserveGroup = L.markerClusterGroup({
	iconCreateFunction: function(cluster) {
		return L.divIcon({ html: '<div class="resCluster"><span>' + cluster.getChildCount() + '</span></div>' });
	}
});

let airportGroup = L.markerClusterGroup({
	iconCreateFunction: function(cluster) {
		return L.divIcon({ html: '<div class="airportCluster"><span>' + cluster.getChildCount() + '</span></div>' });
	}
});

var eqMarker = L.ExtraMarkers.icon({
  icon: 'fa-house-crack',
  markerColor: 'red',
  shape: 'penta',
  prefix: 'fa'
});

var cityMarker = L.ExtraMarkers.icon({
  icon: 'fa-city',
  markerColor: 'orange',
  shape: 'star',
  prefix: 'fa'
});

var capCityMarker = L.ExtraMarkers.icon({
  icon: 'fa-star',
  markerColor: 'orange',
  shape: 'star',
  prefix: 'fa'
});

var reserveMarker = L.ExtraMarkers.icon({
  icon: 'fa-tree',
  markerColor: 'green',
  shape: 'circle',
  prefix: 'fa'
});

var airportMarker = L.ExtraMarkers.icon({
  icon: 'fa-plane',
  markerColor: 'purple',
  shape: 'square',
  prefix: 'fa'
});


//select list 
$(function() {
  $.ajax({
      url: "php/getCountrySelector.php",
      type: 'GET',
      dataType: 'json',
      success: function(result) {
          if (result.status.name == "ok") {
            for(let i = 0; i < result.data.length; i++){
              $('#select').append(`<option value="${result.data[i]['iso_a2']}">${result.data[i]['name']}</option>`);
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

// info function 

function getInfo(countryName, alphaCode) {

  country = encodeURIComponent(countryName);
  countryCode = alphaCode; 

  $.ajax({
    url: "php/getBounds.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country:   country,
        countryCode: countryCode
    },
    success: function(result) {
        if (result.status.name == "ok") {
          const northeast = [result['data']['northeast']['lat'], result['data']['northeast']['lng']],
                southwest = [result['data']['southwest']['lat'], result['data']['southwest']['lng']];
                map.fitBounds([northeast, southwest]);
                

          //earthquakes
  
          $.ajax({
            url: "php/getEarthquakes.php",
            type: 'POST',
            dataType: 'json',
            data: {
              north: result['data']['northeast']['lat'],
              south: result['data']['southwest']['lat'],
              east: result['data']['northeast']['lng'],
              west: result['data']['southwest']['lng']
            },
            success: function(result) {
              if (result.status.name == "ok") {
                if (result['data'].length >= 1){
                  result['data'].forEach( eq => {
                    earthquakesGroup.addLayer(L.marker([eq['lat'], eq['lng']], {icon: eqMarker}).bindPopup(`<span class="fw-bold">Earthquake</span> <br> Date: ${eq['datetime']} <br> Magnitude: ${eq['magnitude']} <br> Depth: ${eq['depth']} km <br> Latitude: ${eq['lat']} <br> Longitude: ${eq['lng']}`));
                  });

                  map.addLayer(earthquakesGroup);

                if(typeof(ctlEqButton) == 'undefined') {
                  ctlEqButton = L.easyButton({
                    id: 'eq-button',
                    states: [{
                    stateName: 'show-earthquakes-markers',
                    icon: '<i class="fa-solid fa-house-crack fa-xl"></i>',
                    title: 'show earthquakes markers',
                    onClick: function() {
                      if (map.hasLayer(earthquakesGroup)){
                        map.removeLayer(earthquakesGroup);
                      } else {
                        map.addLayer(earthquakesGroup);
                      }
                    }
                  }]
                  }).addTo(map);
                }
              } else {
                map.removeControl(ctlEqButton);
                ctlEqButton = undefined;
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
  
  // country border

  $.ajax({
    url: "php/getCountryBorder.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode
  },
    success: function(result) {
        if (result.status.name == "ok") {
            layer = L.geoJson(result['data']).addTo(map);
            }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);      
    }
  });
  

  // city markers, layer and easy button

  $.ajax({
    url: "php/getCities.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode
  },
    success: function(result) {
        if (result.status.name == "ok") {
          result['data'].forEach(city => {
            if (city['fcodeName'] === 'capital of a political entity'){
              citiesGroup.addLayer(L.marker([city['lat'], city['lng']], {icon: capCityMarker})
      .bindPopup(`<span class="fw-bold">${city['name']}</span> <br> Capital of ${city['countryName']} <br> Population: ${city['population']} <br> Latitude: ${city['lat']} <br> Longitude: ${city['lng']}`)
      .openPopup());
            } else {
              citiesGroup.addLayer(L.marker([city['lat'], city['lng']], {icon: cityMarker})
              .bindPopup(`<span class="fw-bold">${city['name']}</span> <br> Population: ${city['population']} <br> Latitude: ${city['lat']} <br> Longitude: ${city['lng']}`));
            }          
          })

          map.addLayer(citiesGroup);

          if(typeof(ctlCityButton) == 'undefined') {
            ctlCityButton = L.easyButton({
              id: 'city-button',
              states: [{
              stateName: 'show-cities-markers',
              icon: '<i class="fa-solid fa-city fa-xl"></i>',
              title: 'show cities markers',
              onClick: function() {
                if (map.hasLayer(citiesGroup)){
                  map.removeLayer(citiesGroup);
                } else {
                  map.addLayer(citiesGroup);
                }
              }
            }]
            }).addTo(map);
          }
            }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);      
    }
  });

  // reserve markers, layer and easy button

  $.ajax({
    url: "php/getReserve.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode
  },
    success: function(result) {
        if (result.status.name == "ok") {
          if (result['data'].length >= 1){
            result['data'].forEach(reserve => {
              reserveGroup.addLayer(L.marker([reserve['lat'], reserve['lng']], {icon: reserveMarker})
              .bindPopup(`<span class="fw-bold">${reserve['name']}</span> <br> ${reserve['fcodeName']} <br> Latitude: ${reserve['lat']} <br> Longitude: ${reserve['lng']}`));          
            })

            map.addLayer(reserveGroup);
          
          if(typeof(ctlReserveButton) == 'undefined') {
            ctlReserveButton = L.easyButton({
              id: 'reserve-button',
              states: [{
              stateName: 'show-reserve-markers',
              icon: '<i class="fa-solid fa-tree fa-xl"></i>',
              title: 'show reserve markers',
              onClick: function() {
                if (map.hasLayer(reserveGroup)){
                  map.removeLayer(reserveGroup);
                } else {
                  map.addLayer(reserveGroup);
                }
              }
            }]
            }).addTo(map);
          }
        } else {
          map.removeControl(ctlReserveButton);
          ctlReserveButton = undefined;
        }
            }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);      
    }
  });
  
  // airport markers, layer and easy button

  $.ajax({
    url: "php/getAirport.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode
  },
    success: function(result) {
        if (result.status.name == "ok") {
          console.log(result);
          if (result['data'].length >= 1){
            result['data'].forEach(airport => {
              airportGroup.addLayer(L.marker([airport['lat'], airport['lng']], {icon: airportMarker})
              .bindPopup(`<span class="fw-bold">${airport['name']}</span> <br> ${airport['fcodeName']} <br> Latitude: ${airport['lat']} <br> Longitude: ${airport['lng']}`));          
            })

            map.addLayer(airportGroup);
         
          if(typeof(ctlAirportButton) == 'undefined') {
            ctlAirportButton = L.easyButton({
              id: 'airport-button',
              states: [{
              stateName: 'show-airport-markers',
              icon: '<i class="fa-solid fa-plane fa-xl"></i>',
              title: 'show airport markers',
              onClick: function() {
                if (map.hasLayer(airportGroup)){
                  map.removeLayer(airportGroup);
                } else {
                  map.addLayer(airportGroup);
                }
              }
            }]
            }).addTo(map);
          }
        } else {
          map.removeControl(ctlAirportButton);
          ctlAirportButton = undefined;
        }
            }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);      
    }
  });

  //flag image

    const flagUrl = 'https://countryflagsapi.com/png/' + countryCode;
    $('#flagImg').attr('src', flagUrl);
    $('#flagImg').attr('alt', country + ' flag');
  
  // country info
  
    $.ajax({
      url: "php/restCountries.php",
      type: 'POST',
      dataType: 'json',
      data: {
        countryCode:   countryCode,
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
        $('.capital').html(result['data'][0]['capital']);
        $('#continent').html(result['data'][0]['continents']);
        $('#area').html(result['data'][0]['area']);
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
    url: "php/getNews.php",
    type: 'POST',
    dataType: 'json',
    data: {
      country: country,
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
    url: "php/getIncome.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode,
    },
    success: function(result) {
      if (result.status.name == "ok") {
        $('#income').html(result['data'][1][0]['incomeLevel']['value']);
        $('#lat').html(result['data'][1][0]['latitude']);
        $('#lng').html(result['data'][1][0]['longitude']);

         //weather data
         $.ajax({
          url: "php/getWeather.php",
          type: 'POST',
          dataType: 'json',
          data: {
            lat: result['data'][1][0]['latitude'],
            lng: result['data'][1][0]['longitude']
          },
          success: function(result) {
            if (result.status.name == "ok") {
              $('#description').html(result['data']['weather'][0]['description']);
              $('#temp').html(Math.round(result['data']['main']['temp'] * 10) / 10);
              $('#minTemp').html(Math.round(result['data']['main']['temp_min'] * 10) / 10);
              $('#maxTemp').html(Math.round(result['data']['main']['temp_max'] * 10) / 10);
              $('#feelTemp').html(Math.round(result['data']['main']['feels_like'] * 10) / 10);
              $('#pressure').html(result['data']['main']['pressure']);
              $('#humid').html(result['data']['main']['humidity']);
              $('#wind').html(result['data']['wind']['speed']);
              $('#clouds').html(result['data']['clouds']['all']);
              $('#vis').html(result['data']['visibility']);
              let weatherIconUrl = `http://openweathermap.org/img/wn/${result['data']['weather'][0]['icon']}@2x.png`;
              $('#weatherIcon').attr('src', weatherIconUrl);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(errorThrown, textStatus);
              console.warn(jqXHR.responseText)
          }
        }); 

        // weather forecast

        $.ajax({
          url: "php/getWeatherForecast.php",
          type: 'POST',
          dataType: 'json',
          data: {
            lat: result['data'][1][0]['latitude'],
            lng: result['data'][1][0]['longitude']
          },
          success: function(result) {
            if (result.status.name == "ok") {
              function dayOfTheWeek (timestamp) {
                let date = new Date(timestamp * 1000);
                let stringDate = date.toDateString();
                let day = stringDate.slice(0, 3);
                switch (day) {
                  case 'Mon':
                    return 'Monday';
                    break;
                  case 'Tue':
                    return 'Tuesday';
                    break;
                  case 'Wed':
                    return 'Wednesday';
                    break;
                  case 'Thu':
                    return 'Thursday';
                    break;
                  case 'Fri':
                    return 'Friday';
                    break;
                  case 'Sat':
                    return 'Saturday';
                    break;
                  case 'Sun':
                    return 'Sunday';
                    break;
                }
              }
              for(let i = 1; i < 6; i++) {
                $(`#day${i}`).html(dayOfTheWeek(result['data'][i]['dt']))
                $(`#tempDay${i}`).html(Math.round(result['data'][i]['temp']['day'] * 10) / 10);
                $(`#tempNight${i}`).html(Math.round(result['data'][i]['temp']['night'] * 10) / 10);
                let weatherIconUrl = `http://openweathermap.org/img/wn/${result['data'][i]['weather'][0]['icon']}.png`;
              $(`#weatherIconDay${i}`).attr('src', weatherIconUrl);
              }
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(errorThrown, textStatus);
              console.warn(jqXHR.responseText)
          }
        }); 
  
  
        $.ajax({
          url: "php/getAirPollution.php",
          type: 'POST',
          dataType: 'json',
          data: {
            lat: result['data'][1][0]['latitude'],
            lng: result['data'][1][0]['longitude']
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
  
  //wikipedia links
  
  $.ajax({
    url: "php/getGeonamesWiki.php",
    type: 'POST',
    dataType: 'json',
    data: {
      country: country,
    },
    success: function(result) {
      if (result.status.name == "ok") {
        $('#wikiLinkOne').attr('href', 'https://' + result['data'][0]['wikipediaUrl']);
        $('#wikiLinkOne').html(result['data'][0]['title']);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown, textStatus);
        console.warn(jqXHR.responseText)
    }
  }); 
  
  //easy buttons
  
    if(typeof(ctlInfoButton) == 'undefined') {
      ctlInfoButton = L.easyButton({
        id: 'info-button',
        states: [{
        stateName: 'show-geographic-modal',
        icon: '<i class="fa-solid fa-info fa-xl"></i>',
        title: 'show modal',
        onClick: function() {
          $('#infoModal').modal('show');
        }
      }]
      }).addTo(map);
    }
  
    if(typeof(ctlWeatherButton) == 'undefined') {
      ctlWeatherButton = L.easyButton({
        id: 'weather-button',
        states: [{
        stateName: 'show-weather-modal',
        icon: '<i class="fa-solid fa-cloud-sun-rain fa-xl"></i>',
        title: 'show modal',
        onClick: function() {
          $('#weatherModal').modal('show');
        }
      }]
      }).addTo(map);
    }

    if(typeof(ctlAirButton) == 'undefined') {
      ctlAirButton = L.easyButton({
        id: 'air-button',
        states: [{
        stateName: 'show-wiki-modal',
        icon: '<i class="fa-solid fa-smog fa-xl"></i>',
        title: 'show modal',
        onClick: function() {
          $('#aqModal').modal('show');
        }
      }]
      }).addTo(map);
    }
  
    if(typeof(ctlNewsButton) == 'undefined') {
      ctlNewsButton = L.easyButton({
        id: 'news-button',
        states: [{
        stateName: 'show-news-modal',
        icon: '<i class="fa-solid fa-newspaper fa-xl"></i>',
        title: 'show modal',
        onClick: function() {
          $('#newsModal').modal('show');
        }
      }]
      }).addTo(map);
    }

    
    controlLoader.hide();
};


//on start

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
          getInfo(result['data']['country'], result['data']['ISO_3166-1_alpha-2']);

          $("#select").val(result['data']['ISO_3166-1_alpha-2']);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown, textStatus);
    }
});
});

//on select 

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
  
  //bounds and layer remove

  map.removeLayer(layer);
  citiesGroup.clearLayers();
  earthquakesGroup.clearLayers();
  reserveGroup.clearLayers(); 
  airportGroup.clearLayers();

  getInfo(textSelected, valueSelected);

});
});


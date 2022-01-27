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

var mapOptions = {
  center: [51.505, -0.09],
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

L.Control.textbox = L.Control.extend({
  onAdd: function(map) {
    
  var text = L.DomUtil.create('div');
  text.id = "info_text";
  text.innerHTML = "<h1 id='demographic'></h1>" +
                    "<img src='' alt=''><br>" +
                    "<p id='name'></p>" +
                    "<p id='languages'></p>" +
                    "<p id='population'></p>" +
                    "<p id='currency'></p><br>" +
                    "<h1 id='geographic'></h1>" +
                    "<p id='capitol'></p>" +
                    "<p id='continent'></p>" +
                    "<p id='area'></p>" +
                    "<p id='lat'></p>" +
                    "<p id='lon'></p><br>" +
                    "<h1 id='forecast'></h1>" +
                    "<p id='weather'></p>" +
                    "<div id='w-fidget'></div>" +
                    "<p id='air'></p><br>" +
                    "<h1 id='exchange'></h1>" +
                    "<p id='rate'></p><br>" +
                    "<h1 id='news'></h1>" +
                    "<h1 id='wiki-links'></h1>";
  return text;
  },

  onRemove: function(map) {
    // Nothing to do here
  }
});
L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
L.control.textbox({ position: 'topleft' }).addTo(map);

$('#select').click(function() {
  $.ajax({
      url: "",
      type: 'POST',
      dataType: 'json',
      data: {
          Country: $('#select').val(),

      },
      success: function(result) {
          console.log(JSON.stringify(result));
          if (result.status.name == "ok") {

           

          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(errorThrown, textStatus);
      }
  });
});




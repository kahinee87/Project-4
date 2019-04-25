
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-73.930864,40.647238],
  zoom: 12,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxxgl.NavigationControl());
map.on('style.load', function(){
  //this sets up the geojson as the source on themap which we can use to add visuals layers
  map.addSource('greenpoint-pluto',{
    type: 'geojson',
    data: ./data/greenpoint-polygon.geojson
  });

  map.addlayer ({
    id: 'greenpoint-lots-fill',
    type: 'fill',
    source: 'greenpoint-pluto',
    paint: {
      'fill-opacity': 0.7,
      'fill-color':{
              type: 'categorical',
              property: 'landuse',
              stops: [
                  [
                    '01',
                    LandUseLookup(1).color,
                  ],
                  [
                    "02",
                    LandUseLookup(2).color,
                  ],
                  [
                    "03",
                    LandUseLookup(3).color,
                  ],
                  [
                    "04",
                    LandUseLookup(4).color,
                  ],
                  [
                    "05",
                    LandUseLookup(5).color,
                  ],
                  [
                    "06",
                    LandUseLookup(6).color,
                  ],
                  [
                    "07",
                    LandUseLookup(7).color,
                  ],
                  [
                    "08",
                    LandUseLookup(8).color,
                  ],
                  [
                    "09",
                    LandUseLookup(9).color,
                  ],
                  [
                    "10",
                    LandUseLookup(10).color,
                  ],
                  [
                    "11",
                    LandUseLookup(11).color,
                  ],
                ]
              }
          }
        }, 'waterway-label')

        // add an outline to the tax lots which is only visible after zoom level 14.8
        map.addLayer({
          id: 'greenpoint-lots-line',
          type: 'line',
          source: 'greenpoint-pluto',
          paint: {
            'line-opacity': 0.7,
            'line-color': 'gray',
            'line-opacity': {
              stops: [[14, 0], [14.8, 1]], // zoom-dependent opacity, the lines will fade in between zoom level 14 and 14.8
            }
          }
        });

        // add an empty data source, which we will use to highlight the lot the user is hovering over
        map.addSource('highlight-feature', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        })

        // add a layer for the highlighted lot
        map.addLayer({
          id: 'highlight-line',
          type: 'line',
          source: 'highlight-feature',
          paint: {
            'line-width': 3,
            'line-opacity': 0.9,
            'line-color': 'black',
          }
        });

        // when the mouse moves, do stuff!
        map.on('mousemove', function (e) {
          // query for the features under the mouse, but only in the lots layer
          var features = map.queryRenderedFeatures(e.point, {
              layers: ['greenpoint-lots-fill'],
          });

          // get the first feature from the array of returned features.
          var lot = features[0]

          if (lot) {  // if there's a lot under the mouse, do stuff
            map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

            // lookup the corresponding description for the land use code
            var landuseDescription = LandUseLookup(parseInt(lot.properties.landuse)).description;

            // use jquery to display the address and land use description to the sidebar
            $('#address').text(lot.properties.address);
            $('#landuse').text(landuseDescription);

            // set this lot's polygon feature as the data for the highlight source
            map.getSource('highlight-feature').setData(lot.geometry);
          } else {
            map.getCanvas().style.cursor = 'default'; // make the cursor default

            // reset the highlight source to an empty featurecollection
            map.getSource('highlight-feature').setData({
              type: 'FeatureCollection',
              features: []
            });
          }
        })
      })

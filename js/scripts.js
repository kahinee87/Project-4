
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-73.930864,40.647238],
  zoom: 15,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

var LandUseLookup1 = (zonedist1) => {
switch(zonedist1) {
  case 'R4':
  return {
    color:'#ffff99',
    description:'R4 residential Zone; Permissible FAR is 0.75',
  };
  case 'R5':
  return {
    color:'#ffff4d',
    description:'R5 residential Zone; Permissible FAR is 1.25',
};
case 'R6':
return {
  color:'#ffff00',
  description:'R6 residential Zone; Permissible FAR is 0.78 - 2.43',
      };
      case 'R7-1':
      return {
        color:'#e6e600',
        description:'R7-1 residential Zone; Permissible FAR is 0.87 -3.44',
      };
      case 'R3-2':
      return {
        color:'#ffffb3',
        description:'R3-2 residential Zone; Permissible FAR is 0.5',
      };
      case 'M1-1':
      return {
        color:'#ccb3ff',
        description:'M1-1 residential Zone; Permissible FAR is 1',
      };
      case 'M1-3':
      return {
        color:'#aa80ff',
        description:'M1-3 residential Zone; Permissible FAR is 5',
      };
      case 'M3-1':
      return {
        color:'#a64dff',
        description:'M3-1 residential Zone; Permissible FAR is 2',
      };
      case 'C8-1':
      return {
        color:'#ff8533',
        description:'C8-1 residential Zone; Permissible FAR is 1',
      };
      case 'C8-2':
      return {
        color:'#ff751a',
        description:'C8-2 Commercial Zone ; Permissible FAR is 2',
      };
    default:
        return {
          color: 'grey',
          description: 'other',
  };
}
};


var  LandUseLookup = (code) => {
  switch (code) {
    case 1:
      return {

        description: '1 & 2 Family',
      };
    case 2:
      return {

        description: 'Multifamily Walk-up',
      };
    case 3:
      return {

        description: 'Multifamily Elevator',
      };
    case 4:
      return {

        description: 'Mixed Res. & Commercial',
      };
    case 5:
      return {

        description: 'Commercial & Office',
      };
    case 6:
      return {

        description: 'Industrial & Manufacturing',
      };
    case 7:
      return {

        description: 'Transportation & Utility',
      };
    case 8:
      return {

        description: 'Public Facilities & Institutions',
      };
    case 9:
      return {

        description: 'Open Space & Outdoor Recreation',
      };
    case 10:
      return {

        description: 'Parking Facilities',
      };
    case 11:
      return {

        description: 'Vacant Land',
      };
    case 12:
      return {

        description: 'Other',
      };
    default:
      return {

        description: 'Other',
      };
  }
};

const zones = [
{
zonedist1: 'R4',
color:'#ffff99',

},
{
zonedist1: 'R5',
color:'#ffff4d',

},
{
zonedist1: 'R6',
color:'#ffff99',

},
{
zonedist1: 'R7-1',
color:'#ffff99',

},
{
zonedist1: 'R3-2',
color:'#ffff99',

},
{
zonedist1: 'M1-1',
color:'#ccb3ff',

},
{
zonedist1: 'M1-3',
color:'#aa80ff',

},
  {
    zonedist1: 'M3-1',
    color:'#a64dff',

},
  {
      zonedist1: 'C8-1',
        color:'#ff8533',

  },
    {
      zonedist1: 'C8-2',
    color:'#ff751a',

  },
]
zones.forEach(function(zone) {
  $('.legend').append(`
    <div>
      <div class="legend-color-box" style="background-color:${zone.color};"></div>
      ${zone.zonedist1}
    </div>
  `)
})


// a little object for looking up neighborhood center points
var neighborHoodLookup = {
  'Crown-Heights': [-73.931347,40.660131],
  'Lefferts-Garden': [-73.931304,40.646522],
  'East-Flatbush': [-73.930489,40.636036],
  'Flatlands': [-73.926680,40.616624],
  'utica-avenue':[-73.932753,40.638186],
}


// we can't add our own sources and layers until the base style is finished loading
map.on('style.load', function() {
  // add a button click listener that will control the map
  // we have 4 buttons, but can listen for clicks on any of them with just one listener
  $('.flyto').on('click', function(e) {
    // pull out the data attribute for the neighborhood using query
    var neighborhood = $(e.target).data('neighborhood');

    // this is a useful notation for looking up a key in an object using a variable
    var center = neighborHoodLookup[neighborhood];

    // fly to the neighborhood's center point
    map.flyTo({center: center, zoom: 15});
  });

  // let's hack the basemap style a bit
  // you can use map.getStyle() in the console to inspect the basemap layers
  map.setPaintProperty('water', 'fill-color', 'black')

  //this sets up the geojson as the source on themap which we can use to add visuals layers
  map.addSource('utica-avenue',{
    type: 'geojson',
    data: './data/utica-avenue.geojson',
  });

  map.addLayer ({
    id: 'utica-lots-fill',
    type: 'fill',
    source: 'utica-avenue',
    paint: {
      'fill-opacity': 0.7,
      'fill-color':{
              type: 'categorical',
              property: 'zonedist1',
              stops: [
                  [
                    'R4',
                    LandUseLookup1('R4').color,
                  ],
                  [
                    "R5",
                    LandUseLookup1('R5').color,
                  ],
                  [
                    "R6",
                    LandUseLookup1('R6').color,
                  ],
                  [
                    "R7-1",
                    LandUseLookup1('R7-1').color,
                  ],
                  [
                    "M1-1",
                    LandUseLookup1('M1-1').color,
                  ],
                  [
                    "M1-3",
                    LandUseLookup1('M1-3').color,
                  ],
                  [
                    "C8-1",
                    LandUseLookup1('C8-1').color,
                  ],
                  [
                    "R3-2",
                    LandUseLookup1('R3-2').color,
                  ],
                  [
                    "M3-1",
                    LandUseLookup1('M3-1').color,
                  ],
                  [
                    "C8-2",
                    LandUseLookup1('C8-2').color,
                  ],
                ]
              }
          }
        }, 'waterway-label')

        // add an outline to the tax lots which is only visible after zoom level 14.8
        map.addLayer({
          id: 'utica-lots-line',
          type: 'line',
          source: 'utica-avenue',
          paint: {
            'line-opacity':0.3,
            }

        });

        // add an empty data source, which we will use to highlight the lot the user is hovering over
        map.addSource('outline-feature', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        })

        // add a layer for the highlighted lot
        map.addLayer({
          id: 'outline-line',
          type: 'line',
          source: 'outline-feature',
          paint: {
            'line-width': 0.1,
            'line-opacity': 0.9,
            'line-color': 'lightgrey',

          }
        });

        // when the mouse moves, do stuff!
        map.on('mousemove', function (e) {
          // query for the features under the mouse, but only in the lots layer
          var features = map.queryRenderedFeatures(e.point, {
              layers: ['utica-lots-fill'],
          });

          // get the first feature from the array of returned features.
          var lot = features[0]

          if (lot) {  // if there's a lot under the mouse, do stuff
            map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

            // lookup the corresponding description for the land use code
            var landuseDescription = LandUseLookup(parseInt(lot.properties.landuse)).description;
            var zonedist1Description = LandUseLookup1(parseInt(lot.properties.zonedist1)).description;

            // use jquery to display the address and land use description to the sidebar
            $('#zonedist1').text(lot.properties.zonedist1);
            $('#builtfar').text(lot.properties.builtfar);
            $('#landuse').text(landuseDescription);


            // set this lot's polygon feature as the data for the highlight source
            map.getSource('outline-feature').setData(lot.geometry);
          } else {
            map.getCanvas().style.cursor = 'default'; // make the cursor default

            // reset the highlight source to an empty featurecollection
            map.getSource('outline-feature').setData({
              type: 'FeatureCollection',
              features: []
            });
          }
        })
      })

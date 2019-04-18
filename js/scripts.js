
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-73.99,40.74],
  zoom: 9.5,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxxgl.NavigationControl());
map.on('style.load', function(){
  //this sets up the geojson as the source on themap which we can use to add visuals layers
  map.addSource('utica-pluto',{
    type: 'geojson',
    data: ./data/utica-polygon.geojson
  });

  map.addlayer ({
    id: 'utica-lots-fill',
    type: 'fill',
    source: 'utica-pluto',
  })  
})

import data from './dataStorage.js'
import * as everpolate from '../lib/everpolate.browserified.min.js'
console.log('data', data);
console.log('everpolate', everpolate);

mapboxgl.accessToken = 'pk.eyJ1IjoidmVyeW4xY2UiLCJhIjoiY2pqaGdtdXRmM2h2cDN2bW1mMXFjcDR5ZCJ9.8yOftdKhiv5q1EFPhBP_Mw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [39.729996, 43.588348], // starting position [lng, lat]
    zoom: 15, // starting zoom
    pitch: 40

});

console.log('linear', linear(1000000, [0, 15], [200000, 3600000]))

map.on('load', function() {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    console.log(layers);
     
    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
    labelLayerId = layers[i].id;
    break;
    }
    }
     
    map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
    'fill-extrusion-color': '#aaa',
     
    // use an 'interpolate' expression to add a smooth transition effect to the
    // buildings as the user zooms in
    'fill-extrusion-height': ["get", "height"]
    ,
    'fill-extrusion-base':  ["get", "min_height"],
    'fill-extrusion-opacity': .6
    }
    }, labelLayerId);
    });
    


    /* map.addLayer({

    }); */
    
    var createGeoJSONCircle = function(center, radiusInKm) {
        var points = 64;
    
        var coords = {
            latitude: center[1],
            longitude: center[0]
        };
    
        var km = radiusInKm;
    
        var ret = [];
        var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
        var distanceY = km/110.574;
    
        var theta, x, y;
        for(var i=0; i<points; i++) {
            theta = (i/points)*(2*Math.PI);
            x = distanceX*Math.cos(theta);
            y = distanceY*Math.sin(theta);
    
            ret.push([coords.longitude+x, coords.latitude+y]);
        }
        ret.push(ret[0]);
    
        return {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
            }
        };
    };

    var generateSource = function(atms, dataSet) {
        var source = { type: "FeatureCollection", features: []}
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
        } 
    }

export default map;
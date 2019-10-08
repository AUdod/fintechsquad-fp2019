/* import data from './dataStorage.js' */
import {getTest} from './dataApi.js'
getTest().then( result => {console.log('getTest', result ); } );

mapboxgl.accessToken = 'pk.eyJ1IjoidmVyeW4xY2UiLCJhIjoiY2pqaGdtdXRmM2h2cDN2bW1mMXFjcDR5ZCJ9.8yOftdKhiv5q1EFPhBP_Mw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [39.729996, 43.588348], // starting position [lng, lat]
    zoom: 15, // starting zoom
    pitch: 40

});

map.on('load', function () {
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
            'fill-extrusion-height': ["get", "height"],
            'fill-extrusion-base': ["get", "min_height"],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);

    getTest().then(result =>  addLayers(map, result, "test"));

});

function addLayers(map, source, moduleName) {
    map.addSource(moduleName, {
        "type": "geojson",
        "data": source
    });
    map.addLayer({
        "id": moduleName + "-geom",
        "type": "fill",
        "source": moduleName,
        "paint": {
            "fill-color": "#66e100",
            "fill-opacity": 0.5
        }
        /* ,
                    "filter": ["==", "$type", "Polygon"] */
    });
    map.addLayer({
        'id': moduleName + "-extrusion",
        'type': 'fill-extrusion',
        'source': moduleName,
        'paint': {
            // See the Mapbox Style Specification for details on data expressions.
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions
            // Get the fill-extrusion-color from the source 'color' property.
            'fill-extrusion-color': '#66e100',
            // Get fill-extrusion-height from the source 'height' property.
            'fill-extrusion-height': 500,
            // Get fill-extrusion-base from the source 'base_height' property.
            'fill-extrusion-base': 5,
            // Make extrusions slightly opaque for see through indoor walls.
            'fill-extrusion-opacity': 0.7
        }
    });
    console.log( 'done')
}

/* var mapBuilder = {
    testSource: null,
    test
} */
    

export default map;
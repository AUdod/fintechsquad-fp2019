/* import data from './dataStorage.js' */
import {getNew, getOld} from './dataApi.js'


var mapBuilder = {};
var newDataButton = document.getElementById('newData')
newDataButton.addEventListener("click", function () {
    oldDataButton.classList.remove("active")
    newDataButton.classList.add("active")

    mapBuilder.toggleLayers("new", "old");

        
})
var oldDataButton = document.getElementById('oldData')
oldDataButton.addEventListener("click", function () {
    newDataButton.classList.remove("active")
    oldDataButton.classList.add("active")

    mapBuilder.toggleLayers("old", "new");

        
})


mapboxgl.accessToken = 'pk.eyJ1IjoidmVyeW4xY2UiLCJhIjoiY2pqaGdtdXRmM2h2cDN2bW1mMXFjcDR5ZCJ9.8yOftdKhiv5q1EFPhBP_Mw';
mapBuilder.map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [39.737310716094385,
        43.586651460188904], // starting position [lng, lat]
        zoom: 14.7,
        pitch: 65,
        bearing: 35

});

mapBuilder.map.on('move', function (e) {
    /* console.log('map', mapBuilder.map)
    console.log('e', e) */
})

function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    mapBuilder.map.rotateTo((timestamp / 300) % 360, {duration: 0});
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
    }


mapBuilder.map.on('load', function () {
    // Insert the layer beneath any symbol layer.
    rotateCamera(0);

    console.log(mapBuilder)
    var layers = mapBuilder.map.getStyle().layers;

    console.log(layers);

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    mapBuilder.map.addLayer({
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

    getNew().then(result =>  {
        mapBuilder.addLayers(result, "new")
        mapBuilder.toggleLayers("new", "old");
    });
    getOld().then(result =>  {
        /* mapBuilder.oldSource = result; */
        mapBuilder.addLayers(result, "old");
        mapBuilder.toggleLayers("new", "old");
    });

    /* mapBuilder.toggleLayers("new", "old"); */

});


    
mapBuilder.addLayers = function(source, moduleName) {
    mapBuilder.map.addSource(moduleName, {
        "type": "geojson",
        "data": source
    });
    mapBuilder.map.addLayer({
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
    mapBuilder.map.addLayer({
        'id': moduleName + "-extrusion",
        'type': 'fill-extrusion',
        'source': moduleName,
        'paint': {
            // See the Mapbox Style Specification for details on data expressions.
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions
            // Get the fill-extrusion-color from the source 'color' property.
            'fill-extrusion-color': '#66e100',
            // Get fill-extrusion-height from the source 'height' property.
            'fill-extrusion-height': 50,
            // Get fill-extrusion-base from the source 'base_height' property.
            'fill-extrusion-base': 0,
            // Make extrusions slightly opaque for see through indoor walls.
            'fill-extrusion-opacity': 0.7
        }
    });

    mapBuilder.map.addLayer({
        "id": moduleName+"-labels",
        "type": "symbol",
        "source": moduleName,
        "layout": {
        "text-field": ["get", "0"],
        "text-variable-anchor": ["top", "bottom", "left", "right"],
        "text-radial-offset": 0.5,
        "text-justify": "auto"
        }
        });

        
    mapBuilder.map.setPaintProperty(moduleName +'-extrusion', 'fill-extrusion-height', [
        'interpolate',
        ['linear'],
        ['number', ['get', '0']],
        0, 20,
        5000000, 440
    ]);

    mapBuilder.map.setPaintProperty(moduleName +'-extrusion', 'fill-extrusion-color', [
        'interpolate',
        ['linear'],
        ['number', ['get', '0']],
        0, '#2ff211',
        1700000, '#95f211',
        3600000, '#c27e11',
        5000000, '#f21111'
    ]);

    mapBuilder.map.setPaintProperty(moduleName +'-geom', 'fill-color', [
        'interpolate',
        ['linear'],
        ['number', ['get', '0']],
        0, '#2ff211',
        1400000, '#95f211',
        2800000, '#c27e11',
        4000000, '#f21111'
    ]);


    console.log( this.map.getStyle().sources)
}

mapBuilder.toggleLayers = function( addModuleName, delModuleName) {

    mapBuilder.map.setLayoutProperty(addModuleName+'-geom', 'visibility', 'visible');
    mapBuilder.map.setLayoutProperty(addModuleName+'-extrusion', 'visibility', 'visible');
    mapBuilder.map.setLayoutProperty(addModuleName+'-labels', 'visibility', 'visible');

    mapBuilder.map.setLayoutProperty(delModuleName+'-geom', 'visibility', 'none');
    mapBuilder.map.setLayoutProperty(delModuleName+'-extrusion', 'visibility', 'none');
    mapBuilder.map.setLayoutProperty(delModuleName+'-labels', 'visibility', 'none');

    
}

/* var mapBuilder = {
    testSource: null,
    test
} */
    

export default map;
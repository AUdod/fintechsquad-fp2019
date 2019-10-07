import data from './dataStorage.js'
console.log(data);

mapboxgl.accessToken = 'pk.eyJ1IjoidmVyeW4xY2UiLCJhIjoiY2pqaGdtdXRmM2h2cDN2bW1mMXFjcDR5ZCJ9.8yOftdKhiv5q1EFPhBP_Mw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [39.729996, 43.588348], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

export default map;
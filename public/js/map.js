mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: [28.9784, 41.0082],
    zoom: 9
});

console.log(coordinates);

// const marker = new mapboxgl.Marker()
//     .setLngLat([12.554729, 5570651])
//     .addTo(map);
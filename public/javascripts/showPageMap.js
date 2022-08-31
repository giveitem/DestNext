mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: park.geometry.coordinates, // starting position [lng, lat]
    zoom: 3, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
    .setLngLat(park.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${park.title}</h4> <p>${park.location}</p>`)
    )
    .addTo(map);
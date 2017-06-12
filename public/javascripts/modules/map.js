import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: {
    lat: 43.2,
    lng: -79.8,
  },
  zoom: 8,
};

function loadPlaces(map, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
  .then(res => {
    const places = res.data;

    if (!places.length) {
      alert('No places found!');
      return;
    }

    // create a bounds for our map / zoom
    const bounds = new google.maps.LatLngBounds();


    // make the info windows
    const infoWindow = new google.maps.InfoWindow();

    // make markers
    const markers = places.map(place => {
      const [placeLng, placeLat] = place.location.coordinates;
      const position = {
        lat: placeLat,
        lng: placeLng,
      };

      // extend bounds
      bounds.extend(position);

      // make marker
      const marker = new google.maps.Marker({
        map,
        position,
      });
      marker.place = place;
      return marker;
    });

    // attach click event handler
    // .addListener is a GoogleMaps API
    markers.forEach(marker => marker.addListener('click', function() {
      const html = `
        <div class="popup">
          <a href="/store/$this.place.slug}">
            ${this.place.name}
          </a>
          <img src="/uploads/${this.place.photo || 'store.png'} " alt=""/>
          <p>${this.place.name} – ${this.place.location.address}</p>
        </div>
      `;

      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    }));

    // zoom map to fit all the markers perfectly
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
  });
}


async function makeMap(mapDiv) {
  if (!mapDiv) return;

  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);

  // add listener
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  });
}

export default makeMap;

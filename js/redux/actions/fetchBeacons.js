// import haversine from 'haversine';
import {
  fetchBeaconsPending,
  fetchBeaconsSuccess,
  fetchBeaconsError
} from './index';
import merc from 'mercator-projection';
import haversine from 'haversine';

export function fetchBeacons(location) {
  const url = 'https://rechargemyparty.herokuapp.com/positions'
  //  const url = 'http://192.168.178.24:3000/positions';

  return dispatch => {
    dispatch(fetchBeaconsPending());

    fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    }).then(res => res.json())

      .then(res => {
        if (res.error) {
          throw (res.error);
        }

        const result = res.map(beacon => {
          var beaconPos = merc.fromLatLngToPoint({ lat: beacon.location.lat, lng: beacon.location.long });
          const devicePos = merc.fromLatLngToPoint({ lat: location.lat, lng: location.long });

          const trueBeaconPosX = (beaconPos.x - devicePos.x);
          const trueBeaconPosY = (beaconPos.y - devicePos.y);

          return {
            _id: beacon._id,
            name: beacon.name,
            location: beacon.location,
            distance: Math.floor(haversine(
              { latitude: location.lat, longitude: location.long },
              { latitude: beacon.location.lat, longitude: beacon.location.long },
              { unit: 'meter' }
            ), 1),
            mercPos: { x: trueBeaconPosX * 100000, y: trueBeaconPosY * 100000 },
            mercDist: Math.sqrt(Math.pow(trueBeaconPosY, 2) + Math.pow(trueBeaconPosX, 2))
          }
        })

        console.log(result);
        dispatch(fetchBeaconsSuccess(result))
      })
      .catch(error => {
        console.warn(error);

        dispatch(fetchBeaconsError(error));

      })
  }
}

export default fetchBeacons;
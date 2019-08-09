import {
  postBeaconError,
} from './index';

export function postBeacon(location) {
  const url = 'https://heroku-crud.herokuapp.com/beacons'
  // const url = 'http://192.168.178.24:3000/positions';

  return dispatch => {
    fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: location,
      })
    })
      .catch(error => {
        console.warn(error);
        dispatch(postBeaconError(error));
      })
  }
}

export default postBeacon;

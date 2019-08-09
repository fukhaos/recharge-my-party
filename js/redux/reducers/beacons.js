const initialState = {
  beacons: null,
}

function beacons(state = initialState, action) {
  console.log(action)
  switch (action.type) {
    case 'CREATE_BEACON':
      return {
        ...state,
        beacons: action.payload
      }
    case 'REMOVE_BEACON':
      return {
        ...state,
      }
    case 'FETCH_BEACONS_SUCCESS':
      return {
        ...state,
        beacons: action.payload
      }
    default:
      return state;
  }
}

module.exports = beacons;
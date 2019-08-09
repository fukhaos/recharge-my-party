const initialState = {
  view: 'LOADING',
  location: null,
  arTrackingInitialized: false,
}

function ui(state = initialState, action) {
  console.log(action)
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        view: action.payload
      }
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.payload
      }
    case 'SET_CHARGER':
      return {
        ...state,
        chargerIsPlugged: action.payload
      }
    case 'AR_TRACKING_INITIALIZED':
      return {
        ...state,
        arTrackingInitialized: action.payload,
      }
    default:
      return state;
  }
}

module.exports = ui;
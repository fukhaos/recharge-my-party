// set app view
export const setView = (view) => ({
  type: 'SET_VIEW',
  payload: view,
})

// set gps location
export const setLocation = (location) => ({
  type: 'SET_LOCATION',
  payload: location,
})

// fetchBeacons
export const fetchBeaconsPending = () => ({
  type: 'FETCH_BEACONS_PENDING',
})
export const fetchBeaconsSuccess = (beacons) => ({
  type: 'FETCH_BEACONS_SUCCESS',
  payload: beacons,
})
export const fetchBeaconsError = (error) => ({
  type: 'FETCH_BEACONS_ERROR',
  payload: error,
})

// action to add a model at the given index from data model
export const createBeacon = (location) => ({
  type: 'CREATE_BEACON',
  payload: location,
})

// action to remove model with given UUID from AR Scene
export const removeBeaconWithUUID = (uuid) => ({
  type: 'REMOVE_BEACON',
  payload: uuid,
})

// action to show / hide AR Initialization UI to guide user to move device around
export const ARTrackingInitialized = (trackingNormal) => ({
  type: 'AR_TRACKING_INITIALIZED',
  payload: trackingNormal,
})
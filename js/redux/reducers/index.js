import { combineReducers } from 'redux';
import beacons from './beacons';
import ui from './ui';

module.exports = combineReducers({
  beacons, ui
});

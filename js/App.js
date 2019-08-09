import React, { Component } from 'react';
import { StatusBar, PermissionsAndroid, View, Text } from 'react-native';
import { ViroARSceneNavigator } from 'react-viro';
import styled from 'styled-components/native';
import { NativeModules } from 'react-native';

import { connect } from 'react-redux'
import {
  setView,
  setLocation,
  setCharger,
  addBeacon,
  removeBeaconWithUUID,
} from './redux/actions';
import fetchBeacons from './redux/actions/fetchBeacons';
import postBeacon from './redux/actions/postBeacon';

var InitialARScene = require('./ArScene');

class App extends Component {
  constructor() {
    super();

    this.state = {
      view: 'LOADING',
      viroAppProps: {},
    }

    this.askGpsPermission = this.askGpsPermission.bind(this);
    this.askCameraPermission = this.askCameraPermission.bind(this);
    this.fetchLocation = this.fetchLocation.bind(this);

    this._renderSplash = this._renderSplash.bind(this);
    this._renderCharging = this._renderCharging.bind(this);
    this._renderOnboard = this._renderOnboard.bind(this);
    this._renderHUD = this._renderHUD.bind(this);
  }

  async componentDidMount() {
    this.askGpsPermission();
    this.askCameraPermission();

    setTimeout(() => {
      this.props.dispatchSetView('ONBOARD_START');
    }, 1500);
  }

  async askGpsPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ]);

      if (granted["android.permission.ACCESS_COARSE_LOCATION"] === 'granted' && granted["android.permission.ACCESS_FINE_LOCATION"] == 'granted') {
        console.log('gps granted');
        this.fetchLocation();
      } else {
        console.log('no gps')
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async askCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'Allow Recharge my party' +
            'to acces your device\'s camera?',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('camera granted')
      } else {
        console.log('no camera')
      }
    } catch (err) {
      console.warn(err);
    }
  }

  fetchLocation() {
    navigator.geolocation.getCurrentPosition(
      geolocation => {
        this.props.dispatchSetLocation({
          lat: geolocation.coords.latitude,
          long: geolocation.coords.longitude,
        })
        this.props.dispatchFetchBeacons({
          lat: geolocation.coords.latitude,
          long: geolocation.coords.longitude,
        });
      },
      error => {
        console.log(error)
      },
      { enableHighAccuracy: false, timeout: 2000, maximumAge: 1000 }
    )
  }

  render() {
    if (this.props.view == 'LOADING')
      return this._renderSplash('⚡️', 'Loading...');
    else if (this.props.view == 'CHARGING') {
      NativeModules.BatteryManager.updateBatteryLevel((info) => { this.setState({ isPlugged: info.isPlugged }) })
      return this._renderCharging();
    }
    return (
      <Wrapper>
        <StatusBar hidden={true} />
        <ViroARSceneNavigator
          apiKey="6CDF17D9-8FA1-40C6-AE07-56900FA0227E"
          viroAppProps={this.state.viroAppProps}
          initialScene={{ scene: InitialARScene }}
        />

        {this.props.view == 'AR' ? this._renderHUD() : this._renderOnboard()}
      </Wrapper >
    )
  }

  _renderSplash(icon, text) {
    return (
      <ContentWrapper>
        <StatusBar hidden={true} />
        <SplashIcon>{icon}</SplashIcon>
        <SplashTitle>{text}</SplashTitle>
      </ContentWrapper>
    );
  }

  _renderCharging() {
    if (!this.state.isPlugged) {
      return (
        <ContentWrapper>
          <StatusBar hidden={true} />
          <SplashIcon>⚡️</SplashIcon>
          <SplashTitle>Insert charger to place a beacon.</SplashTitle>
          <PrimaryButton onPress={() => this.props.dispatchSetView('AR')}>
            <PrimaryText>Go back</PrimaryText>
          </PrimaryButton>
        </ContentWrapper>
      );
    } else if (this.state.isPlugged) {
      return (
        <ContentWrapper>
          <StatusBar hidden={true} />
          <SplashIcon>📍</SplashIcon>
          <SplashTitle>Beacon set!</SplashTitle>
        </ContentWrapper>
      )
    }

  }

  _renderHUD() {
    return (
      <Toolbar>
        <PrimaryButton onPress={() => this.props.dispatchSetView('CHARGING')}>
          <PrimaryText>Place beacon</PrimaryText>
        </PrimaryButton>
      </Toolbar>
    )
  }

  _renderOnboard() {
    if (this.props.view == 'ONBOARD_START') {
      return (
        <Overlay>
          <SplashIcon>👋</SplashIcon>
          <OnboardingTitle>Hi there!</OnboardingTitle>
          <OnboardingText>This app is all about finding the place to be. We’ll help you locate and join exisiting party’s on the festival camping.</OnboardingText>
          {
            this.props.beacons != null && this.props.location != null
              ? (
                <SecondaryButton onPress={() => this.props.dispatchSetView('AR')}>
                  <SecondaryText>Skip onboarding</SecondaryText>
                </SecondaryButton>
              ) : null
          }
          <PrimaryButton onPress={() => this.props.dispatchSetView('ONBOARD_GPS')}>
            <PrimaryText>Start onboarding</PrimaryText>
          </PrimaryButton>
        </Overlay>
      )
    } else if (this.props.view == 'ONBOARD_GPS') {
      return (
        <Overlay>
          <SplashIcon>📍</SplashIcon>
          <OnboardingTitle>Share your location</OnboardingTitle>
          <OnboardingText>If you want others to join your party just charge your phone and open this app. We’ll take care of the rest!</OnboardingText>
          <PrimaryButton onPress={() => this.props.dispatchSetView('ONBOARD_AR')}>
            <PrimaryText>Next</PrimaryText>
          </PrimaryButton>
        </Overlay>
      )
    } else if (this.props.view == 'ONBOARD_AR') {
      return (
        <Overlay>
          <SplashIcon>👀</SplashIcon>
          <OnboardingTitle>Look around</OnboardingTitle>
          <OnboardingText>Using augmented reality we’ll help you navigate to different locations and activities.</OnboardingText>
          <PrimaryButton onPress={() => this.props.dispatchSetView('ONBOARD_APP')}>
            <PrimaryText>Next</PrimaryText>
          </PrimaryButton>
        </Overlay>
      )
    } else if (this.props.view == 'ONBOARD_APP') {
      return (
        <Overlay>
          <SplashIcon>📍</SplashIcon>
          <OnboardingTitle>Info about app</OnboardingTitle>
          <OnboardingText>yadayada!</OnboardingText>
          <PrimaryButton onPress={() => {
            this.props.dispatchSetView('AR')
          }}>
            <PrimaryText>Start</PrimaryText>
          </PrimaryButton>
        </Overlay>
      )
    }
  }

}

function selectProps(store) {
  return {
    view: store.ui.view,
    location: store.ui.location,
    beacons: store.beacons.beacons,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSetView: (view) => dispatch(setView(view)),
    dispatchSetLocation: (location) => dispatch(setLocation(location)),
    dispatchFetchBeacons: (location) => dispatch(fetchBeacons(location)),
    dispatchPostBeacons: (location) => dispatch(postBeacon(location)),
  }
}

export default connect(selectProps, mapDispatchToProps)(App);

const Wrapper = styled.View`
  flex: 1;
`;

const Overlay = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: 0.9;
  top: 8%;
  bottom: 8%;
  left: 4%;
  right: 4%;
  padding: 8%;
  border-radius: 32px;
`;

const Toolbar = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: 4%;
  left: 4%;
  right: 4%;
`;

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 10%;
`;

const SplashIcon = styled.Text`
  font-size: 96px;
  padding: 0 0 16px 0;
`;

const SplashTitle = styled.Text`
  text-align: center;
  font-size: 24px;
  color: black;
`;

const OnboardingTitle = styled.Text`
  text-align: center;
  font-size: 48px;
  color: black;
`;

const OnboardingText = styled.Text`
  padding: 32px 0 32px 0;
`;

const Button = styled.TouchableHighlight`
  margin: 8px 0 0 0;
  padding: 16px;
  border-radius: 8px;
`;

const PrimaryButton = styled(Button)`
  background-color: black;
`;

const PrimaryText = styled.Text`
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
`;

const SecondaryText = styled.Text`
  color: black;
`;
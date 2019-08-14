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
      <FullWrapper>
        <StatusBar hidden={true} />
        <SplashIcon>{icon}</SplashIcon>
        <SplashTitle>{text}</SplashTitle>
      </FullWrapper>
    );
  }

  _renderCharging() {
    if (!this.state.isPlugged) {
      return (
        <FullWrapper>
          <StatusBar hidden={true} />
          <SplashIcon>🎉</SplashIcon>
          <OnboardingTitle>Throwing a party?</OnboardingTitle>
          <OnboardingText>Connect your charger to share your location with others.</OnboardingText>
          <PrimaryButton onPress={() => this.props.dispatchSetView('AR')}>
            <PrimaryText>Go back</PrimaryText>
          </PrimaryButton>
        </FullWrapper>
      );
    } else if (this.state.isPlugged) {
      return (
        <FullWrapper>
          <StatusBar hidden={true} />
          <SplashIcon>⚡️</SplashIcon>
          <SplashTitle>Recharging your party!</SplashTitle>
        </FullWrapper>
      )
    }

  }

  _renderHUD() {
    return (
      <Toolbar>
        <SpecialButton onPress={() => this.props.dispatchSetView('CHARGING')}>
          <SpecialText>📍</SpecialText>
        </SpecialButton>
      </Toolbar>
    )
  }

  _renderOnboard() {
    if (this.props.view == 'ONBOARD_START') {
      return (
        <Overlay>
          <OverlayInner>
            <HeaderSection>
              <SplashIcon>👋</SplashIcon>
              <OnboardingTitle>Hi,</OnboardingTitle>
              <OnboardingText>Recharge your party is all about finding the place to be. We’ll help you locate and join exisiting party’s on the festival camping..</OnboardingText>
            </HeaderSection>
            <FooterSection>
              {
                this.props.beacons != null && this.props.location != null
                  ? (
                    <SecondaryButton onPress={() => this.props.dispatchSetView('AR')}>
                      <SecondaryText>Skip onboarding</SecondaryText>
                    </SecondaryButton>
                  ) : null
              }
              <PrimaryButton onPress={() => this.props.dispatchSetView('ONBOARD_GPS')}>
                <PrimaryText>Understood</PrimaryText>
              </PrimaryButton>
            </FooterSection>
          </OverlayInner>
        </Overlay>
      )
    } else if (this.props.view == 'ONBOARD_GPS') {
      return (
        <Overlay>
          <OverlayInner>
            <HeaderSection>
              <SplashIcon>📍</SplashIcon>
              <OnboardingTitle>Share your location</OnboardingTitle>
              <OnboardingText>To help you find those party’s we need your location. Also this helps us guide others to find your party! Just open this app and charge your phone. We’ll take care of the rest!</OnboardingText>
            </HeaderSection>
            <FooterSection>
              <PrimaryButton onPress={() => this.props.dispatchSetView('ONBOARD_AR')}>
                <PrimaryText>Agree</PrimaryText>
              </PrimaryButton>
            </FooterSection>
          </OverlayInner >
        </Overlay >
      )
    } else if (this.props.view == 'ONBOARD_AR') {
      return (
        <Overlay>
          <OverlayInner>
            <HeaderSection>
              <SplashIcon>👀</SplashIcon>
              <OnboardingTitle>Look around</OnboardingTitle>
              <OnboardingText>Using augmented reality we’ll help you navigate to different locations and activities. Good luck and enjoy the festival!</OnboardingText>
            </HeaderSection>
            <FooterSection>
              <PrimaryButton onPress={() => this.props.dispatchSetView('AR')}>
                <PrimaryText>Start the awesomeness</PrimaryText>
              </PrimaryButton>
            </FooterSection>
          </OverlayInner>
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

const FullWrapper = styled.View`
flex: 1;
justify-content: center;
align-items: center;
background-color: white;
padding: 10%;
`;

const Overlay = styled.View`
position: absolute;
height: 100%;
width: 100%;
justify-content: center;
align-items: center;
`;

const OverlayInner = styled.View`
justify-content: space-between;
width: 90%;
height: 80%;
border-radius: 32px;
background-color: white;
opacity: 0.9;
`;

const Section = styled.View`
width: 100%;
padding: 32px;
align-items: center;
`;

const HeaderSection = styled(Section)`
height: 65%;
justify-content: flex-end;
`;
const FooterSection = styled(Section)`
`;

const Toolbar = styled.View`
position: absolute;
justify-content: center;
align-items: center;
bottom: 4%;
left: 4%;
right: 4%;
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
text-align: left;
font-size: 32px;
color: black;
width: 100%;
padding: 16px 0 8px 0;
`;

const OnboardingText = styled.Text`
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

const SpecialButton = styled.TouchableHighlight`
background-color: white;
height: 64px;
width: 64px;
border-radius: 32px;
justify-content: center;
align-items: center;
`;

const SpecialText = styled.Text`
font-size: 32px;
`;
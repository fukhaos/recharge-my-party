'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { YellowBox } from 'react-native';
import haversine from 'haversine';
YellowBox.ignoreWarnings(['Warning:']);

import {
  ViroARScene,
  ViroNode,
  ViroAmbientLight,
  Viro3DObject,
  ViroConstants,
  ViroParticleEmitter,
  ViroAnimations,
  ViroMaterials,
  ViroText,
} from 'react-viro';
import RNSimpleCompass from 'react-native-simple-compass';


import { setLocation, } from './redux/actions';
import fetchBeacons from './redux/actions/fetchBeacons';

export default class ArScene extends Component {
  constructor() {
    super();

    this.state = {
      compass: null,
    };

    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.watchPosition(
      geolocation => {
        this.props.dispatchSetLocation({
          lat: geolocation.coords.latitude,
          long: geolocation.coords.longitude,
        });
        this.props.dispatchFetchBeacons({
          lat: geolocation.coords.latitude,
          long: geolocation.coords.longitude,
        });
      },
      error => console.log(error),
      { enableHighAccuracy: false, timeout: 2000, maximumAge: 1000 }
    )
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch();
  }

  render() {
    return (
      <ViroARScene
        ref="arscene"
        onTrackingUpdated={this._onTrackingUpdated}
      >
        <ViroNode
          rotation={[0, this.state.compass == null ? 0 : this.state.compass, 0]}
        >
          {
            this.props.beacons != null ? this.props.beacons.map(beacon => {
              if (beacon.distance < 2000) return (
                <ViroNode
                  key={beacon._id}
                  position={[beacon.mercPos.x, 0.5, beacon.mercPos.y]}
                >
                  <ViroText
                    text={beacon.name}
                    textAlign="center"
                    textAlignVertical="top"
                    textLineBreakMode="Justify"
                    color="#000"
                    width={2} height={2}
                    style={{ fontFamily: "Arial", fontSize: 50 }}
                    position={[0, 4, 1]}
                  />
                  <ViroAmbientLight color="#ffffff" />
                  <Viro3DObject
                    source={require('./res/thunder/ThunderObject.obj')}
                    resources={[require('./res/thunder/ThunderMaterial.mtl'), require('./res/thunder/ThunderBaked.png')]}
                    materials={["thunder"]}
                    scale={[1, 1, 1]}
                    position={[0, 4, 0]}
                    animation={{
                      name: 'loopRotate',
                      run: true,
                      loop: true
                    }}
                    type="OBJ"
                  />
                  <ViroParticleEmitter
                    key={"effect_sparks"}
                    position={[0, -3, 0]}
                    duration={5000}

                    visible={true}
                    delay={0}
                    run={true}
                    loop={true}
                    fixedToEmitter={true}

                    image={{
                      source: require("./res/particle_firework.png"),
                      height: 0.1,
                      width: 0.1,
                    }}

                    spawnBehavior={{
                      particleLifetime: [14000, 14000],
                      emissionRatePerSecond: [40, 70], // or 300 with a max of 2000
                      spawnVolume: { shape: "box", params: [2, 2, 2], spawnOnSurface: false },
                      maxParticles: 2000
                    }}
                    particleAppearance={{
                      opacity: {
                        initialRange: [0.0, 0.0],
                        factor: "Time",
                        interpolation: [
                          { endValue: 1.0, interval: [0, 500] },
                          { endValue: 0.0, interval: [13700, 14000] }
                        ]
                      },
                      scale: {
                        initialRange: [[1, 1, 1], [1, 1, 1]],
                        factor: "Time",
                        interpolation: [
                          { endValue: [1.5, 1.5, 1.5], interval: [4000, 9700] },
                          { endValue: [3, 3, 3], interval: [13700, 14000] }
                        ]
                      }

                    }}

                    particlePhysics={{
                      velocity: { initialRange: [[0, .7, 0], [0, .95, 0]] }
                    }}
                  />
                </ViroNode>
              )
            }) : (
                <ViroText
                  text="No beacons..."
                  textAlign="center"
                  textAlignVertical="top"
                  textLineBreakMode="Justify"
                  color="#000"
                  width={2} height={2}
                  style={{ fontFamily: "Arial", fontSize: 50 }}
                  position={[0, 2, 0]}
                />
              )
          }
        </ViroNode>
      </ViroARScene >
    );
  }

  _onTrackingUpdated(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      console.log('Tracking normal')
      if (this.state.compass == null) {
        RNSimpleCompass.start(3, (degree) => {
          this.setState({ compass: degree });
          RNSimpleCompass.stop();
        });
      }
    } else if (state == ViroConstants.TRACKING_NONE) {
      console.log('Tracking none')
    }
  }
}

ViroMaterials.createMaterials({
  thunder: {
    lightingModel: "Blinn",
    diffuseTexture: require('./res/thunder/ThunderBaked.png'),
    specularTexture: require('./res/thunder/ThunderBaked.png'),
  },
});

ViroAnimations.registerAnimations({
  loopRotate: { properties: { rotateY: "+=45" }, duration: 1000 },
});

function selectProps(store) {
  return {
    location: store.ui.location,
    beacons: store.beacons.beacons,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSetLocation: (location) => dispatch(setLocation(location)),
    dispatchFetchBeacons: (location) => dispatch(fetchBeacons(location)),
  }
}

module.exports = connect(selectProps, mapDispatchToProps)(ArScene);

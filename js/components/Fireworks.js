'use strict';

import React from 'react';
import { ViroParticleEmitter, ViroUtils } from 'react-viro';

export function getFireWorks() {
  var views = [];
  var radius = 3;
  let polarToCartesian = ViroUtils.polarToCartesian;

  var colors = ["#ff2d2d", "#42ff42", "#003fff", "#ffff00", "#ffb5f8", "#00ff1d", "#00edff", "#ffb14c", "#ff7cf4"];
  var f = new Array(30);
  f[1] = getFireWork(polarToCartesian([radius, -90, 30]), colors[1], 1000);
  f[2] = getFireWork(polarToCartesian([radius, -70, 20]), colors[1], 2000);
  f[3] = getFireWork(polarToCartesian([radius, -50, 32]), colors[2], 3000);
  f[4] = getFireWork(polarToCartesian([radius, -30, 28]), colors[4], 4000);
  f[9] = getFireWork(polarToCartesian([radius, -15, 20]), colors[5], 2000);
  f[5] = getFireWork(polarToCartesian([radius, 10, 24]), colors[5], 4500);
  f[6] = getFireWork(polarToCartesian([radius, 20, 20]), colors[7], 3000);
  f[7] = getFireWork(polarToCartesian([radius, 30, 40]), colors[7], 4000);
  f[8] = getFireWork(polarToCartesian([radius, 50, 35]), colors[2], 3000);
  f[10] = getFireWork(polarToCartesian([radius, 80, 10]), colors[5], 4500);

  f[11] = getFireWorkGravity(polarToCartesian([radius, -85, 20]), colors[7], 3000);
  f[12] = getFireWorkGravity(polarToCartesian([radius, -60, 42]), colors[0], 4800);
  f[13] = getFireWorkGravity(polarToCartesian([radius, -40, 10]), colors[3], 2600);
  f[14] = getFireWorkGravity(polarToCartesian([radius, -10, 15]), colors[5], 1500);
  f[16] = getFireWorkGravity(polarToCartesian([radius, -5, 20]), colors[3], 300);
  f[15] = getFireWorkGravity(polarToCartesian([radius, 5, 20]), colors[6], 3000);
  f[29] = getFireWorkGravity(polarToCartesian([radius, 12, 15]), colors[6], 1300);
  f[17] = getFireWorkGravity(polarToCartesian([radius, 30, 40]), colors[3], 2200);
  f[18] = getFireWorkGravity(polarToCartesian([radius, 45, 25]), colors[3], 1500);
  f[19] = getFireWorkGravity(polarToCartesian([radius, 85, 36]), colors[3], 3500);

  f[20] = getFireWorkBrightDarkBright(polarToCartesian([radius, -80, 30]), colors[0], colors[3], 2340);
  f[21] = getFireWorkBrightDarkBright(polarToCartesian([radius, -50, 40]), colors[1], colors[4], 0);
  f[22] = getFireWorkBrightDarkBright(polarToCartesian([radius, -25, 20]), colors[2], colors[5], 800);
  f[23] = getFireWorkBrightDarkBright(polarToCartesian([radius, -15, 33]), colors[3], colors[7], 2000);
  f[24] = getFireWorkBrightDarkBright(polarToCartesian([radius, 8, 40]), colors[4], colors[6], 1200);
  f[25] = getFireWorkBrightDarkBright(polarToCartesian([radius, 10, 20]), colors[4], colors[6], 1800);
  f[26] = getFireWorkBrightDarkBright(polarToCartesian([radius, 35, 33]), colors[4], colors[6], 200);
  f[27] = getFireWorkBrightDarkBright(polarToCartesian([radius, 65, 40]), colors[4], colors[6], 3720);
  f[28] = getFireWorkBrightDarkBright(polarToCartesian([radius, 90, 25]), colors[4], colors[6], 1020);

  var i = 0;
  for (i = 0; i < f.length; i++) {
    views.push(f[i]);
  }
  return views;
}

function getFireWork(position, color, delay) {
  var viroFireworkColors = ["#ff2d2d", "#42ff42", "#00edff", "#ffff00", "#ffb5f8", "#00ff1d", "#00edff", "#ffb14c", "#ff7cf4"];
  var colorRand = viroFireworkColors[Math.floor((Math.random() * 5) + 0)];
  return ((
    <ViroParticleEmitter
      key={"effect_fireworks"}
      position={position}
      duration={5000}
      visible={true}
      run={true}
      loop={true}
      fixedToEmitter={true}

      image={{
        source: require("../res/particle_firework.png"),
        height: 0.02,
        width: 0.02,
      }}

      spawnBehavior={{
        particleLifetime: [1400, 1500],
        emissionRatePerSecond: [0, 0],
        emissionBurst: [
          { time: delay, min: 500, max: 500, cycles: 10, cooldownPeriod: 2300 }
        ],
        spawnVolume: { shape: "sphere", params: [0.15], spawnOnSurface: true },
        maxParticles: 800
      }}

      particleAppearance={{
        opacity: {
          initialRange: [1.0, 1.0],
          factor: "Time",
          interpolation: [
            { endValue: 0.5, interval: [0, 1000] },
            { endValue: 0.0, interval: [1000, 1500] }
          ]
        },

        color: {
          initialRange: [color, colorRand],
          factor: "Time",
          interpolation: [
            { endValue: color, interval: [600, 1500] }
          ]
        }
      }}

      particlePhysics={{
        explosiveImpulse: { impulse: 0.12, position: [0, 0, 0], decelerationPeriod: 1.0 },
      }}
    />
  ));
}

function getFireWorkBrightDarkBright(position, color, color2, delay) {
  var viroFireworkColors = ["#ff2d2d", "#42ff42", "#00edff", "#ffff00", "#ffb5f8", "#00ff1d", "#00edff", "#ffb14c", "#ff7cf4"];
  var colorRand = viroFireworkColors[Math.floor((Math.random() * 5) + 0)];

  return ((
    <ViroParticleEmitter
      key={"getFireWorkBrightDarkBright"}
      position={position}
      duration={5000}
      visible={true}
      run={true}
      loop={true}
      fixedToEmitter={true}

      image={{
        source: require("../res/particle_firework.png"),                 // Image source of the image particle.
        height: 0.02,
        width: 0.02,
      }}

      spawnBehavior={{
        particleLifetime: [1200, 1200],
        emissionRatePerSecond: [0, 0],
        emissionBurst: [
          { time: delay, min: 500, max: 500, cycles: 10, cooldownPeriod: 2500 }
        ],
        spawnVolume: { shape: "sphere", params: [0.15], spawnOnSurface: true },
        maxParticles: 800
      }}

      particleAppearance={{
        opacity: {
          initialRange: [1.0, 1.0],
          factor: "Time",
          interpolation: [
            { endValue: 1.0, interval: [0, 350] },
            { endValue: 0.0, interval: [350, 500] },
            { endValue: 1.0, interval: [600, 1000] },
            { endValue: 0.0, interval: [1000, 1200] }
          ]
        },

        color: {
          initialRange: [color, colorRand],
          factor: "Time",
          interpolation: [
            { endValue: color, interval: [0, 500] },
            { endValue: color2, interval: [500, 600] },
            { endValue: color2, interval: [600, 1200] },
          ]
        }
      }}

      particlePhysics={{
        explosiveImpulse: { impulse: 0.10, position: [0, 0, 0], decelerationPeriod: 1.2 },
      }}
    />
  ));
}

function getFireWorkGravity(position, color, delay) {
  var viroFireworkColors = ["#ff2d2d", "#42ff42", "#00edff", "#ffff00", "#ffb5f8", "#00ff1d", "#00edff", "#ffb14c", "#ff7cf4"];
  var colorRand1 = viroFireworkColors[Math.floor((Math.random() * 5) + 0)];
  var colorRand2 = viroFireworkColors[Math.floor((Math.random() * 5) + 0)];

  return ((
    <ViroParticleEmitter
      key={"getFireWorkGravity"}
      position={position}
      duration={5000}
      visible={true}
      run={true}
      loop={true}
      fixedToEmitter={true}

      image={{
        source: require("../res/particle_firework.png"),
        height: 0.02,
        width: 0.02,
      }}

      spawnBehavior={{
        particleLifetime: [600, 600],
        emissionRatePerSecond: [0, 0],
        emissionBurst: [
          { time: delay, min: 400, max: 500, cycles: 2, cooldownPeriod: 2050 }
        ],
        spawnVolume: { shape: "sphere", params: [0.15], spawnOnSurface: true },
        maxParticles: 800
      }}

      particleAppearance={{
        opacity: {
          initialRange: [1.0, 1.0],
          factor: "Time",
          interpolation: [
            { endValue: 0.0, interval: [0, 600] }
          ]
        },

        color: {
          initialRange: [color, colorRand2],
          factor: "Time",
          interpolation: [
            { endValue: color, interval: [0, 300] },
            { endValue: colorRand1, interval: [300, 400] },
            { endValue: colorRand2, interval: [4000, 600] }
          ]
        }
      }}

      particlePhysics={{
        explosiveImpulse: { impulse: 0.1, position: [0, 0, 0] },
        acceleration: { initialRange: [[0, -1.41, 0], [0, -1.41, 0]] }
      }}
    />
  ));
}
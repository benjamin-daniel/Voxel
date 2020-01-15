import React from "react";
import { PanResponder, View, Dimensions } from "react-native";
import { AR } from "expo";
import { GraphicsView } from "expo-graphics";
import ExpoTHREE, { THREE } from "expo-three";

// import {
//   OrbitControls
// } from "three";
import OrbitControls from "three/examples/jsm/controls/OrbitControls";
import GestureType from "./js/GestureType";
import Player from "./js/Player";
import Physics from "./js/Physics";

import Sky from "./js/SkyShader";
// import Dpad from "./Dpad";
import World from "./js/World";

const screen = Dimensions.get("screen");

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "0x";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return parseInt(color.toString(16), 16);
}
const worldSize = 200;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.setupCamera();
    this.world = new World(worldSize, worldSize);
    this.physics = new Physics(this.world);
    this.scene = new THREE.Scene();

    console.log('position: ',this.scene.position);
    // const { controls } = this;
    this.controls = new Player(this.camera, this.physics, this.scene);
    // this.controls.movementSpeed = 10;
    // this.controls.lookSpeed = 0.3;
    // this.controls.lookVertical = true;
    // this.controls.constrainVertical = false;
    // this.controls.verticalMin = 1.1;
    // this.controls.verticalMax = 2.2;

    this.controls.setPosition(
      new THREE.Vector3(100, this.world.getY(100, 100) + 10, 100)
    );
    const touchesBegan = (event, gestureState) => {
      // console.log({ event });
      this.controls.onGesture(event, gestureState, GestureType.began);
    };

    const touchesMoved = (event, gestureState) => {
      // console.log({ event });
      this.controls.onGesture(event, gestureState, GestureType.moved);
    };

    const touchesEnded = (event, gestureState) => {
      // console.log({ event });
      this.controls.onGesture(event, gestureState, GestureType.ended);
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: touchesBegan,
      onPanResponderMove: touchesMoved,
      onPanResponderRelease: touchesEnded,
      onPanResponderTerminate: touchesEnded, //cancel
      onShouldBlockNativeResponder: () => false
    });
  }
  componentWillMount() {
    THREE.suppressExpoWarnings();
  }

  render() {
    return (
      <View
        style={{ backgroundColor: "white", flex: 1 }}
        {...this.panResponder.panHandlers}
      >
        <GraphicsView
          // isArEnabled
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
        />
      </View>
    );
  }
  setupCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      screen.width / screen.height,
      0.1,
      1000
    );
  };

  onContextCreate = ({
    // Web: const gl = canvas.getContext('webgl')
    gl,
    width,
    height,
    scale
  }) => {
    // Renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      width,
      height,
      pixelRatio: scale,
      antialias: true
    });
    // var renderer = new THREE.WebGLRenderer();

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    // let controls = new OrbitControls(this.camera, width, height);
    // controls.enableZoom = true
    // console.log({ controls });
    const materialArray = [];
    for (let i = 0; i < 6; i++) {
      materialArray.push(
        new THREE.MeshBasicMaterial({ color: getRandomColor() })
      );
    }
    // console.log({ materialArray });
    var material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    material.side = THREE.BackSide;
    var cube = new THREE.Mesh(geometry, materialArray);
    this.scene.add(cube);
    this.camera.position.z = 4;

    var animate = function() {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      // this.renderer.render(this.scene, this.camera);
    };

    animate();
  };

  onRender = () => {
    this.renderer.render(this.scene, this.camera);
  };
}

const screenCenter = new THREE.Vector2(0.5, 0.5);

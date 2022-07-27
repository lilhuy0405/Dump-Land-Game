import * as Phaser from "phaser";
import MapScene from "./scenes/MapScene.js";

export default class MyGame extends Phaser.Game {
  constructor() {
    const config = {
      type: Phaser.WEBGL,
      width: 800,
      height: 480,
      backgroundColor: '#111',
      pixelArt: true,
      scene: [
        MapScene,
      ],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: {x: 0, y: 0, z: 0}
        }
      }
    };
    super(config);
  }
}
new MyGame();



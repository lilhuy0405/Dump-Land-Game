import * as Phaser from "phaser";
import MapScene from "./scenes/MapScene.js";
import BootScene from "./scenes/BootScene.js";

export default class MyGame extends Phaser.Game {
  constructor() {
    const config = {
      type: Phaser.WEBGL,
      width: 800,
      height: 480,
      backgroundColor: '#111',
      pixelArt: true,
      scene: [
        BootScene,
        MapScene,
      ],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: {y: 300},
        }
      }
    };
    super(config);
  }
}
new MyGame();



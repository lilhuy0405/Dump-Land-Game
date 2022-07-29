import Phaser from "phaser";
import {FRUIT_COLLECTED, FRUITS, PLAYERS} from "../configs/assets.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }
  preload() {
    //TODO: config key path in a config file
    this.load.image('terrain-tiles', '/assets/maps/Terrain16x16.png');
    this.load.image('bg-tiles', '/assets/maps/Yellow.png');
    this.load.tilemapTiledJSON('map', '/assets/maps/map1.json');
    this.load.image('bg1', '/assets/maps/bg1.png');

    //load player sprite sheet
    PLAYERS.forEach(player => {
      player.spriteSheets.map(spriteSheet => {
        this.load.spritesheet(`${player.name}-${spriteSheet.key}`,
          spriteSheet.path, {
            frameWidth: spriteSheet.frameConfig.frameWidth,
            frameHeight: spriteSheet.frameConfig.frameHeight
          })
      })
    })
    //load fruit sprite sheet
    FRUITS.forEach(fruit => {
      this.load.spritesheet(fruit.key, fruit.path, {
        frameWidth: fruit.frameConfig.frameWidth,
        frameHeight: fruit.frameConfig.frameHeight
      })
    })
    //load fruit collected sprite sheet
    this.load.spritesheet(FRUIT_COLLECTED.key, FRUIT_COLLECTED.path, {
      frameWidth: FRUIT_COLLECTED.frameConfig.frameWidth,
      frameHeight: FRUIT_COLLECTED.frameConfig.frameHeight
    })
  }

  create(){
    this.scene.start("MapScene");
  }
}
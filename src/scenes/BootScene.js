import Phaser from "phaser";
import {PLAYERS} from "../configs/assets.js";

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
        console.log(`${player.name}-${spriteSheet.key}`)
        this.load.spritesheet(`${player.name}-${spriteSheet.key}`,
          spriteSheet.path, {
            frameWidth: spriteSheet.frameConfig.frameWidth,
            frameHeight: spriteSheet.frameConfig.frameHeight
          })
      })
    })
  }

  create(){
    this.scene.start("MapScene");
  }
}
import Phaser from "phaser";
import {FRUIT_COLLECTED, FRUITS, MAP_BG_IMAGES, MAP_TILE_SETS, MAPS, PLAYERS} from "../configs/assets.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    //TODO: config key path in a config file
    MAP_TILE_SETS.forEach(mapTileSet => {
      this.load.image(mapTileSet.key, mapTileSet.path);
    })
    MAPS.forEach(map => {
      this.load.tilemapTiledJSON(map.key, map.path);
    })
    MAP_BG_IMAGES.forEach(mapBgImage => {
      this.load.image(mapBgImage.key, mapBgImage.path);
    })

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

  create() {
    this.scene.start("MapScene");
  }
}
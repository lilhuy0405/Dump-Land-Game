import Phaser from "phaser";
import {
  CHECKPOINT_SPRITES,
  FRUIT_COLLECTED,
  FRUITS,
  MAP_BG_IMAGES,
  MAP_TILE_SETS,
  MAPS,
  PLAYER_APPEAR, PLAYER_DISAPPEAR,
  PLAYERS
} from "../configs/assets.js";

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
    this.load.spritesheet(PLAYER_APPEAR.key, PLAYER_APPEAR.path, {
      frameWidth: PLAYER_APPEAR.frameConfig.frameWidth,
      frameHeight: PLAYER_APPEAR.frameConfig.frameHeight
    })
    this.load.spritesheet(PLAYER_DISAPPEAR.key, PLAYER_DISAPPEAR.path, {
      frameWidth: PLAYER_DISAPPEAR.frameConfig.frameWidth,
      frameHeight: PLAYER_DISAPPEAR.frameConfig.frameHeight
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
    //load checkpoint sprite sheet
    CHECKPOINT_SPRITES.forEach(checkpoint => {
      this.load.spritesheet(checkpoint.key, checkpoint.path, {
        frameWidth: checkpoint.frameConfig.frameWidth,
        frameHeight: checkpoint.frameConfig.frameHeight
      })
    })
  }

  create() {
    this.scene.start("MapScene");
  }
}
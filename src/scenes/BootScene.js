import Phaser from "phaser";
import {
  BOXES,
  CHECKPOINT_SPRITES,
  FRUIT_COLLECTED,
  FRUITS,
  MAP_BG_IMAGES,
  MAP_TILE_SETS,
  MAPS,
  PLAYER_APPEAR, PLAYER_DISAPPEAR,
  PLAYERS, TRAMPOLINE
} from "../configs/assets.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {

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

    //load boxes
    BOXES.forEach(box => {
      box.spriteSheet.map(spriteSheet => {
        this.load.spritesheet(`${box.key}-${spriteSheet.key}`,
          spriteSheet.path, {
            frameWidth: spriteSheet.frameConfig.frameWidth,
            frameHeight: spriteSheet.frameConfig.frameHeight
          })
      })
    })
    //load traps
    TRAMPOLINE.spriteSheets.map(spriteSheet => {
      this.load.spritesheet(`${TRAMPOLINE.key}-${spriteSheet.key}`,
        spriteSheet.path, {
          frameWidth: spriteSheet.frameConfig.frameWidth,
          frameHeight: spriteSheet.frameConfig.frameHeight
        })
    })

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  create() {
    this.scene.start("MainMenuScene");
  }
}
import Phaser from "phaser";
import {CHECKPOINT_SPRITES} from "../configs/assets.js";

export default class CheckPointSprite extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, checkPointData, x, y) {
    super(scene, x, y);
    this.setTexture(CHECKPOINT_SPRITES.key);
    this.checkPointData = checkPointData;
    this.from = checkPointData.from;
    this.to = checkPointData.to;
    this.setOrigin(0, 0)
    this.setScale(1)
    this.isShown = false;


    this.createAnimation();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.scene.physics.overlap(this, this.scene.player, () => {
      this.scene.cameras.main.fadeOut(0, 0, 0, 0, (camera, progress) => {
        if (progress === 1) {
          //build new map
          // this.physics.pause();
          this.scene.map = this.scene.buildMap(this.to);
          this.scene.cameras.main.fadeIn(2000, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
              // this.physics.resume();
            }
          })
        }
      })
    })
  }

  show() {
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.collideWorldBounds = true
    this.setBounce(0.2);
    this.body.setGravityY(300)
    //collision
    if (this.scene.collisionLayer) {
      this.scene.physics.add.collider(this, this.scene.collisionLayer);
    }
    this.isShown = true;
  }

  createAnimation() {


    CHECKPOINT_SPRITES.forEach(spriteSheet => {
      this.scene.anims.create({
        key: spriteSheet.key,
        frames: this.scene.anims.generateFrameNumbers(spriteSheet.key, {
          start: 0,
          end: spriteSheet.frameConfig.frameRate - 1
        }),
        frameRate: spriteSheet.frameConfig.frameRate,
        repeat: spriteSheet.frameConfig.repeat,

      })
    })

    this.anims.play(CHECKPOINT_SPRITES[0].key, true).once('animationcomplete', () => {
      this.anims.play(CHECKPOINT_SPRITES[1].key, true)
    });


  }

}
import Phaser from "phaser";
import {FRUIT_COLLECTED} from "../configs/assets.js";

export default class FruitSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, fruit, x, y) {
    super(scene, x, y);
    this.fruitData = fruit
    this.collectedAnimationTime = 200
    this.setTexture(fruit.key);
    this.setPosition(x, y);
    this.setOrigin(0, 0)
    this.setScale(1)
    this.createAnimation();
    this.scene.add.existing(this);
    //enable body
    this.scene.physics.world.enable(this);
    this.body.collideWorldBounds = true
    this.body.allowGravity = false
    //overlap with player

  }

  createAnimation() {

    if (!this.scene.anims.exists(this.fruitData.key)) {
      this.scene.anims.create({
        key: `${this.fruitData.key}`,
        frames: this.scene.anims.generateFrameNumbers(this.fruitData.key, {
          start: 0,
          end: this.fruitData.frameConfig.frameRate - 1
        }),
        frameRate: this.fruitData.frameConfig.frameRate,
        repeat: -1,
      })
    }
    if (!this.scene.anims.exists(FRUIT_COLLECTED.key)) {
      this.scene.anims.create({
        key: FRUIT_COLLECTED.key,
        frames: this.scene.anims.generateFrameNumbers(FRUIT_COLLECTED.key, {
          start: 0,
          end: FRUIT_COLLECTED.frameConfig.frameRate - 1
        }),
        duration: this.collectedAnimationTime,
        repeat: 1,
        hideOnComplete: true
      })
    }

    this.anims.play(`${this.fruitData.key}`, true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.scene.physics.overlap(this, this.scene.player, () => {
      this.onOverlapWithPlayer();
    });
  }

  onOverlapWithPlayer() {
    this.anims.play(FRUIT_COLLECTED.key, true);
    const x = setTimeout(() => {
      this.disableBody(true, true);
      clearInterval(x);
    }, this.collectedAnimationTime)
  }
}
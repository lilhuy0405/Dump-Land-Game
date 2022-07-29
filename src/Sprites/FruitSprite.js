import Phaser from "phaser";
import {FRUIT_COLLECTED} from "../configs/assets.js";

export default class FruitSprite extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, fruit, x, y) {
    super(scene, x, y);
    this.data = fruit
    this.setTexture(fruit.key);
    this.setPosition(x, y);
    this.setOrigin(0, 0.5)
    this.setScale(1)
    this.createAnimation();
    this.scene.add.existing(this);
  }
  createAnimation() {

    if(!this.scene.anims.exists(this.data.key)) {
      this.scene.anims.create({
        key: `${this.data.key}`,
        frames: this.scene.anims.generateFrameNumbers(this.data.key, {
          start: 0,
          end: this.data.frameConfig.frameRate - 1
        }),
        frameRate: this.data.frameConfig.frameRate,
        repeat: -1,
      })
    }
    if(!this.scene.anims.exists(FRUIT_COLLECTED.key)) {
      this.scene.anims.create({
        key: FRUIT_COLLECTED.key,
        frames: this.scene.anims.generateFrameNumbers(FRUIT_COLLECTED.key, {
          start: 0,
          end: FRUIT_COLLECTED.frameConfig.frameRate - 1
        }),
        duration: 200,
        repeat: 1,
        hideOnComplete: true
      })
    }

    this.anims.play(`${this.data.key}`, true);
  }
}
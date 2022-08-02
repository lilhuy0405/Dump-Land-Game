import Phaser from "phaser";
import FruitSprite from "./FruitSprite.js";
import {FRUITS} from "../configs/assets.js";

export default class BoxSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, spriteConfig, x, y) {
    super(scene, x, y);
    this.setTexture(`${spriteConfig.key}-${spriteConfig.spriteSheet[0].key}`);
    this.boxData = spriteConfig
    this.key = spriteConfig.key
    this.hitPoint = spriteConfig.hitPoint
    this.fruitKey = spriteConfig.fruit
    this.fruit = null
    this.isBroken = false;
    this.setPosition(x, y);
    this.setOrigin(0, 0)
    this.setScale(1)
    // enable physics
    this.scene.add.existing(this);
    this.createAnimation();
    this.isHited = false;
  }

  onHit() {
    console.log(this.isHited)
    if (!this.isHited) {
      console.log(this.hitPoint)
      this.isHited = true;
      this.anims.play(`${this.key}-${this.boxData.spriteSheet[2].key}`, true).on('animationcomplete', () => {
        this.hitPoint--;
        // this.isHited = false;
        if (this.hitPoint === 0) {
          this.anims.play(`${this.key}-${this.boxData.spriteSheet[0].key}`, true).on('animationcomplete', () => {
            this._onBreak();
          })
        }
      });
    }


  }

  _onBreak() {
    this.visible = false;
    this.body.enable = false;
    this.isBroken = true;
    const fruitData = FRUITS.find(fruit => fruit.key === this.fruitKey);
    this.fruit = new FruitSprite(this.scene, fruitData, this.x, this.y - 7)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
    if (distanceToPlayer > 40) {
      this.isHited = false;
    }
  }

  createAnimation() {
    this.boxData.spriteSheet.forEach(spriteSheet => {
      this.scene.anims.create({
        key: `${this.key}-${spriteSheet.key}`,
        frames: this.scene.anims.generateFrameNumbers(`${this.key}-${spriteSheet.key}`, {
          start: 0,
          end: spriteSheet.frameConfig.frameRate - 1
        }),
        duration: 300,
        repeat: spriteSheet.frameConfig.repeat,
      });
    })
    this.anims.play(`${this.key}-${this.boxData.spriteSheet[1].key}`, true);
  }
}
import Phaser from "phaser";
import DustParticle from "./DustParticle.js";

export default class FanSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, config, x, y) {
    super(scene, x, y);
    this.config = config;
    this.key = config.key
    this.setTexture(`${this.config.key}-${this.config.spriteSheets[0].key}`);
    this.setPosition(x, y);
    this.setOrigin(0, 0)
    this.setScale(this.scene.tileScale);
    this.isTurnedOn = false;
    //direction

    switch (this.config.direction) {
      case "left":
        this.setFlipX(true);
        break;
      case "right":
        this.setFlipX(false);
        break;
      case "up":
        this.setFlipY(false);
        break;
      case "down":
        this.setFlipY(true);
        break;
    }
    // enable physics
    console.log(this.config.order);
    this.scene.add.existing(this);
    this.createAnimation();
    //set interval to turn on fan
    this.fanInterval = 10_000;
    this._sleep(this.config.order * this.fanInterval / 2).then(() => {
      this.interval = setInterval(() => {
        this.turnOn();
      }, this.fanInterval);
    })

  }

  createAnimation() {
    this.config.spriteSheets.forEach(spriteSheet => {
      if (!this.scene.anims.exists(`${this.key}-${spriteSheet.key}`)) {
        this.scene.anims.create({
          key: `${this.key}-${spriteSheet.key}`,
          frames: this.scene.anims.generateFrameNumbers(`${this.key}-${spriteSheet.key}`, {
            start: 0,
            end: spriteSheet.frameConfig.frameRate - 1
          }),
          duration: spriteSheet.frameConfig.duration,
          repeat: spriteSheet.frameConfig.repeat,
        });
      }
    })
    this.anims.play(`${this.key}-${this.config.spriteSheets[0].key}`, true);
  }

  onHit() {
    // this.turnOn();
  }

  turnOn() {
    if (this.isTurnedOn) {
      return
    }
    console.log("turn on fan");
    //turn on fan in 5s then turn off
    this.isTurnedOn = true;

    this._sleep(this.fanInterval / 2).then(() => {
      console.log("turn off fan");
      this.isTurnedOn = false;
    })
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.isTurnedOn) {
      this.anims.play(`${this.key}-${this.config.spriteSheets[1].key}`, true)
      new DustParticle(this.scene, this)
    } else {
      this.anims.play(`${this.key}-${this.config.spriteSheets[0].key}`, true)
    }
  }

  removeInterval() {
    clearInterval(this.interval);
  }
}
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
    this.speed = 15;
    this.fanDistance = 600;
    this.dusts = this.scene.add.group();
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
    this.scene.add.existing(this);
    this.createAnimation();
    //set interval to turn on fan
    this.fanInterval = 6_000;
    this._sleep(this.config.order * this.fanInterval / 2).then(() => {
      this.turnOn();
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
      this.scene.player.isPushed.right = false;
    })
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.isTurnedOn) {
      this.anims.play(`${this.key}-${this.config.spriteSheets[1].key}`, true)
      this.dusts.add(new DustParticle(this.scene, this))
    } else {
      this.anims.play(`${this.key}-${this.config.spriteSheets[0].key}`, true)
    }
    if (this.isTurnedOn) {
      switch (this.config.direction) {
        case "left":
          if (this.scene.player.y > this.y
            && this.scene.player.y < this.y + this.height * this.scene.tileScale
            && this.scene.player.x > this.x - this.fanDistance
          ) {
            this.scene.player.isPushed.left = true;
            this.scene.player.body.velocity.x += this.speed * -1;
            this.scene.player.body.velocity.y += this.speed / 2 * -1;
          } else {
            this.scene.player.isPushed.left = false;
          }
          break;
        case "right":
          if (this.scene.player.y > this.y
            && this.scene.player.y < this.y + this.height * this.scene.tileScale
            && this.scene.player.x < this.x + this.fanDistance
          ) {
            this.scene.player.isPushed.right = true;
            this.scene.player.body.velocity.x += this.speed;
            this.scene.player.body.velocity.y += this.speed / 2 * -1;
          } else {
            this.scene.player.isPushed.right = false;
          }
          break;
        case"up":
          if (this.scene.player.x >= this.x && this.scene.player.x <= this.x + this.width * this.scene.tileScale) {
            this.scene.player.body.velocity.y += this.speed * -1;
          }
          break;
        case"down":
          if (this.scene.player.x >= this.x && this.scene.player.x <= this.x + this.width * this.scene.tileScale) {
            this.scene.player.body.velocity.y += this.speed;
          }
          break;
        default:
          break;
      }
    }
  }

  destroyFan() {
    this.dusts.clear(true, true);
    //clear all timeout
    let id = window.setTimeout(function () {
    }, 0);
    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
    //clear interval
    // Get a reference to the last interval + 1
    const interval_id = window.setInterval(function () {
    }, Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
  }
}
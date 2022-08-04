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
    this.anims.play(`${this.key}-${this.config.spriteSheets[1].key}`, true);
  }

  onHit() {
    this.onOpen();
  }
  onOpen() {
    //random postion of the dust particles
    // const randomX = Phaser.Math.Between(this.x, this.x + this.width * this.scene.tileScale);
    new DustParticle(this.scene, this);
  }
}
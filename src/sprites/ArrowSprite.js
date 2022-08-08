import Phaser from "phaser";
import {ARROW} from "../configs/assets.js";

export default class ArrowSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.key = ARROW.key;
    this.setTexture(`${this.key}-${ARROW.spriteSheets[0].key}`);
    this.setPosition(x, y);
    this.setOrigin(0, 0)
    this.pushUp = 350;
    this.isOverlapped = false;
    //set fruit same size as tile size
    this.setScale(this.scene.tileScale);
    this.createAnimation();
    this.scene.add.existing(this);
    //enable body
    this.scene.physics.world.enable(this);
    this.body.collideWorldBounds = true
    this.body.allowGravity = false
    //overlap with player
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.scene.physics.overlap(this, this.scene.player, () => {
      this.onOverlapWithPlayer();
    });
  }

  onOverlapWithPlayer() {
    this.scene.player.body.velocity.y = this.pushUp * -1;
    this.scene.player.anims.play('double-jump', true);
    this.anims.play(`${this.key}-${ARROW.spriteSheets[1].key}`, true).on("animationcomplete", () => {
      this.anims.play(`${this.key}-${ARROW.spriteSheets[0].key}`, true);
    });
  }

  createAnimation() {
    ARROW.spriteSheets.forEach(spriteSheet => {
      if (!this.scene.anims.exists(`${this.key}-${spriteSheet.key}`)) {
        this.scene.anims.create({
          key: `${this.key}-${spriteSheet.key}`,
          frames: this.scene.anims.generateFrameNumbers(`${this.key}-${spriteSheet.key}`, {
            start: 0,
            end: spriteSheet.frameConfig.frameRate - 1
          }),
          frameRate: spriteSheet.frameConfig.frameRate,
          repeat: spriteSheet.frameConfig.repeat,
          duration: spriteSheet.frameConfig.duration,
        })
      }
    })
    this.anims.play(`${this.key}-${ARROW.spriteSheets[0].key}`, true);
  }
}
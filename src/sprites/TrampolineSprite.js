import Phaser from "phaser";
import {TRAMPOLINE} from "../configs/assets.js";

export default class TrampolineSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.setTexture(`${TRAMPOLINE.key}-${TRAMPOLINE.spriteSheets[0].key}`);
    this.trampolineData = TRAMPOLINE;
    this.trampolineData.jumpHeight = 600;
    this.key = TRAMPOLINE.key;
    this.setPosition(x, y);
    this.setOrigin(0, 0);
    this.setScale(1);
    // enable physics
    this.scene.add.existing(this);
    this.createAnimation();

  }

  onPlayerJumpInto() {
    const isCollideUp = (!this.scene.player.body.blocked.right && !this.scene.player.body.blocked.left) && this.scene.player.body.blocked.down
    if (!isCollideUp) return
    this.scene.player.body.setVelocityY(-this.trampolineData.jumpHeight);
  }


  createAnimation() {
    this.trampolineData.spriteSheets.forEach(spriteSheet => {
        if (!this.scene.anims.exists(`${this.key}-${spriteSheet.key}`)) {
          this.anims.create({
            key: `${this.key}-${spriteSheet.key}`,
            frames: this.scene.anims.generateFrameNumbers(`${this.key}-${spriteSheet.key}`, {
                start: 0,
                end: spriteSheet.frameConfig.frameRate - 1
              }
            ),
            frameRate: spriteSheet.frameConfig.frameRate,
            repeat: spriteSheet.frameConfig.repeat,
          });
        }
      }
    );
    this.anims.play(`${this.key}-${this.trampolineData.spriteSheets[1].key}`, true);

  }
}
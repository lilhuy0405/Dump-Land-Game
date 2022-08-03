import Phaser from "phaser";
import {BLOCK, TRAMPOLINE} from "../configs/assets.js";

export default class BlockSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.setTexture(`${BLOCK.key}-${BLOCK.spriteSheets[0].key}`);
    this.blockData = BLOCK;
    this.key = BLOCK.key;
    this.isHit = false;
    this.isBroken = false;
    this.setPosition(x, y);
    this.setOrigin(0, 0);
    //set block equal to tile size
    const originalWidth = this.blockData.spriteSheets[0].frameConfig.frameWidth;

    const tileWidth = this.scene.tileHWidth * this.scene.tileScale;
    this.setScale(tileWidth / originalWidth);
    // enable physics
    this.scene.add.existing(this);
    this.createAnimation();

  }

  onHit() {
    if (this.isHit) {
      return
    }
    this.isHit = true;
    const isHitVertical = (this.scene.player.body.blocked.down || this.scene.player.body.blocked.up) &&
      (!this.scene.player.body.blocked.left && !this.scene.player.body.blocked.right);
    const isHitHorizontal = (this.scene.player.body.blocked.left || this.scene.player.body.blocked.right) && (
      !this.scene.player.body.blocked.down && !this.scene.player.body.blocked.up
    )
    let animationKey = "";
    if (isHitVertical) {
      animationKey = `${this.key}-${this.blockData.spriteSheets[2].key}`;
    } else if (isHitHorizontal) {
      animationKey = `${this.key}-${this.blockData.spriteSheets[1].key}`;
    }
    this.anims.play(animationKey, true).once("animationcomplete", () => {
      this._break();
    });
  }

  createAnimation() {
    this.blockData.spriteSheets.forEach(spriteSheet => {
        this.anims.create({
          key: `${this.key}-${spriteSheet.key}`,
          frames: this.scene.anims.generateFrameNumbers(`${this.key}-${spriteSheet.key}`, {
              start: 0,
              end: spriteSheet.frameConfig.frameRate - 1
            }
          ),
          duration: spriteSheet.frameConfig.duration,
          repeat: spriteSheet.frameConfig.repeat,
        });
      }
    );
    this.anims.play(`${this.key}-${this.blockData.spriteSheets[0].key}`, true);

  }

  _break() {
    this.visible = false;
    this.body.enable = false;
    this._sleep(4000).then(() => {
      this.isHit = false;
      this.visible = true;
      this.body.enable = true;
      this.anims.play(`${this.key}-${this.blockData.spriteSheets[3].key}`, true).once("animationcomplete", () => {
        this.anims.play(`${this.key}-${this.blockData.spriteSheets[0].key}`, true)
      });
    })
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
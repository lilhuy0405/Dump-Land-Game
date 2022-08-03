import Phaser from "phaser";
import {BLOCK, TRAMPOLINE} from "../configs/assets.js";

export default class BlockSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.setTexture(`${BLOCK.key}-${BLOCK.spriteSheets[0].key}`);
    this.blockData = BLOCK;
    this.key = BLOCK.key;
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
          frameRate: spriteSheet.frameConfig.frameRate,
          repeat: spriteSheet.frameConfig.repeat,
        });
      }
    );
    this.anims.play(`${this.key}-${this.blockData.spriteSheets[0].key}`, true);

  }
}
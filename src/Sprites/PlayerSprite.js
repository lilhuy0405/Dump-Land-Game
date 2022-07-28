import * as Phaser from "phaser";

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, spriteConfig, x, y) {
    super(scene, x, y);
    this.setTexture(`${spriteConfig.name}-${spriteConfig.spriteSheets[0].key}`);
    this.data = spriteConfig
    this.name = spriteConfig.name;

    this.setPosition(x, y);
    this.setOrigin(0, 0.5)
    this.setScale(1)
    // enable physics
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.collideWorldBounds = true
    this.setBounce(0.2);
    this.body.setGravityY(300)
    this.createAnimation();
    this.anims.play(`${spriteConfig.spriteSheets[0].key}`);
    //setup velocity
    this.data.velocity = {
      x: 160,
      y: 300
    }
  }

  createAnimation() {
    this.data.spriteSheets.forEach(spriteSheet => {
      this.scene.anims.create({
        key: `${spriteSheet.key}`,
        frames: this.scene.anims.generateFrameNumbers(`${this.name}-${spriteSheet.key}`, {
          start: 0,
          end: spriteSheet.frameConfig.frameRate - 1
        }),
        frameRate: spriteSheet.frameConfig.frameRate,
        repeat: -1
      });
    })
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.body.velocity.y > 0 && !this.body.touching.down) {
      this.play('fall');
    }
    if (this.scene.cursors.left.isDown) {
      this.setVelocityX(-this.data.velocity.x);
      this.flipX = true
      //only play run animation when player is on the ground
      if (this.body.blocked.down) {
        this.anims.play('run', true);
      }
    } else if (this.scene.cursors.right.isDown) {
      this.setVelocityX(this.data.velocity.x);
      this.flipX = false
      if (this.body.blocked.down) {
        this.anims.play('run', true);
      }
    } else {
      this.setVelocityX(0);
      if (this.body.blocked.down) {
        this.anims.play('idle', true);
      }
    }


    const didPressJump = Phaser.Input.Keyboard.JustDown(this.scene.cursors.space);

    if (didPressJump) {
      if (this.body.onFloor()) {
        this.anims.play('jump', true);
        this.canDoubleJump = true;
        this.body.setVelocityY(-this.data.velocity.y);
      } else if (this.canDoubleJump) {
        this.anims.play('double-jump', true);
        this.canDoubleJump = false;
        this.body.setVelocityY(-this.data.velocity.y);
      }
    }
  }
}
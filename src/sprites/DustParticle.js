import Phaser from "phaser";
import {DUST_PARTICLE} from "../configs/assets.js";

export default class DustParticle extends Phaser.GameObjects.Image {
  constructor(scene, fan) {
    //calculate x, y
    super(scene);
    let x = fan.x;
    let y = fan.y
    this.isVertical = fan.config.direction === "left" || fan.config.direction === "right";
    if (this.isVertical) {
      //fix x pos random y pos
      x = fan.x;
      y = Phaser.Math.Between(fan.y, fan.y + fan.height * fan.scene.tileScale);
    } else {
      //fix y pos random x pos
      x = Phaser.Math.Between(fan.x, fan.x + fan.width * fan.scene.tileScale);
      y = fan.y;
    }
    this.initX = x;
    this.initY = y;
    this.setPosition(this.initX, this.initY);
    this.setTexture(DUST_PARTICLE.key);
    this.setOrigin(0, 0);
    this.setScale(Phaser.Math.Between(0.5, 1));
    this.fan = fan
    this.mainDirectionAccerlation = 3;
    this.secondaryDirectionAccerlation = 0.15;
    this.middle = 10;
    this.alphaReduce = 0.0001;
    this.initVelocityRange = [200, 300]


    //random alpha and init velocity
    this.alpha = Phaser.Math.FloatBetween(0.2, 1);
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this);
    this.body.allowGravity = false
    switch (fan.config.direction) {
      case "left":
        this.body.setVelocityX(Phaser.Math.FloatBetween(this.initVelocityRange[0], this.initVelocityRange[1]) * -1);
        break;
      case "right":
        this.body.setVelocityX(Phaser.Math.FloatBetween(this.initVelocityRange[0], this.initVelocityRange[1]));
        break;
      case "up":
        this.body.setVelocityY(Phaser.Math.FloatBetween(this.initVelocityRange[0], this.initVelocityRange[1]) * -1);
        break;
      case "down":
        this.body.setVelocityY(Phaser.Math.FloatBetween(this.initVelocityRange[0], this.initVelocityRange[1]));
        break;
      default:
        break;
    }
  }

  preUpdate(time, delta) {
    super.update(time, delta);

    switch (this.fan.config.direction) {
      case "left":
        this.body.velocity.x += this.mainDirectionAccerlation * -1;
        //secondary direction
        if (this.initY < this.fan.y + this.fan.height * this.fan.scene.tileScale / 2 - this.middle) {
          this.body.velocity.y += this.secondaryDirectionAccerlation * -1;
        } else if (this.initY > this.fan.y + this.fan.height * this.fan.scene.tileScale / 2 + this.middle) {
          this.body.velocity.y += this.secondaryDirectionAccerlation;
        }
        break;
      case "right":
        this.body.velocity.x += this.mainDirectionAccerlation;
        //secondary direction
        if (this.initY < this.fan.y + this.fan.height * this.fan.scene.tileScale / 2 - this.middle) {
          this.body.velocity.y += this.secondaryDirectionAccerlation * -1;
        } else if (this.initY > this.fan.y + this.fan.height * this.fan.scene.tileScale / 2 + this.middle) {
          this.body.velocity.y += this.secondaryDirectionAccerlation;
        }
        break;
      case "up":
        this.body.velocity.y += this.mainDirectionAccerlation * -1;
        //secondary direction
        if (this.initX < this.fan.x + this.fan.width * this.fan.scene.tileScale / 2 - this.middle) {
          this.body.velocity.x += this.secondaryDirectionAccerlation * -1;
        } else if (this.initX > this.fan.x + this.fan.width * this.fan.scene.tileScale / 2 + this.middle) {
          this.body.velocity.x += this.secondaryDirectionAccerlation;
        }
        break;
      case "down":
        this.body.velocity.y += this.mainDirectionAccerlation;
        if (this.initX < this.fan.x + this.fan.width * this.fan.scene.tileScale / 2 - this.middle) {
          this.body.velocity.x += this.secondaryDirectionAccerlation * -1;
        } else if (this.initX > this.fan.x + this.fan.width * this.fan.scene.tileScale / 2 + this.middle) {
          this.body.velocity.x += this.secondaryDirectionAccerlation;
        }
        break;
    }

    //
    this.alpha -= this.alphaReduce;
    //IMPORTANT: IF YOU DON'T HAVE THIS LINE, THE PARTICLE WILL NOT DISAPPEAR
    if (this.y < 0 || this.y > this.scene.map.heightInPixels * this.tileScale
      || this.x < 0 || this.x > this.scene.map.widthInPixels * this.tileScale) {
      console.log("destroy")
      this.destroy();
    }
  }
}
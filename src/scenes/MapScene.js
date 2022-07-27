import Phaser from "phaser";

class MapScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MapScene',
      backgroundColor: '#fff',
    })
    this.mapData = null;
    this.tileHeight = 0;
    this.tileHWidth = 0;

    this.mapWidth = 0;
    this.mapHeight = 0;
  }

  preload() {
    this.load.image('terrain-tiles', '/assets/maps/Terrain16x16.png');
    this.load.image('bg-tiles', '/assets/maps/Yellow.png');
    this.load.tilemapTiledJSON('map', '/assets/maps/map1.json');
    this.load.spritesheet('player', '/assets/characters/Virtual Guy/Idle (32x32).png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {

    this.map = this.make.tilemap({key: 'map'});

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    this.terrainTiles = this.map.addTilesetImage('Terrain', 'terrain-tiles');
    this.backgroundTiles = this.map.addTilesetImage('Yellow', 'bg-tiles');
    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    this.backgroundLayer = this.map.createLayer('Background', this.backgroundTiles, 0, 0);
    this.terrainLayer = this.map.createLayer('ForeGround', this.terrainTiles, 0, 0);
    this.backgroundLayer.setScale(2);
    this.terrainLayer.setScale(2);

    this.player = this.physics.add.sprite(20, 20, 'player').setScale(1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(300)
    this.anims.create({
      key: 'idle-left',
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 10}),
      frameRate: 11,
      repeat: -1
    });
    this.player.play('idle-left');
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player);

    //collision
    this.terrainLayer.setCollision([7, 8, 9, 1, 2, 3, 13, 14, 15, 35, 40, 41, 42])

    this.terrainLayer.forEachTile(tile => {
      console.log(tile.index)
      if ([7, 8, 9, 40, 41, 42].includes(tile.index)) {
        console.log('here')
        tile.collideDown = false;
      }
    })
    this.physics.add.collider(this.player, this.terrainLayer);
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.controlConfig = {
    //   camera: this.cameras.main,
    //   left: this.cursors.left,
    //   right: this.cursors.right,
    //   up: this.cursors.up,
    //   down: this.cursors.down,
    //   speed: 0.5
    // };
    // this.controls = new Phaser.Cameras.Controls.FixedKeyControl(this.controlConfig);
  }


  update(time, delta) {
    // console.log(this.player.body.touching.down)
    // console.log(this.player.body.velocity.y)
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      // this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      // this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      // this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown) {
      console.log('here')
      this.player.setVelocityY(-330);
    }
  }
}

export default MapScene;
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
    //TODO: config key path in a config file
    //TODO: separate load assets in a Boot Scene
    this.load.image('terrain-tiles', '/assets/maps/Terrain16x16.png');
    this.load.image('bg-tiles', '/assets/maps/Yellow.png');
    this.load.tilemapTiledJSON('map', '/assets/maps/map1.json');
    this.load.spritesheet('player', '/assets/characters/Pink Man/Idle (32x32).png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    this.load.spritesheet('jump', '/assets/characters/Pink Man/Jump (32x32).png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    this.load.spritesheet('fall', '/assets/characters/Pink Man/Fall (32x32).png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player-run', '/assets/characters/Pink Man/Run (32x32).png', {
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
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 10}),
      frameRate: 11,
      repeat: -1
    });

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player-run', {start: 0, end: 11}),
      frameRate: 12,
      repeat: -1
    })
    
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.player.play('idle');

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
  }

  update(time, delta) {
    console.log(this.player.body.velocity.y)
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true
      this.player.anims.play('run', true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play('run', true);
      this.player.setVelocityX(160);
      this.player.flipX = false

      // this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
      // this.player.anims.play('turn');
    }

    if (this.player.body.blocked.down) this.player.anims.play('idle', true);
    
    const didPressJump = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (didPressJump) {
      if (this.player.body.onFloor()) {
        this.player.anims.play('jump', true);
        this.canDoubleJump = true;
        this.player.body.setVelocityY(-330);
      } else if (this.canDoubleJump) {
        this.canDoubleJump = false;
        this.player.body.setVelocityY(-330);
      }
    }
  }
}

export default MapScene;
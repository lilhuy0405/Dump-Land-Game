import Phaser from "phaser";
import {PLAYERS} from "../configs/assets.js";
import PlayerSprite from "../Sprites/PlayerSprite.js";

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

    this.tileScale = 2;
    this.cameraScale = 1;
  }

  preload() {}

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
    this.backgroundLayer.setScale(this.tileScale);
    this.terrainLayer.setScale(this.tileScale);

    this.player = new PlayerSprite(this, PLAYERS[2], 10, 10);

    //setup camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels * this.tileScale, this.map.heightInPixels * this.tileScale);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels * this.tileScale, this.map.heightInPixels * this.tileScale);
    this.cameras.main.setZoom(this.cameraScale);
    this.cameras.main.startFollow(this.player);

    //collision
    this.terrainLayer.setCollision([7, 8, 9, 1, 2, 3, 13, 14, 15, 35, 40, 41, 42])

    this.terrainLayer.forEachTile(tile => {
      if ([7, 8, 9, 40, 41, 42].includes(tile.index)) {
        tile.collideDown = false;
      }
    })
    this.physics.add.collider(this.player, this.terrainLayer);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {}
}

export default MapScene;
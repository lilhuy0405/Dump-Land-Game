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

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.setZoom(2)
  }


  update(time, delta) {
  }
}

export default MapScene;
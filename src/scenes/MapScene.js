import Phaser from "phaser";
import {FRUIT_COLLECTED, FRUITS, MAP_BG_IMAGES, MAP_OBJECTS_TYPE, MAPS, PLAYERS} from "../configs/assets.js";
import PlayerSprite from "../sprites/PlayerSprite.js";
import FruitSprite from "../sprites/FruitSprite.js";

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
    this.map = null
    this.fruits = []
    this.collisionLayer = null;
    this.isShowingCollision = false;
    this.heroSpwanPlace = null;
    this.player = null
    this.background = null
    this.backgroundImage = null
    this.backgroundImageSpeed = 1
  }

  preload() {
  }

  create() {

    this.map = this.buildMap(MAPS[0].key);

    this.cursors = this.input.keyboard.createCursorKeys();

  }

  update(time, delta) {
    if (this.background) {
      if (this.background.direction === 'X') {
        this.backgroundImage.tilePositionX += this.backgroundImageSpeed
      } else {
        this.backgroundImage.tilePositionY += this.backgroundImageSpeed
      }
    }
  }

  buildMap(mapKey) {
    //remove old map
    //...
    //build new map
    const map = this.make.tilemap({key: mapKey});
    //create tileSet and layer
    const tileSets = []
    map.tilesets.forEach(tileset => {
      tileSets.push(map.addTilesetImage(tileset.name, tileset.name));
    })
    const layers = []
    map.layers.forEach(layer => {
      const layerTileSetProps = layer.properties.find(prop => prop.name === 'tilesets').value.split(',')
      const layerTileSets = []
      layerTileSetProps.forEach((tileSetProp, index) => {
        const tileSetName = tileSetProp.replaceAll('"', '')
        const tileSet = tileSets.find(item => item.name === tileSetName)
        if (tileSet) {
          layerTileSets.push(tileSet)
        }

      })
      layers.push(map.createLayer(layer.name, layerTileSets, 0, 0).setScale(this.tileScale))
    })

    const collisionLayer = layers.find(layer => layer.layer.name === 'Collision')
    if (collisionLayer) {
      collisionLayer.setCollisionByProperty({collide: true})
      collisionLayer.forEachTile(tile => {
        if (tile.properties.canJump) {
          tile.collideDown = false
        }
      })
      collisionLayer.setAlpha(this.isShowingCollision ? 0.6 : 0)
      this.collisionLayer = collisionLayer
    }

    // build objects
    const objectLayer = map.getObjectLayer('Objects');
    // this.fruits = this.physics.add.staticGroup();
    objectLayer.objects.forEach(object => {
      const objectType = object.properties.find(property => property.name === 'type').value;
      switch (objectType) {
        case MAP_OBJECTS_TYPE.FRUITS:
          const fruitName = object.properties.find(property => property.name === 'name').value;
          const fruitData = FRUITS.find(fruit => fruit.key === fruitName);
          //caculate position
          const x = object.x * this.tileScale;
          const y = object.y * this.tileScale;
          this.fruits.push(new FruitSprite(this, fruitData, x, y));
          break;
        case MAP_OBJECTS_TYPE.HERO_SPAWN:
          this.heroSpwanPlace = {
            x: object.x * this.tileScale,
            y: object.y * this.tileScale
          }
          break;
        case MAP_OBJECTS_TYPE.BACKGROUND:
          const backgroundName = object.properties.find(property => property.name === 'name').value;
          const backgroundData = MAP_BG_IMAGES.find(bg => bg.key === backgroundName);
          const backGroundMovingDirection = object.properties.find(property => property.name === 'moveDirection').value;
          if (backgroundData && backGroundMovingDirection && backGroundMovingDirection) {
            this.background = {
              ...backgroundData,
              backgroundName,
              direction: backGroundMovingDirection,
            }
            //build background
            this.backgroundImage = this.add.tileSprite(0, 0, map.widthInPixels * this.tileScale, map.heightInPixels * this.tileScale, this.background.key);
            this.backgroundImage.setOrigin(0, 0);
            // this.bg.setScrollFactor(0);
            this.backgroundImage.setDepth(-1)
          }
          break;
        default:
          break;
      }
    })
    //spawn hero
    this.player = new PlayerSprite(this, PLAYERS[2], this.heroSpwanPlace.x, this.heroSpwanPlace.y);
    if (this.collisionLayer) {
      this.physics.add.collider(this.player, this.collisionLayer);
    }
    //setup camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels * this.tileScale, map.heightInPixels * this.tileScale);
    this.physics.world.setBounds(0, 0, map.widthInPixels * this.tileScale, map.heightInPixels * this.tileScale);
    this.cameras.main.setZoom(this.cameraScale);
    this.cameras.main.startFollow(this.player);
    return map
  }
}

export default MapScene;
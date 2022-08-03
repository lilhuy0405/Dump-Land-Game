import Phaser from "phaser";
import {BOXES, FRUIT_COLLECTED, FRUITS, MAP_BG_IMAGES, MAP_OBJECTS_TYPE, MAPS, PLAYERS} from "../configs/assets.js";
import PlayerSprite from "../sprites/PlayerSprite.js";
import FruitSprite from "../sprites/FruitSprite.js";
import CheckPointSprite from "../sprites/CheckPointSprite.js";
import BoxSprite from "../sprites/BoxSprite.js";
import TrampolineSprite from "../sprites/TrampolineSprite.js";
import BlockSprite from "../sprites/BlockSprite.js";

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
    this.backgroundImageSpeed = 0.5
    this.checkPoint = null;
    //static groups
    this.boxes = null
    this.trampolines = null
    this.blocks = null
  }

  preload() {
  }

  create() {

    this.map = this.buildMap(MAPS[0].key);
    this.cursors = this.input.keyboard.createCursorKeys();
    // console.log('increate', this.map)

  }

  update(time, delta) {

    const fruitsCollected = this.fruits.filter(item => item.active === false)
    let boxCondition = false
    if (this.boxes) {
      //calculate broken box
      let brokenBoxes = 0;
      const boxesBroken = this.boxes.children.each(item => {
        if (item.isBroken) {
          brokenBoxes++;
        }
      })
      //check if all fruit is collected
      let boxFruitsCollected = 0;
      this.boxes.children.each(item => {
        if (item.fruit && !item.fruit.active) {
          boxFruitsCollected++;
        }
      })

      if (brokenBoxes === this.boxes.children.size && boxFruitsCollected === this.boxes.children.size) {
        boxCondition = true
      }
    }

    if (fruitsCollected.length === this.fruits.length && boxCondition && this.checkPoint && !this.checkPoint.isShown) {
      this.checkPoint.show()
    }
    if (this.background) {
      switch (this.background.moveDirection) {
        case 'left':
          this.backgroundImage.tilePositionX += this.backgroundImageSpeed
          break;
        case 'right':
          this.backgroundImage.tilePositionX -= this.backgroundImageSpeed
          break;
        case 'up':
          this.backgroundImage.tilePositionY += this.backgroundImageSpeed
          break;
        case 'down':
          this.backgroundImage.tilePositionY -= this.backgroundImageSpeed
          break;
      }
    }

  }

  buildMap(mapKey) {
    //remove old map
    if (this.player) {
      this.player.disableBody(true, true);
      this.player.body.destroy(true, true);
      this.player = null;
    }

    if (this.fruits.length > 0) {
      this.fruits.forEach(fruit => {
        fruit.disableBody(true, true);
        fruit.body.destroy(true, true);
        this.fruits = [];
      })
    }
    if (this.collisionLayer) {
      this.collisionLayer.destroy();
      this.collisionLayer = null;
    }
    if (this.heroSpwanPlace) {
      this.heroSpwanPlace = null;
    }
    if (this.background) {
      this.backgroundImage.destroy();
      this.background = null;
      this.backgroundImage = null;
    }
    if (this.checkPoint) {
      this.checkPoint.body.destroy(true, true);
      this.checkPoint.disableBody(true, true);
      this.checkPoint = null;
    }
    if (this.boxes) {
      this.boxes.children.each(box => {
        if (box.fruit) {
          box.fruit.destroy(true, true);
          box.fruit = null;
        }
      })
      this.boxes.clear(true, true);

      this.boxes = null
    }
    if (this.trampolines) {
      this.trampolines.clear(true, true);
      this.trampolines = null;
    }
    if (this.blocks) {
      this.blocks.clear(true, true);
      this.blocks = null;
    }
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }

    //build new map
    const map = this.make.tilemap({key: mapKey});
    this.tileHeight = map.tileHeight;
    this.tileHWidth = map.tileWidth;
    console.log(this.tileHeight, this.tileHWidth)
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
    this.boxes = this.physics.add.staticGroup();
    this.trampolines = this.physics.add.staticGroup();
    this.blocks = this.physics.add.staticGroup();

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
        case MAP_OBJECTS_TYPE.CHECKPOINT:
          const from = object.properties.find(property => property.name === 'from').value;
          const to = object.properties.find(property => property.name === 'to').value;
          this.checkPoint = new CheckPointSprite(this, {
            from,
            to
          }, object.x * this.tileScale, object.y * this.tileScale);
          break;
        case MAP_OBJECTS_TYPE.BOXES:
          const boxName = object.properties.find(property => property.name === 'name').value;
          const boxConfig = BOXES.find(box => box.key === boxName);
          const hitPoint = object.properties.find(property => property.name === 'hitPoint').value;
          const fruit = object.properties.find(property => property.name === 'fruit').value;
          const boxData = {...boxConfig, hitPoint, fruit}
          this.boxes.add(new BoxSprite(this, boxData, object.x * this.tileScale, object.y * this.tileScale))
          break;
        case MAP_OBJECTS_TYPE.TRAMPOLINES:
          this.trampolines.add(new TrampolineSprite(this, object.x * this.tileScale, object.y * this.tileScale))
          break;
        case MAP_OBJECTS_TYPE.BLOCKS:
          const scaleX = object.properties.find(property => property.name === 'scaleX').value;
          const scaleY = object.properties.find(property => property.name === 'scaleY').value;
          // this.blocks.add(new BlockSprite(this, object.x * this.tileScale, object.y * this.tileScale))
          for (let i = 0; i < scaleX; i++) {
            for (let j = 0; j < scaleY; j++) {
              const xPos = object.x * this.tileScale + i * this.tileHWidth * this.tileScale;
              const yPos = object.y * this.tileScale - j * this.tileHeight * this.tileScale;
              this.blocks.add(new BlockSprite(this, xPos, yPos))
            }
          }
          break;
        default:
          break;
      }
    })
    //random background

    this.background = MAP_BG_IMAGES[Math.floor(Math.random() * MAP_BG_IMAGES.length)];
    this.backgroundImage = this.add.tileSprite(0, 0, map.widthInPixels * this.tileScale, map.heightInPixels * this.tileScale, this.background.key);
    this.backgroundImage.setOrigin(0, 0);
    this.backgroundImage.setDepth(-1);

    //spawn hero
    this.player = new PlayerSprite(this, PLAYERS[2], this.heroSpwanPlace.x, this.heroSpwanPlace.y);
    //collsion detection
    if (this.collisionLayer) {
      this.physics.add.collider(this.player, this.collisionLayer);
    }
    if (this.boxes) {
      this.physics.add.collider(this.player, this.boxes, (player, box) => {
        box.onHit()
      });
    }
    if (this.trampolines) {
      this.physics.add.collider(this.player, this.trampolines, (player, trampoline) => {
        trampoline.onPlayerJumpInto()
      });
    }
    if (this.blocks) {
      this.physics.add.collider(this.player, this.blocks, (player, block) => {
        block.onHit()
      });
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
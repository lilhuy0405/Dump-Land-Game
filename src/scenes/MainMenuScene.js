import Phaser from 'phaser'
import {PLAYERS} from "../configs/assets.js";
import PlayerSprite from "../sprites/PlayerSprite";

export default class MainMenuScene extends Phaser.Scene {
    cursors;
    buttons = []
    selectedButtonIndex = 0;
    demoPlayer;

    constructor() {
        super('MainMenuScene')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        this.load.image('glass-panel', 'assets/menu/glassPanel.png')
        this.load.image('cursor-hand', 'assets/menu/cursor_hand.png')
        this.load.image('Idle (32x32).png', 'assets/characters/Mask Dude/Idle (32x32).png')
        
    }

    create() {
        // this.scene.start('MapScene')
        
        const { width, height } = this.scale

        let button = {}
        let positionX = width * 0.5;
        let positionY = height * 0.6;

        for (let i = 0; i < PLAYERS.length; i++) {
            button = this.add.image(positionX, positionY, 'glass-panel').setDisplaySize(50, 50).setInteractive();

            this.add.sprite(positionX, positionY, `${PLAYERS[i].name}-${PLAYERS[i].spriteSheets[0].key}`);
            const index = i + 1
            positionX = index % 2 ? button.x + 60 : button.x - 60
            positionY = index % 2 ? button.y : button.y + 60

            this.buttons.push(button)
            button.on('pointerup', (pointer) => {
                this.selectButton(i)
            });
        }

        const startBtn = this.add.image(430, positionY, 'glass-panel').setDisplaySize(110, 50).setInteractive().setDepth(1);
        this.add.text(430, positionY, 'Start game').setOrigin(0.5)

        startBtn.on('pointerdown', () => {
            this.scene.start('MapScene', {'playerIndex': this.selectedButtonIndex});
        })

        this.selectButton(0)
        
    }

    selectButton(index) {
        const currentButton = this.buttons[this.selectedButtonIndex]
       
        // set the current selected button to a white tint
        if (currentButton) currentButton.setTint(0xffffff)

        const button = this.buttons[index]

        // set the newly selected button to a green tint
        button.setTint(0x66ff7f)
        
        // store the new selected index
        this.selectedButtonIndex = index
        
        // console.log(this, PLAYERS[this.selectedButtonIndex])
        // this.destroySprite(this.demoPlayer)
        
        if (this.demoPlayer) {
            this.demoPlayer.destroy()
            this.demoPlayer = null
        }
        this.demoPlayer = new PlayerSprite(this, PLAYERS[this.selectedButtonIndex], 10, 10);
    }
}
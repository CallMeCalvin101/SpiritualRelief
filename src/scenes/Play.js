class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //place back ground 
        this.load.image('magicworld', './assets/magicworld.png');
        // Test Assets
        this.load.spritesheet('button', './assets/button.png', {frameWidth: 48, frameHeight: 24, startFrame: 0, endFrame: 1});
        //preload obstacle atlas
        this.load.atlas('platformer_atlas', './assets/kenny_sheet.png', './assets/kenny_sheet.json');

        this.load.atlas({
            key: 'bugsprite',
            textureURL: './assets/bugsprite.png',
            atlasURL: './assets/bugsprite.json'
        });
        this.load.atlas({
            key: 'hurtbug',
            textureURL: './assets/hurtbug.png',
            atlasURL: './assets/hurtbug.json'
        });
    }

    create() {
        //variables/settings for physics engine
        this.ACCELERATION = 2000;
        this.MAX_X_VEL = 500; 
        this.MAX_Y_VEL = 500;
        this.DRAG = 4000;   

        //CREATE OBSTACLE ANIMATIONS
        this.anims.create({key: 'bugsprite',frames: [{key: 'bugsprite',frame: "bug1.png"},  //bugsprite animation to be replaced by whatever standard obstacle animation is (spirits/ghosts wiggle?)
            {key: 'bugsprite',frame: "bug2.png"}],frameRate: 10,repeat: -1});
        this.anims.create({key: 'hurtbug',frames: [{key: 'hurtbug',frame: "hurtbug1.png"}, //bugend animation to be replaced with obstacle broken/hit by player animation
            {key: 'hurtbug',frame: "hurtbug2.png"}],frameRate: 500,repeat: 0});

            
        //place back ground 
        this.magicworld = this.add.image(200,220,'magicworld');
        // Variable for cursor
        gamePointer = this.input.activePointer;

        // Test UI
        this.add.rectangle(0, 2 * game.config.height / 3, game.config.width, game.config.height / 3, 0xFF7254).setOrigin(0, 0);

        // Test Buttons
        this.testButtons = this.add.group();
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let testButton = new Button(this, 90 + (60 * i), game.config.height * (2/3) + 20 + (30 * j), 'button').setOrigin(0, 0);
                this.testButtons.add(testButton);
            }
        }

        this.testButtons.runChildUpdate = true;


        this.obstacle01 = this.physics.add.sprite(400, 100, 'bugsprite');  //create obstacle sprite
        this.obstacle01.body.collideWorldBounds = true; 
        this.obstacle01.play("bugsprite"); //start wiggle animation

        this.character = this.physics.add.sprite(100, 400, 'bugsprite');
        this.character.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.character.body.collideWorldBounds = true;

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.character, this.obstacle01, obstacleHit); //obstacleHit function runs when overlap happens between character and obstacle

        function obstacleHit (character, obstacle)
        {
            console.log("collide"); //debugging console log
            obstacle.play("hurtbug"); // obstacle animation plays that shows it got hit by player (breaks/gets damaged)
        }


    }

    update() {

        if(this.obstacle01.body.blocked.left)       //if obstacle hits left side of screen, reset it, play standard animation (instead of being broken animation if player has collided with obstacle)
        {
            // console.log("blocked on left") //for debugging
            this.obstacle01.x = 1000;
            this.obstacle01.body.collideWorldBounds = true; 
            this.obstacle01.play("bugsprite");
        }

        this.obstacle01.x -= 5;     //obstacles are constantly moving

        //player movement based on arrow keys

        if(cursors.left.isDown) {
            this.character.body.setAccelerationX(-this.ACCELERATION);
            this.character.setFlip(true, false);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            // add this.character.anims.play('key for walking animation', true);

        } else if(cursors.right.isDown) {
            this.character.body.setAccelerationX(this.ACCELERATION);
            this.character.resetFlip();
            // add this.character.anims.play('key for walking animation', true);
        
        } else if(cursors.up.isDown) {
            this.character.body.setAccelerationY(-this.ACCELERATION);
            this.character.resetFlip();
            // add this.character.anims.play('key for walking animation', true);

        } else if(cursors.down.isDown) {
            this.character.body.setAccelerationY(this.ACCELERATION);
            this.character.resetFlip();
            // add this.character.anims.play('key for walking animation', true);
        }
        
        else {
            // set acceleration to 0 so DRAG will take over
            this.character.body.setAccelerationX(0);
            this.character.body.setAccelerationY(0);
            this.character.body.setDragX(this.DRAG);
            this.character.body.setDragY(this.DRAG);
        }

    }
}
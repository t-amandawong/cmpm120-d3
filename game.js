class Intro extends Phaser.Scene {
    constructor() {
        super("intro");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image("studiologo", "pandared@2x.png");
        this.cameras.main.setBackgroundColor(0x5fad81)
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        let title = this.add.text(this.w/2, this.h+100, "title").setFontSize(200).setOrigin(0.5);
        let logo = this.add.image(this.w/2, this.h/2, "studiologo").setAlpha(1);
        let start = this.add.text(this.w/2, this.h/2, "click anywhere to start")
            .setFontSize(40).setOrigin(0.5).setAlpha(0);
        let play = this.add.text(this.w/2, this.h/2 + 100, "play")
            .setFontSize(100).setOrigin(0.5).setAlpha(0).setInteractive();

        const tweens_chain = this.tweens.chain({
            tweens: [
                {
                    targets: logo,
                    alpha: {from: 0, to: 1},
                    duration: 2300,
                    ease: "Quad.easeInOut",
                    yoyo: true 
                },
                {
                    targets: title,
                    y: this.h/2.5,
                    duration: 2500,
                    ease: "Back.easeOut",
                }, 
                {
                    targets: start,
                    alpha: {from: 0.3, to: 1},
                    duration: 1000,
                    ease: "Quad.easeInOut",
                    repeat: -1,
                    yoyo: true
                }
            ]
        });

        this.input.once('pointerdown', ()=> {
            tweens_chain.stop();
            logo.setAlpha(0);
            title.setY(this.h/2.5);
            this.tweens.add({
                targets: title,
                y: this.h/2.5 - 100,
                ease: "Quad.easeOut"
            });
            this.tweens.add({
                targets: start,
                alpha: 0,
                ease: "Quad.easeOut"
            });
            this.tweens.add({
                targets: play,
                alpha: 1,
                ease: "Quad.easeOut"
            });
        });

        play.on('pointerover', ()=> {
            play.setScale(1.1);
        })
            .on('pointerout', ()=> {
            play.setScale(1);
        })
            .on('pointerdown', ()=> {
            this.scene.start('level 1');
        });

    }
    update(){
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "Thank you for playing!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}

class Level1 extends Phaser.Scene {
    constructor() {
        super('level 1')
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.graphics = this.add.graphics();
        console.log(this.graphics)
        this.graphics.fillStyle(0xFFFFFF)

        this.strokes = 0
        
        this.hole = this.add.circle(this.w*0.9, this.h*0.5, 40, 0x291504)
        this.ball = this.add.circle(this.w* 0.25, this.h*0.25, 32, 0xffffff);
        this.physics.add.existing(this.ball, false);
        this.input.setDraggable(this.ball.setInteractive());
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.1)
        this.ball.body.setFriction(0.7)
        console.log(this.ball)

        let ballX = this.ball.body.position.x;
        let ballY = this.ball.body.position.y;
        this.graphics.lineBetween(ballX, ballY, ballX + 100, ballY + 100).setAlpha(0)
        this.score = this.add.text(50, 50, "Score: 0")

        this.ball.on('drag', (dragX, dragY)=> {
            let ballX = this.ball.body.position.x;
            let ballY = this.ball.body.position.y;

            let dispX = ballX - dragX
            let dispY = ballY - dragY
            this.graphics.clear()
            this.graphics.lineBetween(ballX, ballY, ballX + dispX, ballY + dispY)
        })
        this.ball.on('dragend', ()=> {
            let mouseX = this.input.mousePointer.x;
            let mouseY = this.input.mousePointer.y;
            console.log(mouseX, mouseY)

            let ballX = this.ball.body.position.x;
            let ballY = this.ball.body.position.y;
            console.log(ballX, ballY)

            let dispX = (mouseX - ballX)
            let dispY = (mouseY - ballY)

            console.log(this.ball)
            console.log(ballX + dispX, ballY + dispY)
            this.ball.body.setVelocity(-dispX, -dispY)
            this.ball.body.setAcceleration(-3)

            this.strokes += 1
            this.score.setText("Score: " + this.strokes)
        })
    }
    update() {
        //console.log(this.ball.body.velocity)
        if(this.ball.body.velocity.x > 0.5) {
            this.input.setDraggable(this.ball, false)
        } else {
            this.input.setDraggable(this.ball)
        }
        if(Math.abs(this.ball.body.position.x - this.hole.x) < 40 && Math.abs(this.ball.body.position.y - this.hole.y) < 40) {
            this.scene.start('summaryscene' , {level: 1, strokes: this.strokes})
        }
    }
}

class SummaryScene extends Phaser.Scene {
    constructor(key) {
        super('summaryscene');
    }    
    
    create(data) {
        this.level = data.level;
        this.strokes = data.strokes;
        this.transitionDuration = 1000;

        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;

        this.cameras.main.setBackgroundColor(0xfce8cd);
        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.add.text(this.w/2, this.h*0.2, "Level " + this.level.toString())
            .setFontSize(200).setOrigin(0.5).setColor(0x342f32);
        console.log(this.strokes)
        this.add.text(this.w/2, this.h*0.45, "Strokes: " + this.strokes.toString())
            .setFontSize(100).setOrigin(0.5).setColor(0x342f32);

        let rep_rect = this.add.rectangle(this.w/2 - 300, this.h * 0.8, 500, 100, 0x25ace6).setInteractive()
        let cont_rect = this.add.rectangle(this.w/2 + 300, this.h * 0.8, 500, 100, 0x4fdb79).setInteractive()
        let replay = this.add.text(this.w/2 - 300, this.h * 0.8, "replay⟲")
            .setOrigin(0.5).setFontSize(75).setColor(0x342f32);
        let cont = this.add.text(this.w/2 + 300, this.h * 0.8, "continue➜")
            .setOrigin(0.5).setFontSize(75).setColor(0x342f32);

        rep_rect.on('pointerover', ()=> {
            rep_rect.setScale(1.1);
            replay.setScale(1.1);
        })
            .on('pointerout', ()=> {
                rep_rect.setScale(1);
                replay.setScale(1);
        })
            .on('pointerdown', ()=> {
                this.scene.start('level ' + this.level.toString());
        });

        cont_rect.on('pointerover', ()=> {
            cont_rect.setScale(1.1);
            cont.setScale(1.1);
        })
            .on('pointerout', ()=> {
                cont_rect.setScale(1);
                cont.setScale(1);
        })
            .on('pointerdown', ()=> {
                this.scene.start('level ' + (this.level + 1).toString());
        });
    }
    update(){
    }
}

const game = new Phaser.Game({
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
    },
    backgroundColor: 0x39db4f,
    scene: [Intro, Outro, Level1, SummaryScene],
    title: "Adventure Game",
});
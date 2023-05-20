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
            this.scene.start('example');
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

// class Example extends Phaser.Scene {
//     constructor() {
//         super('example')
//     }
//     preload() {
//         this.load.path = "./assets/";
//         this.load.image("ball", "White_Circle.png")
//     }
//     drawTrajectory(dotx, doty) {
//         // function created by Adam Smith. Edited by me.

//         this.graphics.clear();

//         //create simulated "future" world
//         let hWorld = new Phaser.Physics.Matter.World(this, this.matter.config);
        
//         //create simulated ball, anchor, and spring between them
//         let hFactory = new Phaser.Physics.Matter.Factory(hWorld);
//         let hDot = hFactory.circle(dotx, doty, 0, {isStatic: true})
//         let hBall = hFactory.circle(this.ball.position.x, this.ball.position.y, 32);
//         let hSpring = hFactory.spring(hBall, hDot, 0, 0.01);
        
//         // define time step for update
//         const step = 1000 / 60;
//         hWorld.update(0, step);

//         hWorld.removeConstraint(hSpring);

//         // draw the actual trajectory
//         for (let t = 0; t < 1200; t += step) {
//             let { x, y } = hBall.position;
//             if (this.ball.position.x < hDot.position.x) {
//                 if (this.ball.position.y < hDot.position.y) {
//                     if (x > hDot.position.x && y > hDot.position.y) {
//                         this.graphics.fillCircle(x, y, 3);
//                     }
//                 }
//                 else {
//                     if (x > hDot.position.x && y <= hDot.position.y) {
//                         this.graphics.fillCircle(x, y, 3);
//                     }
//                 }
//             }
//             else {
//                 if (this.ball.position.y < hDot.position.y) {
//                     if (x < hDot.position.x && y > hDot.position.y) {
//                         this.graphics.fillCircle(x, y, 3);
//                     }
//                 }
//                 else {
//                     if (x < hDot.position.x && y <= hDot.position.y) {
//                         this.graphics.fillCircle(x, y, 3);
//                     }
//                 }
//             }
//             hWorld.update(t, step);
//         }

//     }

//     checkFired(){
//         //credit: aaron lee
//         //release the spring if the ball is far enough away
//         let disp = Phaser.Math.Distance.Between(this.ball.position.x, this.ball.position.y, this.dot.position.x, this.dot.position.y);
//         if (disp > this.ball.circleRadius && !this.input.activePointer.isDown) {
//             this.matter.world.removeConstraint(this.spring)
//             this.predict = false
//             this.graphics.clear()
//             //remove the mouse spring
//             const d = this.matter.world.localWorld.constraints.filter((c) => {
//                 return c.label === "Pointer Constraint"
//             })
//             d.forEach((constraint) => {
//                 this.matter.world.removeConstraint(constraint)
//             })
//             // this.matter.world.remove(this.matter.world.constraints[0])
//         }
//         if (this.predict) {
//             this.drawTrajectory(this.w * 0.25, this.h*0.25)
//         }

//     }

//     makeNewAnchor()


//     create() {
//         this.graphics = this.add.graphics();
//         this.graphics.fillStyle(0xFFFFFF)
//         this.matter.world.setBounds();
//         this.w = this.game.config.width
//         this.h = this.game.config.height

//         //the anchor for the spring
//         this.dot = this.matter.add.circle(this.w * 0.25, this.h * 0.25, 32, { isStatic: true })
//         //turn off collision for the anchor
//         this.dot.collisionFilter = {
//             category: 0x0000,
//             mask: 0x0000
//         };
//         const canDrag = this.matter.world.nextGroup();
//         //this.circle1 = this.add.circle(this.w * 0.25, this.h * 0.25, 32, 0xffffff).setInteractive()
//         this.ball = this.matter.add.circle(this.w * 0.25, this.h * 0.25, 32, { collisionFilter: { group: canDrag } });
//         console.log(this.ball)
//         this.spring = this.matter.add.spring(this.ball, this.dot, 0, 0.008);
//         this.matter.add.mouseSpring();
//         this.matter.add.mouseSpring({ collisionFilter: { group: canDrag } });

//         this.ball.friction = 0.7;
//         //this.ball.setBounce(0.7);

//         this.predict = true;


//     }
//     update() {
//         if (this.predict) {
//             this.checkFired()
//         }
//         if(this.ball.velocity.x < 0.5) {
//             this.ball.velocity.x = 0
//         }
//     }
// }

class Example extends Phaser.Scene {
    constructor() {
        super('example')
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.graphics = this.add.graphics();
        console.log(this.graphics)
        this.graphics.fillStyle(0xFFFFFF)
        
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
        })
    }
    update() {
        //console.log(this.ball.body.velocity)
        if(this.ball.body.velocity.x > 0.5) {
            this.input.setDraggable(this.ball, false)
        } else {
            this.input.setDraggable(this.ball)
        }
        //if(this.ball.body.)
    }
}

class Test extends SummaryScene {
    constructor() {
        super("test", 1, 2, 20000)
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
    scene: [Intro, Outro, Example, Test],
    title: "Adventure Game",
});
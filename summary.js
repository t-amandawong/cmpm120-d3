class SummaryScene extends Phaser.Scene {
    constructor(key, level, strokes) {
        super(key);
        this.level = level;
        this.strokes = strokes;
    }    
    
    create() {
        this.transitionDuration = 1000;

        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;

        this.cameras.main.setBackgroundColor(0xfce8cd);
        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.add.text(this.w/2, this.h*0.2, "Level " + this.level.toString())
            .setFontSize(200).setOrigin(0.5).setColor(0x342f32);
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
class healthbar{
    constructor (scene, x, y){
        this.hbar = new Phaser.GameObject.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value =100;
        this.p = 0.8;
        this.draw();
        scene.add.existing(this.hbar);

    }
    decrease (atkhp){
        this.value -= atkhp;
        if(this.value <0){
            this.value = 0;
        }
        this.draw();
        return (this.value ==0);
    }
    draw(){
        this.hbar.clear();
        this.hbar.fillStyle(0x000000);
        this.hbar.fillRect(this.x, this.y, 80, 16);
        this.hbar.fillStyle(0x0000);
        this.hbar.fillRect(this.x+2, this.y+2, 76, 12);
        var d =Math.floor(this.p* this.value);
        this.hbar.fillRect(this.x+2, this.y+2,d,12);
    }
}
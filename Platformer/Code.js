const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
let scrollX = 0, scrollY = 0, playerDirection = "right";
const level = [-600,3700,450,800, 1095,1180,335,450, 1300,1390,225,450, 1390,1485,335,450];
let track = new Audio('GameTrack.ogg');
let particles = [];
let test = true;

class Sprite {
    constructor({position, imageSrc, scale = 1, scrollSpeed = 1, frames = 1, offset = {x:0,y:0}}) {
        this.position = position;
        this.width;
        this.height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.scrollSpeed = scrollSpeed;
        this.frames = frames;
        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
    }
    draw() {
        c.drawImage(this.image, 
            this.currentFrame * (this.image.width / this.frames),
            0,
            this.image.width / this.frames,
            this.image.height, this.position.x - this.offset.x, this.position.y - this.offset.y, 
            (this.image.width / this.frames) * this.scale, this.image.height * this.scale);
    }
    altDraw() {
        c.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale);
    }
    animate() {
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold == 0) {
            if(this.currentFrame < this.frames - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }
    tick() {
        this.position.x -= scrollX / this.scrollSpeed;
        this.draw();
        this.animate();
        this.position.x += scrollX / this.scrollSpeed;
    }
}
class Player extends Sprite {
    constructor({position, imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}, sprites, framesHold = 5}) {
        super({position, imageSrc, scale, frames, offset, framesHold});
        this.velocity = {x:0,y:0};
        this.acceleration = 0;
        this.width = 50;
        this.height = 150;
        this.health = 100;
        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.air = 99;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }
    tick() {
        this.velocity.y += gravity;
        if(this.position.x < -500) {
            this.position.x = -500;
        }
        this.position.x = (this.position.x - scrollX / this.scrollSpeed) + 512;
        this.draw();
        this.animate();
        this.position.x = (this.position.x + scrollX / this.scrollSpeed) - 512;
        this.air++;
        this.position.y += this.velocity.y;
        if(this.position.y > 1000) {
            this.position.x = -200;
            this.position.y = 200;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.acceleration = 0;
            this.air = 99;
            scrollX = 0;
            scrollY = 0;
        }
        scrollX = this.position.x;
        if(scrollX < 0) {
            scrollX = 0;
        } 
        if(scrollX > 4000) {
            scrollX = 4000;
        }
        for(let i = 0; i < level.length; i+=4) {
            if(this.position.x + this.width > level[i] && this.position.x < level[i+1] &&
                this.position.y + this.height > level[i+2] && this.position.y < level[i+3]) {
                if(this.velocity.y > 0) {
                    this.air = 0;
                    this.velocity.y = 0;
                    this.position.y = level[i+2] - this.height;
                }
                if(this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.position.y = level[i+3] - this.height;
                }
            }
        }
    }
    switchSprite(sprite) {
        switch(sprite) {
            case 'idle':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.idle.image) {
                        this.image = this.sprites.idle.image;
                        this.frames = this.sprites.idle.frames;
                        this.framesHold = this.sprites.idle.framesHold;
                        this.currentFrame = 0;
                    }
                } else {
                    if(this.image != this.sprites.idleLeft.image) {
                        this.image = this.sprites.idleLeft.image;
                        this.frames = this.sprites.idleLeft.frames;
                        this.framesHold = this.sprites.idleLeft.framesHold;
                        this.currentFrame = 0;
                    }
                }
                break
            case 'run':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.run.image) {
                        this.image = this.sprites.run.image;
                        this.frames = this.sprites.run.frames;
                        this.framesHold = this.sprites.run.framesHold;
                        this.currentFrame = 0;
                    }
                } else {
                    if(this.image != this.sprites.runLeft.image) {
                        this.image = this.sprites.runLeft.image;
                        this.frames = this.sprites.runLeft.frames;
                        this.framesHold = this.sprites.runLeft.framesHold;
                        this.currentFrame = 0;
                    }
                }
                break
            case 'jump':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.jump.image) {
                        this.image = this.sprites.jump.image;
                        this.frames = this.sprites.jump.frames;
                        this.framesHold = this.sprites.jump.framesHold;
                        this.currentFrame = 0;
                    }
                } else {
                    if(this.image != this.sprites.jumpLeft.image) {
                        this.image = this.sprites.jumpLeft.image;
                        this.frames = this.sprites.jumpLeft.frames;
                        this.framesHold = this.sprites.jumpLeft.framesHold;
                        this.currentFrame = 0;
                    }
                }
                break
            case 'fall':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.fall.image) {
                        this.image = this.sprites.fall.image;
                        this.frames = this.sprites.fall.frames;
                        this.framesHold = this.sprites.fall.framesHold;
                        this.currentFrame = 0;
                    }
                } else {
                    if(this.image != this.sprites.fallLeft.image) {
                        this.image = this.sprites.fallLeft.image;
                        this.frames = this.sprites.fallLeft.frames;
                        this.framesHold = this.sprites.fallLeft.framesHold;
                        this.currentFrame = 0;
                    }
                }
                break
        }
    }
    collisionX() {
        this.position.x += this.velocity.x;
        for(let i = 0; i < level.length; i+=4) {
            if(this.position.x + this.width > level[i] && this.position.x < level[i+1] &&
                this.position.y + this.height > level[i+2] && this.position.y < level[i+3]) {
                if(this.velocity.x > 0) {
                    this.velocity.x = 0;
                    this.position.x = level[i] - this.width;
                }
                if(this.velocity.x < 0) {
                    this.velocity.x = 0;
                    this.position.x = level[i+1];
                }
            }
        }
    }
}
class Slime extends Sprite {
    constructor({position, velocity, imageSrc, scale = 1, frames = 6, offset = {x:0,y:0}, sprites, framesHold = 8}) {
        super({position, imageSrc, scale, frames, offset, framesHold});
        this.velocity = velocity;
        this.width = 80;
        this.height = 60;
        this.squished = false;
        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }
    tick() {
        this.position.x -= scrollX;
        this.draw();
        this.animate();
        this.position.x += scrollX;
        if(this.squished == false) {
            this.position.x += this.velocity;
            for(let i = 0; i < level.length; i+=4) {
                if(this.position.x + this.width > level[i] && this.position.x < level[i+1] &&
                    this.position.y + this.height > level[i+2] && this.position.y < level[i+3] ||
                    this.position.x + this.width > level[i+1] - 50 && this.position.x < level[i+1] && 
                    this.position.y < level[i+2] && this.position.y + this.height > level[i+2] - 50 ||
                    this.position.x < level[i] + 50 && this.position.x + this.width > level[i] && 
                    this.position.y < level[i+2] && this.position.y + this.height > level[i+2] - 50) {
                        this.velocity *= -1;
                        this.position.x += this.velocity;
                }
            }
            this.switchSprite('move');
            if(player.position.x + player.width > this.position.x && player.position.x < this.position.x + this.width && player.velocity.y > 0
                && player.position.y + player.height > this.position.y - 10 && player.position.y < this.position.y + 20 ) {
                this.squished = true;
                this.switchSprite('squished');
                player.velocity.y = -16;
                for(let i = 0; i < 5; i++) {
                    particles.push(this.position.x);
                    particles.push(this.position.y);
                    particles.push(Math.floor(Math.random() * 17) - 8);
                    particles.push(Math.floor(Math.random() * 4) - 10);
                    particles.push(Math.floor(Math.random() * 30));
                }
            }
        }
    }
    switchSprite(sprite) {
        switch(sprite) {
            case 'move':
                if(this.image != this.sprites.move.image) {
                    this.image = this.sprites.move.image;
                    this.frames = this.sprites.move.frames;
                    this.framesHold = this.sprites.move.framesHold;
                    this.currentFrame = 0;
                }
                break
            case 'squished':
                if(this.image != this.sprites.squished.image) {
                    this.image = this.sprites.squished.image;
                    this.frames = this.sprites.squished.frames;
                    this.framesHold = this.sprites.squished.framesHold;
                    this.currentFrame = 0;
                }
                break
        }
    }
}

const sky = new Sprite({position:{x:-10,y:-200}, imageSrc: 'Sky.svg', scale: 2, scrollSpeed: 5});
const hills = new Sprite({position:{x:-60,y:285}, imageSrc: 'Hills.svg', scale: 2, scrollSpeed: 2});
const ground = new Sprite({position:{x:-10,y:216}, imageSrc: 'Ground.svg', scale: 2});
const player = new Player({ position:{x:-200,y:200}, imageSrc:'idle.svg', frames: 5, scale: 2, offset:{x:100,y:20},
sprites:{idle:{imageSrc:'idle.svg',frames:5,framesHold:5}, idleLeft:{imageSrc:'idle-left.svg',frames:5,framesHold:5}, run:{imageSrc:'run.svg',frames:9,framesHold:2},
runLeft:{imageSrc:'run-left.svg',frames:9,framesHold:2}, jump:{imageSrc:'jump.svg',frames:1}, jumpLeft:{imageSrc:'jump-left.svg',frames:1},
fall:{imageSrc:'fall.svg',frames:1}, fallLeft:{imageSrc:'fall-left.svg',frames:1}} });

const enemy = new Slime( {position:{x:2600,y:383}, velocity: -2, imageSrc: 'Slime_move.svg', scale: 2, offset:{x:-500,y:20},
sprites:{move:{imageSrc:'Slime_move.svg',frames:6,framesHold:8}, squished:{imageSrc:'Slime_squished.svg',frames:1}} });

const pressedKeys = {right: false, left: false};

function drawParticles() {
    for(let i = 0; i < particles.length; i+=5) {
        particles[i+3] += gravity;
        particles[i+1] += particles[i+3];
        for(let r = 0; r < level.length; r+=4) {
            if(particles[i] + 20 > level[r] && particles[i] < level[r+1] &&
                particles[i+1] + 20 > level[r+2] && particles[i+1] < level[r+3]) {
                particles[i+3] *= -0.6;
                particles[i+1] = level[r+2] - 20;
            }
        }
        particles[i+2] *= 0.95;
        particles[i] += particles[i+2];
        for(let t = 0; t < level.length; t+=4) {
            if(particles[i] + 20 > level[t] && particles[i] < level[t+1] &&
                particles[i+1] + 20 > level[t+2] && particles[i+1] < level[t+3]) {
                if(particles[i+2] > 0) {
                    particles[i+2] = 0;
                    particles[i] = level[t] - 20;
                }
                if(particles[i+2] < 0) {
                    particles[i+2] = 0;
                    particles[i] = level[t+1];
                }
            }
        }
        let img = new Image();
        img.src = 'Slime_particle.svg';
        particles[i] -= scrollX;
        c.drawImage(img, 0, 0, img.width, img.height, particles[i] + 540, particles[i+1], img.width, img.height);
        particles[i] += scrollX;
        particles[i+4] += 1;
        if(particles[i+4] == 150) {
            particles.splice(i,5);
        }
    }
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    sky.tick();
    hills.tick();
    ground.tick();
    enemy.tick();
    if(particles.length > 0) {
        drawParticles();
    }
    player.tick();

    player.acceleration = 0;
    if(pressedKeys.right == false && pressedKeys.left == false){
        player.switchSprite('idle');
    }
    if(pressedKeys.right) {
        player.acceleration += 0.4;
        playerDirection = "right";
        player.switchSprite('run');
    }
    if(pressedKeys.left) {
        player.acceleration -= 0.4;
        playerDirection = "left";
        player.switchSprite('run');
    }
    if(player.velocity.y < 0) {
        player.switchSprite('jump');
    }
    if(player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    player.velocity.x += player.acceleration;
    player.velocity.x *= 0.94;
    player.collisionX();
}

gameLoop();

window.addEventListener('keydown', (event) => {
    if(event.key == 'd' || event.key == 'ArrowRight') {
        pressedKeys.right = true;
        track.play();
    }
    if(event.key == 'a' || event.key == 'ArrowLeft') {
        pressedKeys.left = true;
    }
    if (player.air < 3) {
        if(event.key == 'w' || event.key == 'ArrowUp') {
            player.velocity.y = -16;
        }
    }
})
window.addEventListener('keyup', (event) => {
    if(event.key == 'd' || event.key == 'ArrowRight') {
        pressedKeys.right = false;
    }
    if(event.key == 'a' || event.key == 'ArrowLeft') {
        pressedKeys.left = false;
    }
})
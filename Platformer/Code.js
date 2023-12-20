const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
let scrollX = 0, scrollY = 0, playerDirection = "right";
const level = [-600,3700,450,800, 1095,1180,335,450, 1300,1390,225,450, 1390,1485,335,450];
//let track = new Audio('GameTrack.ogg');
let jump = new Audio('jump.wav');
let squish = new Audio('squish.wav');
let slimes = [2500,383,4,0,0,0,'Slime_move.svg',6];
let slimeImg = new Image();
let particles = [];
let particleImg = new Image();
particleImg.src = 'Slime_particle.svg';

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

const sky = new Sprite({position:{x:-10,y:-200}, imageSrc: 'Sky.svg', scale: 2, scrollSpeed: 5});
const hills = new Sprite({position:{x:-60,y:285}, imageSrc: 'Hills.svg', scale: 2, scrollSpeed: 2});
const ground = new Sprite({position:{x:-10,y:216}, imageSrc: 'Ground.svg', scale: 2});
const player = new Player({ position:{x:-200,y:200}, imageSrc:'idle.svg', frames: 5, scale: 2, offset:{x:100,y:20},
sprites:{idle:{imageSrc:'idle.svg',frames:5,framesHold:5}, idleLeft:{imageSrc:'idle-left.svg',frames:5,framesHold:5}, run:{imageSrc:'run.svg',frames:9,framesHold:2},
runLeft:{imageSrc:'run-left.svg',frames:9,framesHold:2}, jump:{imageSrc:'jump.svg',frames:1}, jumpLeft:{imageSrc:'jump-left.svg',frames:1},
fall:{imageSrc:'fall.svg',frames:1}, fallLeft:{imageSrc:'fall-left.svg',frames:1}} });

const pressedKeys = {right: false, left: false};

function drawSlimes() {
    for(let i = 0; i < slimes.length; i+=8) {
        slimes[i] -= scrollX;
        slimeImg.src = slimes[i+6];
        c.drawImage(slimeImg, slimes[i+4] * (slimeImg.width / slimes[i+7]), 0,
            slimeImg.width / slimes[i+7], slimeImg.height, slimes[i] + 500, slimes[i+1] - 20, 
            (slimeImg.width / slimes[i+7]) * 2, slimeImg.height * 2);
        slimes[i+5]++;
        if(slimes[i+5] % 6 == 0) {
            if(slimes[i+4] < slimes[i+7] - 1) {
                slimes[i+4]++;
            } else {
                slimes[i+4] = 0;
            }
        }
        slimes[i] += scrollX;
        if(slimes[i+3] == 0) {
            slimes[i] += slimes[i+2];
            for(let s = 0; s < level.length; s+=4) {
                if(slimes[i] + 80 > level[s] && slimes[i] < level[s+1] &&
                    slimes[i+1] + 60 > level[s+2] && slimes[i+1] < level[s+3] ||
                    slimes[i] + 80 > level[s+1] - 50 && slimes[i] < level[s+1] && 
                    slimes[i+1] < level[s+2] && slimes[i+1] + 60 > level[s+2] - 50 ||
                    slimes[i] < level[s] + 50 && slimes[i] + 80 > level[s] && 
                    slimes[i+1] < level[s+2] && slimes[i+1] + 60 > level[s+2] - 50) {
                        slimes[i+2] *= -1;
                        slimes[i] += slimes[i+2];
                }
            }
            if(player.position.x + player.width > slimes[i] && player.position.x < slimes[i] + 80 && player.velocity.y > 0
                && player.position.y + player.height > slimes[i+1] && player.position.y < slimes[i+1] + 20 ) {
                slimes[i+3] = 1;
                slimes[i+6] = 'Slime_squished.svg';
                slimes[i+4] = 0;
                slimes[i+7] = 1;
                player.velocity.y = -16;
                for(let p = 0; p < 5; p++) {
                    particles.push(slimes[i]);
                    particles.push(slimes[i+1]);
                    particles.push(Math.random() * 17 - 8);
                    particles.push(Math.random() * 4 - 10);
                    particles.push(0);
                    squish.play();
                }
            }
        } else {
            slimes[i+3]++;
            if(slimes[i+3] == 120) {
                slimes.splice(i,8);
            }
        } 
    }
}

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
        particles[i] -= scrollX;
        c.drawImage(particleImg, 0, 0, particleImg.width, particleImg.height, particles[i] + 540, particles[i+1], particleImg.width, particleImg.height);
        particles[i] += scrollX;
        particles[i+4] += 1;
        if(particles[i+4] == 120) {
            particles.splice(i,5);
        }
    }
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    sky.tick();
    hills.tick();
    ground.tick();
    if(slimes.length > 0) {
        drawSlimes();
    }
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
    }
    if(event.key == 'a' || event.key == 'ArrowLeft') {
        pressedKeys.left = true;
    }
    if (player.air < 3) {
        if(event.key == 'w' || event.key == 'ArrowUp') {
            player.velocity.y = -16;
            jump.play();
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
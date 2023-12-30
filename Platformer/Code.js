const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
let scrollX = 0, scrollY = 0, playerDirection = "right", playerHit = 0;
const level = [-600,3700,450,800, 1095,1180,335,450, 1300,1390,229,450, 1390,1485,335,450, 3855,4545,330,550, 4650,5150,214,300, 5300,10000,171,800,
5914,6014,40,171, 7045,7145,40,171, 6150,6895,-115,0, 7923,8013,56,171, 8598,8688,56,171];
//let track = new Audio('GameTrack.ogg');
let jump = new Audio('jump.wav');
let squish = new Audio('squish.wav');
let hit = new Audio('Player Hit.wav');
let lose = new Audio('Game Over.mp3');
let collect = new Audio('collect.wav');
let slimes = [2500,385,4,0,0,0,'Slime_move.svg',6, 4100,265,-4,0,0,0,'Slime_move.svg',6, 4800,149,4,0,0,0,'Slime_move.svg',6, 6100,106,-4,0,0,0,'Slime_move.svg',6,
8200,106,4,0,0,0,'Slime_move.svg',6, 8350,106,-4,0,0,0,'Slime_move.svg',6, 8500,106,-4,0,0,0,'Slime_move.svg',6];
let coins = [500,390,0,0,0, 600,390,0,0,0, 700,390,0,0,0, 1600,-50,0,0,0, 3400,390,0,0,0, 3550,390,0,0,0, 4800,120,0,0,0, 4900,120,0,0,0, 5000,120,0,0,0, 
6350,-190,0,0,0, 6500,-190,0,0,0, 6650,-190,0,0,0, 6500,100,0,0,0, 6650,100,0,0,0, 8180,-180,0,0,0, 8330,-180,0,0,0, 8480,-180,0,0,0, 9400,100,0,0,0];
let coinImage = new Image();
coinImage.src = 'Coin.svg';
let particles = [];
let particleImg = new Image();
particleImg.src = 'Slime_particle.svg';
let healthDisplay = new Image();
healthDisplay.src = 'Lives.svg';
let Score = 0;

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
        this.position.y -= (scrollY - 150) / this.scrollSpeed;
        this.draw();
        this.animate();
        this.position.x += scrollX / this.scrollSpeed;
        this.position.y += (scrollY - 150) / this.scrollSpeed;
    }
}
class Player extends Sprite {
    constructor({position, imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}, sprites, framesHold = 5}) {
        super({position, imageSrc, scale, frames, offset, framesHold});
        this.velocity = {x:0,y:0};
        this.acceleration = 0;
        this.width = 50;
        this.height = 150;
        this.health = 6;
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
        if(this.position.x > 9460) {
            this.position.x = 9460;
        }
        this.position.x = this.position.x - scrollX + 512;
        this.position.y = this.position.y - scrollY + 150;
        this.draw();
        this.animate();
        this.position.x = this.position.x + scrollX - 512;
        this.position.y = this.position.y + scrollY;
        this.air++;
        this.position.y += this.velocity.y - 150;
        if(this.position.y > 1000 || this.health == 0) {
            this.position.x = -200;
            this.position.y = 200;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.acceleration = 0;
            this.air = 99;
            this.health = 6;
            scrollX = 0;
            scrollY = 0;
            Score = 0;
            slimes = [2500,385,4,0,0,0,'Slime_move.svg',6, 4100,265,-4,0,0,0,'Slime_move.svg',6, 4800,149,4,0,0,0,'Slime_move.svg',6, 6100,106,-4,0,0,0,'Slime_move.svg',6,
            8200,106,4,0,0,0,'Slime_move.svg',6, 8350,106,-4,0,0,0,'Slime_move.svg',6, 8500,106,-4,0,0,0,'Slime_move.svg',6];
            coins = [500,390,0,0,0, 600,390,0,0,0, 700,390,0,0,0, 1600,-50,0,0,0, 3400,390,0,0,0, 3550,390,0,0,0, 4800,120,0,0,0, 4900,120,0,0,0, 5000,120,0,0,0, 
            6350,-190,0,0,0, 6500,-190,0,0,0, 6650,-190,0,0,0, 6500,100,0,0,0, 6650,100,0,0,0, 8180,-180,0,0,0, 8330,-180,0,0,0, 8480,-180,0,0,0, 9400,100,0,0,0];
            lose.play();
        }
        scrollX = this.position.x;
        if(scrollX < 0) {
            scrollX = 0;
        } 
        if(scrollX > 9000) {
            scrollX = 9000;
        }
        scrollY = this.position.y / 1.5;
        if(scrollY > 220) {
            scrollY = 220;
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
                    this.position.y = level[i+3];
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
                        this.currentFrame = 0;
                    }
                } else {
                    if(this.image != this.sprites.jumpLeft.image) {
                        this.image = this.sprites.jumpLeft.image;
                        this.frames = this.sprites.jumpLeft.frames;
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
            case 'hurt':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.hurt.image) {
                        this.image = this.sprites.hurt.image;
                        this.frames = this.sprites.hurt.frames;
                        this.framesHold = this.sprites.hurt.framesHold;
                        this.currentFrame = 0;
                    }
                } else {
                    if(this.image != this.sprites.hurtLeft.image) {
                        this.image = this.sprites.hurtLeft.image;
                        this.frames = this.sprites.hurtLeft.frames;
                        this.framesHold = this.sprites.hurtLeft.framesHold;
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

const sky = new Sprite({position:{x:-10,y:-220}, imageSrc: 'Sky.svg', scale: 2, scrollSpeed: 5});
const hills = new Sprite({position:{x:-250,y:210}, imageSrc: 'Hills.svg', scale: 2, scrollSpeed: 2});
const ground = new Sprite({position:{x:-10,y:-120}, imageSrc: 'Ground.svg', scale: 2});
const player = new Player({ position:{x:-200,y:200}, imageSrc:'idle.svg', frames: 5, scale: 2, offset:{x:100,y:20},
sprites:{idle:{imageSrc:'idle.svg',frames:5,framesHold:5}, idleLeft:{imageSrc:'idle-left.svg',frames:5,framesHold:5}, run:{imageSrc:'run.svg',frames:9,framesHold:2},
runLeft:{imageSrc:'run-left.svg',frames:9,framesHold:2}, jump:{imageSrc:'jump.svg',frames:1}, jumpLeft:{imageSrc:'jump-left.svg',frames:1},
fall:{imageSrc:'fall.svg',frames:1}, fallLeft:{imageSrc:'fall-left.svg',frames:1}, hurt:{imageSrc:'hurt.svg',frames:4,framesHold:6}, 
hurtLeft:{imageSrc:'hurt-left.svg',frames:4,framesHold:6}} });

const pressedKeys = {right: false, left: false, h: false};

function drawCoins() {
    for(let i = 0; i < coins.length; i+=5) {
        coins[i] -= scrollX;
        coins[i+1] -= coins[i+4];
        coins[i+1] -= scrollY - 150;
        c.drawImage(coinImage, coins[i+3] * (coinImage.width / 4), 0,
        coinImage.width / 4, coinImage.height, coins[i] + 495, coins[i+1] - 20, 
        coinImage.width / 4, coinImage.height);
        coins[i+2]++;
        if(coins[i+2] % 6 == 0) {
            if(coins[i+3] < 3) {
                coins[i+3]++;
            } else {
                coins[i+3] = 0;
            }
        }
        coins[i] += scrollX;
        coins[i+1] += coins[i+4];
        coins[i+1] += scrollY - 150;
        if(coins[i+4] == 0) {
            if(player.position.x + player.width > coins[i] && player.position.x < coins[i] + 30
                && coins[i+1] + 50 > player.position.y && coins[i+1] < player.position.y + player.height) {
                coins[i+4] = 1;
                collect.play();
                Score += 10;
            }
        } else {
            coins[i+4] += 2;
            if(coins[i+4] == 35) {
                coins.splice(i,5);
            }
        }
    }
}

function drawSlimes() {
    for(let i = 0; i < slimes.length; i+=8) {
        slimes[i] -= scrollX;
        slimes[i+1] -= scrollY - 150;
        slimeImg = new Image();
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
        slimes[i+1] += scrollY - 150;
        if(slimes[i+3] == 0) {
            slimes[i] += slimes[i+2];
            for(let s = 0; s < level.length; s+=4) {
                if(slimes[i] + 100 > level[s] && slimes[i] < level[s+1] &&
                    slimes[i+1] + 60 > level[s+2] && slimes[i+1] < level[s+3] ||
                    slimes[i] + 80 > level[s+1] - 50 && slimes[i] < level[s+1] && 
                    slimes[i+1] < level[s+2] && slimes[i+1] + 60 > level[s+2] - 30 ||
                    slimes[i] < level[s] + 30 && slimes[i] + 80 > level[s] && 
                    slimes[i+1] < level[s+2] && slimes[i+1] + 60 > level[s+2] - 30) {
                        slimes[i+2] *= -1;
                        slimes[i] += slimes[i+2];
                }
            }
            if(player.position.x + player.width > slimes[i] && player.position.x < slimes[i] + 80 && player.velocity.y > 0
                && player.position.y + player.height > slimes[i+1] - 5 && player.position.y + player.height < slimes[i+1] + 20) {
                slimes[i+3] = 1;
                slimes[i+4] = 0;
                slimes[i+6] = 'Slime_squished.svg';
                slimes[i+7] = 1;
                player.velocity.y = -16;
                Score += 50;
                squish.play();
                for(let p = 0; p < 5; p++) {
                    particles.push(slimes[i]);
                    particles.push(slimes[i+1]);
                    particles.push(Math.random() * 17 - 8);
                    particles.push(Math.random() * 4 - 10);
                    particles.push(0);
                }
            } else if(playerHit == 0 && player.position.x + player.width > slimes[i] && player.position.x < slimes[i] + 80
                && slimes[i+1] + 60 > player.position.y && slimes[i+1] < player.position.y + player.height) {
                playerHit = 1;
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
        particles[i+1] -= scrollY - 150;
        c.drawImage(particleImg, 0, 0, particleImg.width, particleImg.height, particles[i] + 540, particles[i+1], particleImg.width, particleImg.height);
        particles[i] += scrollX;
        particles[i+1] += scrollY - 150;
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
    c.drawImage(healthDisplay, (player.health) * (healthDisplay.width / 7), 0, healthDisplay.width / 7, 
    healthDisplay.height, 20, 20, healthDisplay.width / 7, healthDisplay.height);
    if(coins.length > 0) {
        drawCoins();
    }
    if(slimes.length > 0) {
        drawSlimes();
    }
    if(particles.length > 0) {
        drawParticles();
    }
    if(playerHit >= 1) {
        if(playerHit == 1) {
            player.health -= 1;
            hit.play();
        }
        playerHit += 1
        if(playerHit == 50) {
            playerHit = 0;
        }
    }
    player.tick();
    player.acceleration = 0;
    if(playerHit == 0 || (playerHit > 0 && playerHit >= 18)) {
        if(pressedKeys.right == false && pressedKeys.left == false){
            player.switchSprite('idle');
        }
        if(pressedKeys.right) {
            player.acceleration += .4;
            playerDirection = "right";
            player.switchSprite('run');
        }
        if(pressedKeys.left) {
            player.acceleration -= .4;
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
    } else {
        player.switchSprite('hurt');
    }
    document.getElementById("scoreDisplay").innerHTML = "Score: ";
    if(String(Score).length == 1) {
        document.getElementById("scoreDisplay").innerHTML += "00";
    } else if(String(Score).length == 2) {
        document.getElementById("scoreDisplay").innerHTML += "0";
    }
    document.getElementById("scoreDisplay").innerHTML += String(Score);
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
    if(event.key == 'h') {
        pressedKeys.h = true;
    }
})
window.addEventListener('keyup', (event) => {
    if(event.key == 'd' || event.key == 'ArrowRight') {
        pressedKeys.right = false;
    }
    if(event.key == 'a' || event.key == 'ArrowLeft') {
        pressedKeys.left = false;
    }
    if(event.key == 'h') {
        pressedKeys.h = false;
    }
})
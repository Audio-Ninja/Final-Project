const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 576
const gravity = 0.7
let scrollX = 0, scrollY = 0, playerDirection = "right"

class Sprite {
    constructor({position, imageSrc, scale = 1, scrollSpeed = 1,frames = 1, offset = {x:0,y:0}}) {
        this.position = position
        this.width
        this.height
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.scrollSpeed = scrollSpeed
        this.frames = frames
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }
    draw() {
        c.drawImage(this.image, 
            this.currentFrame * (this.image.width / this.frames),
            0,
            this.image.width / this.frames,
            this.image.height, this.position.x - this.offset.x, this.position.y - this.offset.y, 
            (this.image.width / this.frames) * this.scale, this.image.height * this.scale)
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
    constructor({position, velocity, acceleration, imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}, air, sprites, framesHold = 5}) {
        super({position, imageSrc, scale, frames, offset});
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.width = 50;
        this.height = 150;
        this.health = 100;
        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.air = air;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
    tick() {
        this.position.x = (this.position.x - scrollX / this.scrollSpeed) + 512;
        this.draw();
        this.animate();
        this.position.x = (this.position.x + scrollX / this.scrollSpeed) - 512;
        this.air++
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        scrollX = this.position.x
        if(scrollX < 0) {
            scrollX = 0
        } 
        if(scrollX > 2000) {
            scrollX = 2000
        }
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 126) {
            this.velocity.y = 0
            this.position.y = 300
            this.air = 0
        } else this.velocity.y += gravity
    }
    switchSprite(sprite) {
        switch(sprite) {
            case 'idle':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.idle.image) {
                        this.image = this.sprites.idle.image
                        this.frames = this.sprites.idle.frames
                        this.framesHold = this.sprites.idle.framesHold
                        this.currentFrame = 0
                    }
                } else {
                    if(this.image != this.sprites.idleLeft.image) {
                        this.image = this.sprites.idleLeft.image
                        this.frames = this.sprites.idleLeft.frames
                        this.framesHold = this.sprites.idleLeft.framesHold
                        this.currentFrame = 0
                    }
                }
                break
            case 'run':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.run.image) {
                        this.image = this.sprites.run.image
                        this.frames = this.sprites.run.frames
                        this.framesHold = this.sprites.run.framesHold
                        this.currentFrame = 0
                    }
                } else {
                    if(this.image != this.sprites.runLeft.image) {
                        this.image = this.sprites.runLeft.image
                        this.frames = this.sprites.runLeft.frames
                        this.framesHold = this.sprites.runLeft.framesHold
                        this.currentFrame = 0
                    }
                }
                break
            case 'jump':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.jump.image) {
                        this.image = this.sprites.jump.image
                        this.frames = this.sprites.jump.frames
                        this.framesHold = this.sprites.jump.framesHold
                        this.currentFrame = 0
                    }
                } else {
                    if(this.image != this.sprites.jumpLeft.image) {
                        this.image = this.sprites.jumpLeft.image
                        this.frames = this.sprites.jumpLeft.frames
                        this.framesHold = this.sprites.jumpLeft.framesHold
                        this.currentFrame = 0
                    }
                }
                break
            case 'fall':
                if(playerDirection == "right") {
                    if(this.image != this.sprites.fall.image) {
                        this.image = this.sprites.fall.image
                        this.frames = this.sprites.fall.frames
                        this.framesHold = this.sprites.fall.framesHold
                        this.currentFrame = 0
                    }
                } else {
                    if(this.image != this.sprites.fallLeft.image) {
                        this.image = this.sprites.fallLeft.image
                        this.frames = this.sprites.fallLeft.frames
                        this.framesHold = this.sprites.fallLeft.framesHold
                        this.currentFrame = 0
                    }
                }
                break
        }
    }
}

const sky = new Sprite({position:{x:-10,y:-200}, imageSrc: 'Sky.svg', scale: 2, scrollSpeed: 5})
const hills = new Sprite({position:{x:-60,y:280}, imageSrc: 'Hills.svg', scale: 2, scrollSpeed: 2})
const ground = new Sprite({position:{x:-10,y:246}, imageSrc: 'Ground.svg', scale: 2})
const player = new Player({ position:{x:100,y:100}, velocity:{x:0,y:0}, acceleration: 0, imageSrc:'idle.svg', frames: 5, scale: 2, offset:{x:100,y:20},
air: 0, sprites:{idle:{imageSrc:'idle.svg',frames:5,framesHold:5}, idleLeft:{imageSrc:'idle-left.svg',frames:5,framesHold:5}, run:{imageSrc:'run.svg',frames:9,framesHold:2},
runLeft:{imageSrc:'run-left.svg',frames:9,framesHold:2}, jump:{imageSrc:'jump.svg',frames:1}, jumpLeft:{imageSrc:'jump-left.svg',frames:1},
fall:{imageSrc:'fall.svg',frames:1}, fallLeft:{imageSrc:'fall-left.svg',frames:1}} })

const pressedKeys = {right: false, left: false}

function gameLoop() {
    window.requestAnimationFrame(gameLoop)
    sky.tick()
    hills.tick()
    ground.tick()
    player.tick()
    player.acceleration = 0
    if(pressedKeys.right == false && pressedKeys.left == false){
        player.switchSprite('idle')
    }
    if(pressedKeys.right) {
        player.acceleration += 0.4
        playerDirection = "right"
        player.switchSprite('run')
    }
    if(pressedKeys.left) {
        player.acceleration -= 0.4
        playerDirection = "left"
        player.switchSprite('run')
    }
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    player.velocity.x += player.acceleration
    player.velocity.x *= 0.94
}

gameLoop()

window.addEventListener('keydown', (event) => {
    if(event.key == 'd' || event.key == 'ArrowRight') {
        pressedKeys.right = true
    }
    if(event.key == 'a' || event.key == 'ArrowLeft') {
        pressedKeys.left = true
    }
    if (player.air < 3) {
        if(event.key == 'w' || event.key == 'ArrowUp') {
            player.velocity.y = -16
        }
    }
})
window.addEventListener('keyup', (event) => {
    if(event.key == 'd' || event.key == 'ArrowRight') {
        pressedKeys.right = false
    }
    if(event.key == 'a' || event.key == 'ArrowLeft') {
        pressedKeys.left = false
    }
})
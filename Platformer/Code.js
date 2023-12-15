const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const gravity = 0.7
canvas.width = 1024
canvas.height = 576

class Sprite {
    constructor({position, imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}}) {
        this.position = position
        this.width
        this.height
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
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
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }
    tick() {
        this.draw()
        this.animate()
    }
}
class Player extends Sprite {
    constructor({position, velocity, acceleration, imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}, sprites, framesHold}) {
        super({position, imageSrc, scale, frames, offset})
        this.velocity = velocity
        this.acceleration = acceleration
        this.width = 50
        this.height = 150
        this.lastKey
        this.health = 100
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = framesHold
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
    tick() {
        this.draw()
        this.animate()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 106) {
            this.velocity.y = 0
            this.position.y = 320
        } else this.velocity.y += gravity
    }
}

const sky = new Sprite({ position:{x:-10,y:0}, imageSrc: 'Sky.svg', scale: 2})
const player = new Player({ position:{x:100,y:100}, velocity:{x:0,y:0}, acceleration: 0, imageSrc:'idle.svg', frames: 5, scale: 2, offset:{x:100,y:20},
sprites:{idle:{imageSrc:'idle.svg',frames:5,framesHold:5}} })

const pressedKeys = {right: false, left: false}

function gameLoop() {
    window.requestAnimationFrame(gameLoop)
    sky.tick()
    player.tick()
    player.acceleration = 0
    if(pressedKeys.right == true) {
        player.acceleration += 0.4
    }
    if(pressedKeys.left == true) {
        player.acceleration -= 0.4
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
    if(event.key == 'w' || event.key == 'ArrowUp') {
        player.velocity.y = -15
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
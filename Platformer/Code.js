const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

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
    constructor({position, velocity, imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}, sprites, framesHold}) {
        super({position, imageSrc, scale, frames, offset})
        this.velocity = velocity
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
}

const sky = new Sprite({ position:{x:-10,y:0}, imageSrc: 'Sky.svg', scale: 2})
const player = new Player({ position:{x:100,y:10}, velocity:{x:0,y:0}, imageSrc:'idle.svg', frames: 5, scale: 2, offset:{x:100,y:20},
sprites:{idle:{imageSrc:'Perma_idle.svg',frames:5,framesHold:5}} })

function gameLoop() {
    window.requestAnimationFrame(gameLoop)
    sky.tick()
}

gameLoop()
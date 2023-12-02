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
    animateFrames() {
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold == 0) {
            if(this.currentFrame < this.frames - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }
    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({position, velocity, color = 'cyan', imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}, sprites}) {
        super({position, imageSrc, scale, frames, offset})
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {position: {x: this.position.x, y: this.position.y}, offset, width: 100, height: 50}
        this.color = color
        this.isAttacking
        this.health = 100
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
    }
    update() {
        this.draw()
        this.animateFrames()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 106) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}
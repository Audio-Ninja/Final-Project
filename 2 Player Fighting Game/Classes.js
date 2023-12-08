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
    constructor({position, velocity, color = 'cyan', imageSrc, scale = 1, frames = 1, offset = {x:0,y:0}, sprites, framesHold, 
    attackBox = {offset: {}, width: undefined, height: undefined}}) {
        super({position, imageSrc, scale, frames, offset})
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {position: {x: this.position.x, y: this.position.y}, offset: attackBox.offset, width: attackBox.width, height: attackBox.height}
        this.color = color
        this.isAttacking
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
    update() {
        this.draw()
        this.animateFrames()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 106) {
            this.velocity.y = 0
            this.position.y = 320
        } else this.velocity.y += gravity
    }
    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
    }
    takeHit() {
        this.switchSprite('hurt')
        this.health -= 5;
    }
    switchSprite(sprite) {
        //override all other animations when attacking
        if(this.image == this.sprites.attack.image && this.currentFrame + 1 < this.sprites.attack.frames) return
        switch(sprite) {
            case 'idle':
                if(this.image != this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.frames = this.sprites.idle.frames
                    this.framesHold = this.sprites.idle.framesHold
                    this.currentFrame = 0
                }
                break
            case 'run':
                if(this.image != this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.frames = this.sprites.run.frames
                    this.framesHold = this.sprites.run.framesHold
                    this.currentFrame = 0
                }
                break
            case 'jump':
                if(this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.frames = this.sprites.jump.frames
                    this.framesHold = this.sprites.jump.framesHold
                    this.currentFrame = 0 
                }
                break
            case 'fall':
                if(this.image != this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.frames = this.sprites.fall.frames
                    this.framesHold = this.sprites.fall.framesHold
                    this.currentFrame = 0 
                }
                break
            case 'attack':
                if(this.image != this.sprites.attack.image) {
                    this.image = this.sprites.attack.image
                    this.frames = this.sprites.attack.frames
                    this.framesHold = this.sprites.attack.framesHold
                    this.currentFrame = 0 
                }
                break
        }
    }
}
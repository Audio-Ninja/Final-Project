const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
const gravity = 0.7

const background = new Sprite({ position:{x:-10,y:0}, imageSrc: 'Background.svg', scale: 2})
const player = new Fighter({ position:{x:100,y:10}, velocity:{x:0,y:0}, imageSrc: 'Perma_idle.svg', 
frames: 5, scale: 2, offset:{x:100,y:20}, sprites:{idle:{imageSrc:'Perma_idle.svg',frames:5,framesHold:5}, 
run:{imageSrc:'Perma_run.svg',frames:9,framesHold:2}, jump:{imageSrc:'Perma_jump.svg',frames:1}, fall:{imageSrc:'Perma_fall.svg',frames:1},
attack:{imageSrc:'Perma_attack.svg',frames:7, framesHold:5}}, hurt:{imageSrc:'Perma_hurt.svg',frames:2,framesHold:7},
attackBox:{offset:{x:20,y:20}, width: 140, height: 80} })

const enemy = new Fighter({ position:{x:600,y:10}, velocity:{x:0,y:0},color: 'orange', imageSrc: 'Lightez_idle.svg', 
frames: 5, scale: 2, offset:{x:240,y:20}, sprites:{idle:{imageSrc:'Lightez_idle.svg',frames:5,framesHold:5}, 
run:{imageSrc:'Lightez_run.svg',frames:9,framesHold:2}, jump:{imageSrc:'Lightez_jump.svg',frames:1}, fall:{imageSrc:'Lightez_fall.svg',frames:1},
attack:{imageSrc:'Lightez_attack.svg',frames:7,framesHold:5}}, hurt:{imageSrc:'Lightez_hurt.svg',frames:2,framesHold:7},
attackBox:{offset:{x:-130,y:40}, width: 160, height: 50} })

const keys = {a:{pressed: false}, d:{pressed: false}, ArrowRight:{pressed: false}, ArrowLeft:{pressed: false}}
decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    background.update()
    player.update()
    enemy.update()
    player.velocity.x = 0;
    if(keys.a.pressed && player.lastKey == 'a' ) {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if(keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    enemy.velocity.x = 0;
    if(keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft' ) {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if(keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    //detect collision for enemy
    if(rectangularCollision({rect1: player, rect2: enemy}) && player.currentFrame == 3) {
        player.isAttacking = false
        enemy.health -= 5;
        document.querySelector("#enemyHealth").style.width = enemy.health + '%'
    }
    //if player misses
    if(player.isAttacking && player.currentFrame == 3) {
        player.isAttacking = false
    }
    //detect collision for player
    if(rectangularCollision({rect1: enemy, rect2: player}) && enemy.currentFrame == 3) {
        enemy.isAttacking = false
        player.health -= 5;
        document.querySelector("#playerHealth").style.width = player.health + '%'
    }
    //if enemy misses
    if(enemy.isAttacking && enemy.currentFrame == 3) {
        enemy.isAttacking = false
    }
    // end game based on healh
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if(player.health > 0) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey ='d'
                break
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -18
                break
            case ' ':
                player.attack()
                break
        }
    }
    if(enemy.health > 0) {
        switch(event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey ='ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -18
                break
            case '0':
                enemy.attack()
                break
        }
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
    }
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
    }
})
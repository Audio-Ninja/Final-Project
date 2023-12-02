function rectangularCollision({rect1,rect2}) {
    return (rect1.isAttacking && rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x
        && rect1.attackBox.position.x <= rect2.position.x + rect2.width
        && rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
        && rect1.attackBox.position.y <= rect2.position.y + rect2.height)
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#result').style.display = 'flex'
    if(player.health == enemy.health) {
        document.querySelector('#result').innerHTML = "TIE"
    } else if (player. health > enemy.health) {
        document.querySelector('#result').innerHTML = "PLAYER 1 WINS"
    } else document.querySelector('#result').innerHTML = "PLAYER 2 WINS"
}

let timer = 60
let timerId
function decreaseTimer() {
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if(timer == 0) {
        determineWinner({player, enemy, timeId})
    }
}
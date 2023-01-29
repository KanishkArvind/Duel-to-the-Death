function rectangularCollision({rectangle1, rectangle2}){
  return(
    //checks if the position of right side of the player's attackBox is greater than the postion of the left side of enemy
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    //checks whether the player's attackbox havent moved passed the enemy position
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    //checks if the position of down side of player attackbox is less than the upper side of enemy
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({player, enemy, timerId}){
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if(player.health == enemy.health){
    document.querySelector('#displayText').innerHTML = "DRAW"
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = "Player 1 Wins"
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = "Player 2 Wins"
  }
}

let timer = 60
let timerId
function decreaseTimer(){
  timerId = setTimeout(decreaseTimer, 1000)
  if(timer > 0){
    timer--
    document.querySelector('#timer').innerHTML = timer
  }
  if (timer == 0){
    determineWinner({player, enemy, timerId})
  }
}

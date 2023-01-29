const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: 'background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: 'shop.png',
  scale: 2.75,
  framesMax: 6
})

//player start position
const player = new Fighter({
  position: {
  x: 0,
  y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 215,
    y: 157
  },
  imageSrc: 'samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: 'samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: 'samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: 'samuraiMack/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: 'samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 155,
    height: 50
  }
})
//enemy start position
const enemy = new Fighter({
  position: {
  x: 400,
  y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 215,
    y: 167
  },
  color: 'blue',
  imageSrc: 'kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: 'kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: 'kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc : 'kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: 'kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 160,
    height: 50
  }

})

console.log(player)

// defining keys
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed:false
  },
  l: {
    pressed: false
  },
  j: {
    pressed: false
  },
  i: {
    pressed: false
  },
}



decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black' // background for our canvas
  c.fillRect(0, 0, canvas.width, canvas.height)

  background.update()
  shop.update()

  c.fillStyle = "rgba(255, 255, 255, 0.15)"
  c.fillRect(0, 0, canvas.width, canvas.height)

  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //player movement

  if(keys.a.pressed && player.lastKey == 'a'){
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey == 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping and falling player
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }


  //enemy movement
  if(keys.j.pressed && enemy.lastKey == 'j'){
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.l.pressed && enemy.lastKey == 'l') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }
  //jumping and falling enemy
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //detect for collision for player
  if ( rectangularCollision({rectangle1: player, rectangle2: enemy}) &&
  player.isAttacking && player.framesCurrent == 4){
    enemy.takeHit()
    player.isAttacking = false

    document.querySelector('#enemyHealth').style.width = enemy.health + '%' // health deduction on getting hit
  }
  //if player misses
  if(player.isAttacking && player.framesCurrent == 4){
    player.isAttacking = false
  }


  //for enemy
  if ( rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
   enemy.isAttacking && enemy.framesCurrent == 2){
    player.takeHit()
    enemy.isAttacking = false
    document.querySelector('#playerHealth').style.width = player.health + '%'
    // gsap.to('#enemyHealth', {
    //   width: enemy.health + '%'
    // })
  }

  //if enemy misses
  if(enemy.isAttacking && enemy.framesCurrent == 2){
    enemy.isAttacking = false
  }

  //endgame based on health
  if (enemy.health <= 0 || player.health <= 0){
    determineWinner({player, enemy, timerId})
  }

}

animate()

//defining key functions
window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch(event.key) {
      //player key bindings
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
      break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
      break
      case 'w':
        player.velocity.y = -15
      break
      case 's':
        player.attack()
      break
    }
  }
    //enemy key bindings
  if(!enemy.dead){
    switch (event.key) {
      case 'l':
        keys.l.pressed = true
        enemy.lastKey = 'l'
      break
      case 'j':
        keys.j.pressed = true
        enemy.lastKey = 'j'
      break
      case 'i':
        enemy.velocity.y = -15
      break
      case 'k':
        // enemy.isAttacking = true
        enemy.attack()
      break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch(event.key) {
    //player
    case 'd':
      keys.d.pressed = false
    break
    case 'a':
      keys.a.pressed = false
    break

    //enemy
    case 'l':
      keys.l.pressed = false
    break
    case 'j':
      keys.j.pressed = false
    break

  }
})

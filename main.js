const grid = document.querySelector('.grid')
const width = 4
const gridLength = width ** 2
const domTiles = []
const newGameButton = document.querySelector('#new-game')
const continueButton = document.querySelector('#continue')
const tiles = []
const domScore = document.querySelector('#score')
let score = 0
const domBestScore = document.querySelector('#best-score')
let bestScore = 0
let winValue = 2048
let upBlocked = false
let rightBlocked = false
let downBlocked = false
let leftBlocked = false

// ? Creating the grid.
for (let index = 0; index < width ** 2; index++) {
  const div = document.createElement('div')
  grid.appendChild(div)
  const divInDiv = document.createElement('div')
  div.appendChild(divInDiv)
  divInDiv.classList.add('numbers')
  domTiles.push(div)
}

function initialiseTiles () {
  continueButton.style.visibility = 'hidden'
  const random1 = Math.floor(Math.random() * gridLength)
  let random2 = Math.floor(Math.random() * gridLength)
  if (random1 === random2) {
    random2 = Math.abs(random2 - 1)
  }
  for (let index = 0; index < gridLength; index++){
    if (index === random1 || index === random2) {
      tiles[index] = 2
    } else {
      tiles[index] = 0
    }
  }
}
initialiseTiles()

if (localStorage) {
  bestScore = localStorage.getItem('bestScore') || 0
}

function tilesValueToDomTiles () {
  for (let index = 0; index < gridLength; index++) {
    const domTile = domTiles[index]
    domTile.classList.remove(...domTile.classList)
    domTile.firstChild.innerHTML = ''
    domTile.style.visibility = 'visible'
    grid.classList.remove('victory', 'game-over')
    if (tiles[index] > 0) {
      domTile.classList.add('tile-' + tiles[index])
      domTile.firstChild.innerHTML = tiles[index]
    } else if (tiles[index] === -1) {
      domTile.style.visibility = 'hidden'
      grid.classList.add('game-over')
    } else if (tiles[index] < -1) {
      domTile.style.visibility = 'hidden'
      grid.classList.add('victory')
      continueButton.style.visibility = 'visible'
    }
  }
  domScore.innerHTML = 'Score : ' + score
  domBestScore.innerHTML = 'Best score : ' + bestScore
}
tilesValueToDomTiles()

// ? New game button
newGameButton.addEventListener('click', () => {
  if (score > bestScore) {
    bestScore = score
  }
  score = 0
  winValue = 32
  initialiseTiles()
  tilesValueToDomTiles()
})

// ? Continue button
continueButton.addEventListener('click', () => {
  winValue = -3
  for (let index = 0; index < tiles.length; index++) {
    tiles[index] = tiles[index] * -1 - 2
  }
  tilesValueToDomTiles()
  continueButton.style.visibility = 'hidden'
})

function setAndSaveBestScore () {
  if (score > bestScore) {
    bestScore = score
  }
  if (localStorage) {
    localStorage.setItem('bestScore', bestScore)
  }
}

// ? Random tile appearing after movement is done.
function randomTileAppears () {
  let random
  do {
    random = Math.floor(Math.random() * gridLength)
  } while (tiles[random] > 0)
  tiles[random] = 2
}

// ? Checking if a movement is possible (further direction and collision)
function canMoveUp (position, width) {
  const targetPosition = position - width
  if (targetPosition >= 0 && tiles[position] > 0 &&
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}
function canMoveRight (position, width) {
  const targetPosition = position + 1
  if (targetPosition % width !== 0 && tiles[position] > 0 &&
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}
function canMoveDown (position, width) {
  const targetPosition = position + width
  if (targetPosition < (width ** 2) && tiles[position] > 0 &&
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}
function canMoveLeft (position, width) {
  const targetPosition = position - 1
  if (position % width !== 0 && tiles[position] > 0 &&
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}

// ? Moving the numbers with the arrows.
document.addEventListener('keydown', (event) => {
  const key = event.key
  let hasMoved = false
  if (key === 'ArrowUp' || key === 'w') {
    for (let column = 0; column < width; column++) {
      for (let i = column; i < gridLength; i += width) {
        let index = i
        let hasMerged = false
        while (tiles[index] !== 0 && canMoveUp(index, width) && !hasMerged) {
          if (tiles[index - width] === tiles[index]) {
            tiles[index - width] *= 2
            score += tiles[index - width]
            setAndSaveBestScore()
            hasMerged = true
          } else {
            tiles[index - width] = tiles[index]
          }
          tiles[index] = 0
          index -= width
          hasMoved = true
        }
      }
    }
    if (!hasMoved) {
      upBlocked = true
    }
  } else if (key === 'ArrowRight' || key === 'd') {
    for (let line = width - 1; line < gridLength; line += width) {
      for (let i = line; i > (line - width - 1); i--) {
        let index = i
        let hasMerged = false
        while (tiles[index] !== 0 && canMoveRight(index, width) && !hasMerged) {
          if (tiles[index + 1] === tiles[index]) {
            tiles[index + 1] *= 2
            score += tiles[index + 1]
            setAndSaveBestScore()
            hasMerged = true
          } else {
            tiles[index + 1] = tiles[index]
          }
          tiles[index] = 0
          index++
          hasMoved = true
        }
      }
    }
    if (!hasMoved) {
      rightBlocked = true
    }
  } else if (key === 'ArrowDown' || key === 's') {
    for (let column = gridLength - width; column < gridLength; column++) {
      for (let i = column; i >= 0; i -= width) {
        let index = i
        let hasMerged = false
        while (tiles[index] !== 0 && canMoveDown(index, width) && !hasMerged) {
          if (tiles[index + width] === tiles[index]) {
            tiles[index + width] *= 2
            score += tiles[index + width]
            setAndSaveBestScore()
            hasMerged = true
          } else {
            tiles[index + width] = tiles[index]
          }
          tiles[index] = 0
          index += width
          hasMoved = true
        }
      }
    }
    if (!hasMoved) {
      downBlocked = true
    }
  } else if (key === 'ArrowLeft' || key === 'a') {
    for (let line = 0; line < gridLength; line += width) {
      for (let i = line; i < (line + width) ; i++) {
        let index = i
        let hasMerged = false
        while (tiles[index] !== 0 && canMoveLeft(index, width) && !hasMerged) {
          if (tiles[index - 1] === tiles[index]) {
            tiles[index - 1] *= 2
            score += tiles[index - 1]
            setAndSaveBestScore()
            hasMerged = true
          } else {
            tiles[index - 1] = tiles[index]
          }
          tiles[index] = 0
          index--
          hasMoved = true
        }
      }
    }
    if (!hasMoved) {
      leftBlocked = true
    }
  }
  // ? Call function : Random tile appearing after movement is done.
  if (hasMoved) {
    randomTileAppears()
    upBlocked = false
    rightBlocked = false
    downBlocked = false
    leftBlocked = false
  }
  const win = tiles.some((tile) => {
    return tile === winValue
  })
  if (win) {
    for (let index = 0; index < tiles.length; index++) {
      tiles[index] = tiles[index] * -1 - 2
    }
  }
  if (upBlocked && rightBlocked && downBlocked && leftBlocked) {
    tiles.fill(-1)
  }
  tilesValueToDomTiles()
})
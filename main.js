const grid = document.querySelector('.grid')
const width = 4
const gridLength = width ** 2
const domTiles = []
const restartButton = document.querySelector('#restart')
const cat = {
  position: 0,
}
const tiles = []

// ? Creating the grid.
for (let index = 0; index < width ** 2; index++) {
  const div = document.createElement('div')
  grid.appendChild(div)
  // To visualise the grid's numbers.
  div.innerHTML = index
  domTiles.push(div)
}

function initialiseTiles () {
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

function tilesValueToDomTiles () {
  for (let index = 0; index < gridLength; index++) {
    const domTile = domTiles[index]
    domTile.classList.remove(...domTile.classList)
    if (tiles[index] === 2) {
      domTile.classList.add('cat')
    }
  }
}
tilesValueToDomTiles()


// ? Reset/restart button
restartButton.addEventListener('click', () => {
  initialiseTiles()
  tilesValueToDomTiles()
})

// ? Checking if a movement is possible (further direction and collision)
function canMoveUp (position, width) {
  const targetPosition = position - width
  if (targetPosition >= 0 && 
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}
function canMoveRight (position, width) {
  const targetPosition = position + 1
  if (targetPosition % width !== 0 && 
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}
function canMoveDown (position, width) {
  const targetPosition = position + width
  if (targetPosition < (width ** 2) && 
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}
function canMoveLeft (position, width) {
  const targetPosition = position - 1
  if (position % width !== 0 && 
      (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
    return true
  } else {
    return false
  }
}

// ? Moving the image/numbers with the arrows.
document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === 'ArrowUp') {
    tiles.forEach((tile, startIndex) => {
      let index = startIndex
      while (canMoveUp(index, width)) {
        tiles[index - width] = tile
        tiles[index] = 0
        index -= width
      }
    })
  } else if (key === 'ArrowRight') {
    tiles.forEach((tile, startIndex) => {
      let index = startIndex
      while (canMoveRight(index, width)) {
        tiles[index + 1] = tile
        tiles[index] = 0
        index++
      }
    })
  } else if (key === 'ArrowDown') {
    tiles.forEach((tile, startIndex) => {
      let index = startIndex
      while (canMoveDown(index, width)) {
        tiles[index + width] = tile
        tiles[index] = 0
        index += width
      }
    })
  } else if (key === 'ArrowLeft') {
    tiles.forEach((tile, startIndex) => {
      let index = startIndex
      while (canMoveLeft(index, width)) {
        tiles[index - 1] = tile
        tiles[index] = 0
        index--
      }
    })
  }
  tilesValueToDomTiles()
})
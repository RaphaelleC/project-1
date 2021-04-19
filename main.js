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

// domTiles[cat.position].classList.add('cat')

// ? Checking if a movement is possible (further direction and collision)
function canMoveUp (tile, width) {
  if ((tile.position - width) >= 0 && domTiles[tile.position - width].classList.length === 0) {
    return true
  } else {
    return false
  }
}
function canMoveRight (tile, width) {
  if ((tile.position + 1) % width !== 0 && domTiles[tile.position + 1].classList.length === 0) {
    return true
  } else {
    return false
  }
}
function canMoveDown (tile, width) {
  if ((tile.position + width) < (width ** 2) && domTiles[tile.position + width].classList.length === 0) {
    return true
  } else {
    return false
  }
}
function canMoveLeft (tile, width) {
  if (tile.position % width !== 0 && domTiles[tile.position - 1].classList.length === 0) {
    return true
  } else {
    return false
  }
}



// ? Moving the image/numbers with the arrows.
document.addEventListener('keydown', (event) => {
  const key = event.key

  if (key === 'ArrowUp') {
    while (canMoveUp(cat, width)) {
      domTiles[cat.position].classList.remove('cat')
      cat.position -= width
      domTiles[cat.position].classList.add('cat')
    }
  } else if (key === 'ArrowRight') {
    while (canMoveRight(cat, width)) {
      domTiles[cat.position].classList.remove('cat')
      cat.position++
      domTiles[cat.position].classList.add('cat')
    }
  } else  if (key === 'ArrowDown') {
    while (canMoveDown(cat, width)) {
      domTiles[cat.position].classList.remove('cat')
      cat.position += width
      domTiles[cat.position].classList.add('cat')
    }
  } else if (key === 'ArrowLeft') {
    while (canMoveLeft(cat, width)) {
      domTiles[cat.position].classList.remove('cat')
      cat.position -= 1
      domTiles[cat.position].classList.add('cat')
    }
  }
})
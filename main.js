const grid = document.querySelector('.grid')
const width = 4
const tiles = []
const restartButton = document.querySelector('#restart')
let cat = 0
let dog = 0

// ? Creating the grid.
for (let index = 0; index < width ** 2; index++) {
  const div = document.createElement('div')
  grid.appendChild(div)
  // To visualise the grid's numbers.
  div.innerHTML = index
  tiles.push(div)
}

tiles[cat].classList.add('cat')

// ? Checking if a movement is possible (further direction and collision)
function canMoveUp (position, width) {
  if ((position - width) >= 0 && tiles[position - width].classList.length === 0) {
    return true
  } else {
    return false
  }
}
function canMoveRight (position, width) {
  if ((position + 1) % width !== 0 && tiles[position + 1].classList.length === 0) {
    return true
  } else {
    return false
  }
}
function canMoveDown (position, width) {
  if ((position + width) < (width ** 2) && tiles[position + width].classList.length === 0) {
    return true
  } else {
    return false
  }
}
function canMoveLeft (position, width) {
  if (position % width !== 0 && tiles[position - 1].classList.length === 0) {
    return true
  } else {
    return false
  }
}

// ? Reset/restart button
restartButton.addEventListener('click', () => {
  tiles[cat].classList.remove('cat')
  tiles[dog].classList.remove('dog')
  cat = Math.floor(Math.random() * tiles.length)
  dog = Math.floor(Math.random() * tiles.length)
  if (cat !== dog) {
    tiles[cat].classList.add('cat')
    tiles[dog].classList.add('dog')
  } else {
    Math.abs(dog--)
    tiles[cat].classList.add('cat')
    tiles[dog].classList.add('dog')
  }
})

// ? Moving the image/numbers with the arrows.
document.addEventListener('keydown', (event) => {
  const key = event.key

  if (key === 'ArrowUp') {
    while (canMoveUp(cat, width)) {
      tiles[cat].classList.remove('cat')
      cat -= width
      tiles[cat].classList.add('cat')
    }
  } else if (key === 'ArrowRight') {
    while (canMoveRight(cat, width)) {
      tiles[cat].classList.remove('cat')
      cat++
      tiles[cat].classList.add('cat')
    }
  } else  if (key === 'ArrowDown') {
    while (canMoveDown(cat, width)) {
      tiles[cat].classList.remove('cat')
      cat += width
      tiles[cat].classList.add('cat')
    }
  } else if (key === 'ArrowLeft') {
    while (canMoveLeft(cat, width)) {
      tiles[cat].classList.remove('cat')
      cat -= 1
      tiles[cat].classList.add('cat')
    }
  }
})
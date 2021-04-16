const grid = document.querySelector('.grid')
const width = 4
const tiles = []
let cat = 0

// ? Creating the grid.
for (let index = 0; index < width ** 2; index++) {
  const div = document.createElement('div')
  grid.appendChild(div)
  // To visualise the grid's numbers.
  div.innerHTML = index
  tiles.push(div)
}

tiles[cat].classList.add('cat')

// ? Checking if a movement is possible
function canMoveUp (position, width) {
  if ((position - width) >= 0) {
    return true
  } else {
    return false
  }
}
function canMoveRight (position, width) {
  if ((position + 1) % width !== 0) {
    return true
  } else {
    return false
  }
}
function canMoveDown (position, width) {
  if ((position + width) < (width ** 2)) {
    return true
  } else {
    return false
  }
}
function canMoveLeft (position, width) {
  if ((position) % width !== 0) {
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
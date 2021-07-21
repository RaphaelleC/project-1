# Project-1 : 2048

## Overview
This is my first project as a student of the Software Engineering Immersive course at GA, London. I had to create a grid-based game to be played in a browser using HTML, CSS and Javascript. It's a individual project that has been done within one week.

I had a list of different games I could chose from, and decided to go for the 2048. It's a game I really like and I was super enthusiastic to make my own version of it.

You can launch the game on GitHub pages here or find the GitHub repository here.

## Brief
- Render the game in the browser
- Deploy the game online so anyone can access it
- Design a logic for winning and losing, with the options to restart and/or continue depending on the outcome
- Include separate HTML/CSS/JavaScript files
- Use JavaScript to manipulate **DOM**
- Use semantic markup for HTML and CSS (best practices)
- Remember the **DRY** (Don't Repeat Yourself) and **KISS** (Keep It Simple Stupid) principles

## Technologies used
- HTML
- CSS
- JavaScript (ES6)
- Git/GitHub
- Google fonts
- Imgur

## Approach
I've started by writing a list of features that needed to be implemented in this project, and then broke them down into small steps, like so :

- Create a grid with a random image
- Link keyboard keys and make the image move without going off the grid nor wrapping
- Create a reset / start new game button
- Have 2 random tiles added to the grid when the reset / start new game button is pressed
- Check if these 2 tiles are moving correctly
- Have 1 random tile added to the grid after a movement, and at a different place than the existing tiles
- Check if the random tiles added after movement are moving correctly
- Make the tiles with the same numbers merge and change the number depending on the player movement
- Create a score section
- Add an animation/alert when the player reaches 2048
- Create a grid for victory and loss that covers the playing grid and asks the player to continue or restart the game via 2 buttons

Following these steps helped me a lot through the building of this app, as it allowed me to always know what I had to do and to sowlely focus on the task at hand, before jumping to the next one.

#### Creating the grid
- I decided to use a **for** loop to create an array of divs depending on the width of the grid :

```js
const grid = document.querySelector('.grid')
const width = 4
const gridLength = width ** 2
const domTiles = []

for (let index = 0; index < width ** 2; index++) {
  const div = document.createElement('div')
  grid.appendChild(div)
  const divInDiv = document.createElement('div')
  div.appendChild(divInDiv)
  divInDiv.classList.add('numbers')
  domTiles.push(div)
}
```
- The game needs to be up and running as soon as the page loads. I made a function that is executed right after the grid is created, called `initialiseTiles` :

```js
const tiles = []

function initialiseTiles () {
  continueButton.style.visibility = 'hidden'
  document.addEventListener('keydown', keyboardCallback)
  const random1 = Math.floor(Math.random() * gridLength)
  let random2 = Math.floor(Math.random() * gridLength)
  if (random1 === random2) {
    random2 = Math.abs(random2 - 1)
  }
  for (let index = 0; index < gridLength; index++){
    if (index === random1 || index === random2) {
      twoOrFourTile(index)
    } else {
      tiles[index] = 0
    }
  }
}
```

#### Separating the DOM
I decided to separate the DOM management from the rest of the logic to make it easier to maintain. I have then created this function to update the DOM status :

```js
const domScore = document.querySelector('#score')
const domBestScore = document.querySelector('#best-score')

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
      document.removeEventListener('keydown', keyboardCallback)
      domTile.style.visibility = 'hidden'
      grid.classList.add('victory')
      continueButton.style.visibility = 'visible'
    }
  }
  domScore.innerHTML = 'Score : ' + score
  domBestScore.innerHTML = 'Best score : ' + bestScore
}
```

#### Tiles/Numbers movement
All tiles are moving at the same time, can't move out of a line/column, and the movement depends on which tiles are around. I created the function `canMove` to check if a movement is possible :
  
```js 
  function canMove (direction, position) {
    let targetPosition = position
    let isNotOnEdge = false
    switch (direction) {
      case 'up': {
        targetPosition = position - width
        isNotOnEdge = targetPosition >= 0
        break
      }
      (...)
      default:
        break
    }
    if (isNotOnEdge && tiles[position] > 0 &&
        (tiles[targetPosition] === 0 || tiles[targetPosition] === tiles[position])) {
      return true
    } else {
      return false
    }
  }
```

#### Collisions and fusions
- I created the function `makeItMove` to merge tiles and make them move on the grid :

```js
function makeItMove (index, offset, direction) {
  let hasMoved = false
  let hasMerged = false
  while (tiles[index] !== 0 && canMove(direction, index) && !hasMerged) {
    if (tiles[index + offset] === tiles[index]) {
      tiles[index + offset] *= 2
      calculateScore(tiles[index + offset])
      hasMerged = true
    } else {
      tiles[index + offset] = tiles[index]
    }
    tiles[index] = 0
    index += offset
    hasMoved = true
  }
  return hasMoved
}
```
- And a function inside an event listener so the player can use the arrows and the WASD keys to play the game :

```js
let upBlocked = false
let rightBlocked = false
let downBlocked = false
let leftBlocked = false

function keyboardCallback (event) {
  const key = event.key
  let hasMoved = false
  if (key === 'ArrowUp' || key === 'w') {
    for (let column = 0; column < width; column++) {
      for (let i = column; i < gridLength; i += width) {
        if (makeItMove(i, - width, 'up')) {
          hasMoved = true
        }
      }
    }
  }
  if (!hasMoved) {
    upBlocked = true
  }
  (...)
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
}
```

#### Other variables 
I used other variables to keep track of the game status :
- `const startingWinValue = 2048`: the value to obtain to win the game. When it is done, a new button ``continue`` appears and players can chose to either start again with the `new game` button or continue to get as far as they can.
- The variable `winValue` which is equal to `startingWinValue` as long as players don't click the `continue` button. If so, it is changed to -3, an impossible value to obtain, so that players can continue to play until completely blocked.

## Screenshots
![In game footage](/Screenshots/2048-in-game.png)
***
![Victory footage](/Screenshots/2048-win.png)
***
![Game Over footage](/Screenshots/2048-loss.png)

## Bugs
There is a bug I didn't have time to solve. Despite the function `canMove` that verifies if a tile can move or not, when we have a line looking like this : |2|2|4| | and we want to make it move to the left, the result is |8| | | | instead of being : |4|4| | |. 

## Key learnings
- Building and deployement of an app
- Better understanding of HTML, CSS and JavaScript
- Project planning

## Achievements
- First app built as a solo project
- First usage of the `switch` block
- Deployement via GitHub

## Challenges

The biggest challenged I've met on this project was to create the core concept of this grid game : adding numbers together. It's the part that took the most time to complete, and I'm really happy about the result.
I also took some time at the end of the project to try and refactor my code, so that if I have to come back and take a look at it, it will be easier to understand and to remember which function serves whcoh purpose.

## Potential features to add
- Fix the merging bug
- Add a "slide" effect to the moving tiles
- Add a "pop" effect to the appearing tiles (I started to work on this one but didn't manage to make it affects *only* the new tiles)
- Make a phone version using swipes to move the tiles

## Credit
Victory image : https://i.ytimg.com/vi/s8wHtQ23-vo/hqdefault.jpg  
Loss image : https://pics.me.me/love-this-game-when-your-game-over-n-a-grumpy-13005592.png
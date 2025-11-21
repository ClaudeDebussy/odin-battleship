import { Player } from './Player.js'
import { Ship } from './Ship.js'

export function newGame(players = undefined) {
  let player1
  let player2

  if (players) {
    player1 = players[0]
    player2 = players[1]
  } else {
    player1 = new Player('human', 'Player 1')
    player2 = new Player('computer', 'Computer')
  }
  player1.gameboard.reset()
  player2.gameboard.reset()
  renderNewBoards(player1, player2)
  displayPlayerNames(player1, player2)

  return [player1, player2]
}

export function rename(player, newName) {
  if (!(player instanceof Player))
    throw new Error('Parameter must be instance of Player object.')
  if (typeof newName != 'string') {
    throw new Error('New name must be String object.')
  }
  if (newName.length > 20) {
    throw new Error('Name cannot be longer than 20 chars.')
  }
  player.name = newName
}

function renderNewBoards(player1, player2) {
  const boardExample = player1.gameboard
  const width = boardExample.width
  const height = boardExample.height

  assembleBoard(width, height)
}

function assembleBoard(width, height) {
  const totalCells = width * height
  const players = ['player1', 'player2']
  const boards = document.querySelectorAll('.board')
  for (let i = 0; i < players.length; i++) {
    const boardFragment = cellCreator(totalCells)
    const targetBoard = boards[i]
    targetBoard.classList.add(`${players[i]}`)
    targetBoard.append(boardFragment)

    assignCoordsAsClassToCells(targetBoard, width, height)
  }
}

function cellCreator(totalCells) {
  let boardFragment = document.createDocumentFragment()
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('button')
    cell.classList.add('cell')
    boardFragment.append(cell)
  }
  return boardFragment
}

function assignCoordsAsClassToCells(board, width, height) {
  let i = 0
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const cell = board.children[i]
      cell.classList.add(`[${x},${y}]`)
      i++
    }
  }
}

function displayPlayerNames(player1, player2) {
  const players = [player1, player2]
  const container = document.querySelector('.container')
  const playerContainers = container.querySelectorAll('.playerContainer')
  for (let i = 0; i < playerContainers.length; i++) {
    let h2 = document.createElement('h2')
    h2.textContent = players[i].name
    playerContainers[i].prepend(h2)
  }
}

export function placeShips(players) {
  const player1 = players[0]
  const player2 = players[1]

  humanPlaceShips(player1)
  computerPlayerPlaceShips(player2)
}

async function humanPlaceShips(player) {
  const shipList = [
    'carrier',
    'battleship',
    'cruiser',
    'submarine',
    'destroyer',
  ]

  const rotateFn = () => {
    currentOrientation = orientationList[0]
    orientationList.shift()
    orientationList.push(currentOrientation)
  }

  let currentOrientation = 'north'
  let orientationList = ['east', 'south', 'west', 'north']

  const board = document.querySelector('.board')
  for (const shipType of shipList) {
    let placed = false
    while (!placed) {
      const coords = await getClickCoords(
        board,
        player.gameboard,
        shipType,
        () => currentOrientation,
        rotateFn,
      )

      try {
        player.gameboard.placeNewShip(shipType, currentOrientation, coords)

        renderPlayerBoard(player)
        placed = true
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}

function getClickCoords(
  board,
  gameboard,
  shipType,
  getOrientation,
  rotateOrientation,
) {
  return new Promise((resolve) => {
    let lastHoveredCell = null

    const paintShadow = (cell) => {
      clearHighlights(board)

      if (!cell || !cell.matches(`.cell`)) return

      const coordinateString = cell.classList[1]

      const startCoords = JSON.parse(coordinateString)
      const currentOrientation = getOrientation()
      const length = Ship.shipLength(shipType)

      const footprint = gameboard.getShipCells(
        startCoords,
        currentOrientation,
        length,
      )

      footprint.forEach((coord) => {
        const cell = getCellFromCoords(board, coord)
        if (cell) cell.classList.add('hover-preview')
      })
    }

    const mouseOverHandler = (event) => {
      if (event.target.matches('.cell')) {
        lastHoveredCell = event.target
        paintShadow(event.target)
      }
    }

    const keyHandler = (event) => {
      if (event.key === 'r') {
        if (rotateOrientation) rotateOrientation()

        if (lastHoveredCell) {
          paintShadow(lastHoveredCell)
        }
      }
    }

    const mouseOutHandler = () => {
      clearHighlights(board)
      lastHoveredCell = null
    }

    const clickHandler = (event) => {
      if (event.target.matches('.cell')) {
        board.removeEventListener('click', clickHandler)
        board.removeEventListener('mouseover', mouseOverHandler)
        board.removeEventListener('mouseout', mouseOutHandler)
        document.removeEventListener('keydown', keyHandler)

        clearHighlights(board)

        const coordinateString = event.target.classList[1]
        const coords = JSON.parse(coordinateString)
        resolve(coords)
      }
    }

    board.addEventListener('click', clickHandler)
    board.addEventListener('mouseover', mouseOverHandler)
    board.addEventListener('mouseout', mouseOutHandler)
    document.addEventListener('keydown', keyHandler)
  })
}

function clearHighlights(board) {
  const cells = board.querySelectorAll('.hover-preview')
  cells.forEach((cell) => cell.classList.remove('hover-preview'))
}

function getCellFromCoords(board, [x, y]) {
  return board.querySelector(`[class*="[${x},${y}]"]`)
}

function computerPlayerPlaceShips(player2) {
  player2.gameboard.computerPlaceShips()
}

function renderPlayerBoard(player) {
  const board = document.querySelector('.board')
  const cells = board.children
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const coordinateString = cell.classList[1]
    const coords = JSON.parse(coordinateString)

    if (player.gameboard.cellHasShip(coords)) {
      cell.classList.add('hasShip')
    }
    if (player.gameboard.cellHasAlreadyBeenHit(coords)) {
      cell.classList.add('hit')
    }
  }
}

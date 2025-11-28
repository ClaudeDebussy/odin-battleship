import { Player } from './Player.js'
import { Ship } from './Ship.js'
import PubSub from './PubSub.js'

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
  player1.reset()
  player2.reset()
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

export async function placeShips(players) {
  const player1 = players[0]
  const player2 = players[1]

  await humanPlaceShips(player1)
  await computerPlayerPlaceShips(player2)
}

async function humanPlaceShips(player) {
  const shipList = [
    'carrier',
    'battleship',
    'cruiser',
    'submarine',
    'destroyer',
  ]

  let currentOrientation = 'north'
  let orientationList = ['east', 'south', 'west', 'north']

  const rotateFn = () => {
    currentOrientation = orientationList[0]
    orientationList.shift()
    orientationList.push(currentOrientation)
  }

  PubSub.publish('PLACE_SHIPS', player.name)

  const board = document.querySelector('.board.player1')
  for (const shipType of shipList) {
    let placed = false
    while (!placed) {
      const coords = await getClickCoordsForShipPlacement(
        board,
        player.gameboard,
        shipType,
        () => currentOrientation,
        rotateFn,
      )

      try {
        player.gameboard.placeNewShip(shipType, currentOrientation, coords)

        renderPlayerBoardPlaceShips(player)
        placed = true
      } catch (error) {
        console.error(error.message)
      }
    }
  }
}

function getClickCoordsForShipPlacement(
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

async function computerPlayerPlaceShips(player2) {
  PubSub.publish('COMPUTER_PLACE_SHIPS')
  await sleep(speeds.slow)

  player2.gameboard.computerPlaceShips()
}

function renderPlayerBoardPlaceShips(player) {
  const board = document.querySelector('.board.player1')
  const cells = board.children
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const coordinateString = cell.classList[1]
    const coords = JSON.parse(coordinateString)

    if (player.gameboard.cellHasShip(coords)) {
      cell.classList.add('hasShip')
    }
  }
}

export async function playerTurns(players) {
  const startingPlayer = setStartingPlayer(players)

  PubSub.publish('WHO_STARTS', startingPlayer.name)
  await sleep(speeds.slow)

  while (
    players[0].gameboard.gameOver != true &&
    players[1].gameboard.gameOver != true
  ) {
    await takeTurns(players)
  }

  if (players[0].gameboard.gameOver) {
    PubSub.publish('PLAYER_WINS', players[1].name)
  } else {
    PubSub.publish('PLAYER_WINS', players[0].name)
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function setStartingPlayer(players) {
  const randomNumber = Math.floor(Math.random() * 11)
  if (randomNumber % 2 === 0) {
    players[0].setStartingPlayer()
    return players[0]
  } else {
    players[1].setStartingPlayer()
    return players[1]
  }
}

async function takeTurns(players) {
  if (players[0].startingPlayer === true) {
    //PubSub.publish('PLAYER_GO', players[0].name)
    await player1Fire(players[1])
    //PubSub.publish('COMPUTER_GO')
    await computerFire(players[0])
  } else {
    //PubSub.publish('COMPUTER_GO')
    await computerFire(players[0])
    //PubSub.publish('PLAYER_GO', players[0].name)
    await player1Fire(players[1])
  }
}

async function player1Fire(player) {
  const board = document.querySelector('.board.player2')
  let shotFired = false

  while (!shotFired) {
    const coords = await getBoardClick(board, player.gameboard)

    try {
      player.gameboard.receiveAttack(coords)
      renderComputerBoardReceiveAttacks(player)
      shotFired = true
    } catch (error) {
      console.error(error.message)
    }
  }
}

function getBoardClick(board, gameboard) {
  return new Promise((resolve) => {
    let lastHoveredCell = null

    const paintAttack = (cell) => {
      clearAttackHighlights(board)

      if (!cell || !cell.matches(`.cell`)) return

      const coordinateString = cell.classList[1]

      const coord = JSON.parse(coordinateString)

      const cellToPaint = getCellFromCoords(board, coord)
      if (cellToPaint) cellToPaint.classList.add('attack-preview')
    }

    const mouseOverHandler = (event) => {
      if (event.target.matches('.cell')) {
        lastHoveredCell = event.target
        paintAttack(event.target)
      }
    }

    const mouseOutHandler = () => {
      clearAttackHighlights(board)
      lastHoveredCell = null
    }

    const clickHandler = (event) => {
      if (event.target.matches('.cell')) {
        board.removeEventListener('click', clickHandler)
        board.removeEventListener('mouseover', mouseOverHandler)
        board.removeEventListener('mouseout', mouseOutHandler)

        clearAttackHighlights(board)

        const coordinateString = event.target.classList[1]
        const coords = JSON.parse(coordinateString)
        resolve(coords)
      }
    }

    board.addEventListener('click', clickHandler)
    board.addEventListener('mouseover', mouseOverHandler)
    board.addEventListener('mouseout', mouseOutHandler)
  })
}

function renderComputerBoardReceiveAttacks(player) {
  const board = document.querySelector('.board.player2')
  const cells = board.children
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const coordinateString = cell.classList[1]
    const coords = JSON.parse(coordinateString)

    if (player.gameboard.cellHasAlreadyBeenHit(coords)) {
      cell.classList.add('hit')
    }

    if (
      player.gameboard.cellHasAlreadyBeenHit(coords) &&
      player.gameboard.cellHasShip(coords)
    ) {
      cell.classList.add('hasShip')
    }
  }
}

function renderPlayerBoardReceiveAttacks(player) {
  const board = document.querySelector('.board.player1')
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

function clearAttackHighlights(board) {
  const cells = board.querySelectorAll('.attack-preview')
  cells.forEach((cell) => cell.classList.remove('attack-preview'))
}

async function computerFire(player) {
  //PubSub.publish('COMPUTER_GO')
  //await sleep(speeds.veryFast)
  let timesHit = player.gameboard.hits.length
  while (timesHit === player.gameboard.hits.length) {
    if (player.gameboard.successfulHits.length === 0) {
      try {
        const cell = randomCoord()
        player.gameboard.receiveAttack(cell)
        renderPlayerBoardReceiveAttacks(player)
        await sleep(speeds.medium)
      } catch (error) {
        console.error(error)
      }
    } else if (previousHitWasSuccessful(player)) {
      const previousHit = player.gameboard.hits.at(-1)
      const cell = player.gameboard.pickRandomAdjacentCell(previousHit)
      try {
        player.gameboard.receiveAttack(cell)
        renderPlayerBoardReceiveAttacks(player)
        await sleep(speeds.veryFast)
      } catch (error) {
        console.error(error)
      }
    } else {
      const cell = randomCoord()
      try {
        player.gameboard.receiveAttack(cell)
        renderPlayerBoardReceiveAttacks(player)
        await sleep(speeds.veryFast)
      } catch (error) {
        console.error(error)
      }
    }
  }
  PubSub.publish('COMPUTER_ATTACKS', player.gameboard.hits.at(-1))
  //await sleep(speeds.fast)
}

function previousHitWasSuccessful(player) {
  const previousHit = player.gameboard.hits.at(-1)
  const previousSuccessfulHit = player.gameboard.successfulHits.at(-1)

  if (player.gameboard.arraysAreEqual(previousHit, previousSuccessfulHit)) {
    return true
  } else return false
}

function randomCoord() {
  const x = Math.floor(Math.random() * 10)
  const y = Math.floor(Math.random() * 10)
  return [x, y]
}

const speeds = {
  verySlow: 2000,
  slow: 1500,
  medium: 1000,
  fast: 750,
  veryFast: 500,
  almostInstant: 250,
  instant: 0,
}

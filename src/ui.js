import { Player } from './Player.js'
import { Gameboard } from './Gameboard.js'

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
  const boardContainers = document.querySelectorAll('.boardContainer')
  for (let i = 0; i < players.length; i++) {
    const boardFragment = boardFragmentCreator(totalCells)
    const targetBoardContainer = boardContainers[i]
    console.log(targetBoardContainer)
    targetBoardContainer.classList.add(`${players[i]}`)
    targetBoardContainer.append(boardFragment)

    assignCoordsAsClassToCells(targetBoardContainer, width, height)
  }
}

function boardFragmentCreator(totalCells) {
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

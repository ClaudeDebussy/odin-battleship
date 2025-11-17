import { Player } from './Player.js'
import { Gameboard } from './Gameboard.js'

export function newGame(players) {
  if (players) {
    const [player1, players2] = players
  } else {
    const player1 = new Player('human', 'Player 1')
    const player2 = new Player('computer', 'Computer')
  }
  player1.gameboard.reset()
  player2.gameboard.reset()
  renderBoard(player1, player2)
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

export function renderBoard(player1, player2) {
  const player1Board = player1.gameboard
  const player2Board = player2.gameboard

  const board = document.createElement('div')
}

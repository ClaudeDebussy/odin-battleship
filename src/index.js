import { Gameboard } from './Gameboard.js'
import { newGame, placeShips, playerTurns } from './ui.js'
import './styles.css'
import Message from './Message.js'

async function game() {
  Message.init()
  const players = newGame()
  await placeShips(players)
  playerTurns(players)
}

game()

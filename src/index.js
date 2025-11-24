import { Gameboard } from './Gameboard.js'
import { newGame, rename, placeShips } from './ui.js'
import './styles.css'
import Message from './Message.js'

function game() {
  Message.init()
  const players = newGame()
  placeShips(players)
}

game()

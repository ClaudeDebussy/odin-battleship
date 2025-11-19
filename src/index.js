import { Gameboard } from './Gameboard.js'
import { newGame, rename, placeShips } from './ui.js'
import './styles.css'

function game() {
  const players = newGame()
  placeShips(players)
}

game()

import { Gameboard } from './Gameboard.js'
import { newGame, rename } from './ui.js'

// let players = []

// newGame(players)

const gameboard = new Gameboard()
gameboard.placeNewShip('submarine', 'west', [0, 9])
console.log(gameboard.getGameboardAsList())
console.log(gameboard.getGameboardAsList()[0])

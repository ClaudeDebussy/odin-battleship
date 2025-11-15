import { Gameboard } from './Gameboard.js'

const gameboard = new Gameboard()
gameboard.placeNewShip('submarine', 'north', [5, 5])
gameboard.receiveAttack([5, 5])
// gameboard.placeNewShip('submarine', 'west', [10, 5])
// console.log(gameboard.cellHasShip([5,5]))
// console.log(gameboard.cellHasShip([5,4]))
// console.log(gameboard.cellHasShip([5,3]))
// console.log(gameboard.cellHasShip([5,2]))
// console.log(gameboard.cellHasShip([5,1]))

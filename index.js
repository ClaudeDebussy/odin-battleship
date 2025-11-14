import { Gameboard } from "./Gameboard.js";

const gameboard = new Gameboard()
console.log(gameboard.placeShip())
console.log(gameboard.cellHasShip([5,5]))
console.log(gameboard.cellHasShip([5,4]))
console.log(gameboard.cellHasShip([5,3]))
console.log(gameboard.cellHasShip([5,2]))
console.log(gameboard.cellHasShip([5,1]))
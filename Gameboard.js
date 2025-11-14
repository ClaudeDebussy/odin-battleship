import { Ship } from './Ship'

export class Gameboard {
  constructor(size = [10,10]) {
    this.size = size
  }

  ships = []

  placeShip(type, orientation, x,y) {
    // Check if ship is already there

    // If ship not there, place it
    const ship = new Ship(type, orientation, [x,y]) // hard-code battleship
    this.ships.push(ship)
    
  }

  hasShip(x,y) {

  }
}
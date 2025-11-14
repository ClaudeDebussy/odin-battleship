import { Ship } from './Ship.js'

export class Gameboard {
  constructor(size = [10,10]) {
    this.size = size
  }

  ships = []

  placeShip(type, orientation, position) {
    // Check if ship is already there

    // If ship not there, place it
    const ship = new Ship({type, orientation, position}) // hard-code battleship
    this.ships.push(ship)
    
  }

  cellHasShip(coord) {
    let hasShip = false;
    this.ships.forEach(ship => {
      const cellToCheck = [coord[0],coord[1]]
      const position = ship.position
      const orientation = ship.orientation
      const length = ship.length

      const cellsWithShips = this.#getShipCells(position, orientation, length)

      hasShip = cellsWithShips.some(arr => this.#arraysAreEqual(arr, cellToCheck)); // BUG HERE
    });
    return hasShip    
  }

  #getShipCells(position, orientation, length) {
    const cells = []
    
    const x = position[0]
    const y = position[1]

    switch (orientation) {
      case 'north':
        for (let i = 0; i < length; i++) {
          cells.push([x, y - i])
        }
        break;
      case 'east':
        for (let i = 0; i < length; i++) {
          cells.push([x + i, y])
        }
        break;
      case 'south':
        for (let i = 0; i < length; i++) {
          cells.push([x, y + i])
        }
        break;
      case 'west':
        for (let i = 0; i < length; i++) {
          cells.push([x - i, y])
        }
        break;
    }
    return cells
  }

  #arraysAreEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) {return false}
    }
    return true
  }
}
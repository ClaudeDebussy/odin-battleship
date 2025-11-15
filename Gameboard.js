import { Ship } from './Ship.js'

export class Gameboard {
  constructor(size = [10, 10]) {
    this.length = size[0]
    this.height = size[1]
  }

  ships = []

  placeNewShip(type, orientation, position) {
    // Check if ship already there
    const ship = new Ship({ type, orientation, position }) // TODO

    // Check if desired ship position is inside gameboard
    if (!this.#positionIsInsideGameboard(ship)) {
      throw new Error('Invalid gameboard position.')
    }

    this.ships.push(ship)
  }

  #positionIsInsideGameboard(ship) {
    if (!(ship instanceof Ship)) {
      throw new Error('Parameter must be instance of Ship object.')
    }
    const shipCells = this.#getShipCells(
      ship.position,
      ship.orientation,
      ship.length,
    )
    for (let i = 0; i < shipCells.length; i++) {
      if (
        shipCells[i][0] > this.length ||
        shipCells[i][1] > this.height ||
        shipCells[i][0] < 0 ||
        shipCells[i][1] < 0
      ) {
        return false
      }
    }
    return true
  }

  cellHasShip(cell) {
    let hasShip = false
    this.ships.forEach((ship) => {
      const cellToCheck = [cell[0], cell[1]]
      const position = ship.position
      const orientation = ship.orientation
      const length = ship.length

      const cellsWithShips = this.#getShipCells(position, orientation, length)

      hasShip = cellsWithShips.some((arr) =>
        this.#arraysAreEqual(arr, cellToCheck),
      )
    })
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
        break
      case 'east':
        for (let i = 0; i < length; i++) {
          cells.push([x - i, y])
        }
        break
      case 'south':
        for (let i = 0; i < length; i++) {
          cells.push([x, y + i])
        }
        break
      case 'west':
        for (let i = 0; i < length; i++) {
          cells.push([x + i, y])
        }
        break
    }
    return cells
  }

  #arraysAreEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) {
        return false
      }
    }
    return true
  }
}

import { Ship } from './Ship.js'

export class Gameboard {
  constructor(size = [10, 10]) {
    this.length = size[0]
    this.height = size[1]
  }

  ships = []
  hits = []
  shipsSunk = []
  gameOver = false

  placeNewShip(type, orientation, position) {
    // Check if ship already there
    const ship = new Ship({ type, orientation, position }) // TODO

    // Check if desired ship position is inside gameboard
    if (!this.#shipPositionIsInsideGameboard(ship)) {
      throw new Error('Invalid gameboard position.')
    }

    this.ships.push(ship)
  }

  #shipPositionIsInsideGameboard(ship) {
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
        shipCells[i][0] > this.length - 1 ||
        shipCells[i][1] > this.height - 1 ||
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

  reset() {
    this.ships = []
    this.hits = []
    this.shipsSunk = []
    this.gameOver = false
  }

  receiveAttack(cell) {
    if (!this.#positionIsInsideGameboard(cell))
      throw new Error('Invalid gameboard position.')

    if (this.cellHasAlreadyBeenHit(cell)) return

    this.hits.push(cell)

    const hitWasSuccessful = this.cellHasShip(cell)
    if (hitWasSuccessful) this.resolveSuccessfulHit(cell)
  }

  cellHasAlreadyBeenHit(cell) {
    for (let i = 0; i < this.hits.length; i++) {
      if (this.#arraysAreEqual(cell, this.hits[i])) return true
    }
  }

  resolveSuccessfulHit(cell) {
    const shipAtThatLocation = this.getShipAtLocation(cell)
    shipAtThatLocation.hit()
    if (this.#shipHasSunk(shipAtThatLocation)) {
      this.shipsSunk.push(shipAtThatLocation)
    }
    if (this.#allShipsAreSunk()) this.gameOver = true
  }

  getShipAtLocation(cell) {
    for (let i = 0; i < this.ships.length; i++) {
      const ship = this.ships[i]
      const shipCells = this.#getShipCells(
        ship.position,
        ship.orientation,
        ship.length,
      )
      if (this.#shipCellsAreTargetCell(shipCells, cell)) return ship
    }
  }

  #shipCellsAreTargetCell(shipCells, target) {
    for (let i = 0; i < shipCells.length; i++) {
      if (this.#arraysAreEqual(shipCells[i], target)) return true
    }
  }

  #positionIsInsideGameboard(cell) {
    if (
      cell[0] > this.length - 1 ||
      cell[1] > this.height - 1 ||
      cell[0] < 0 ||
      cell[1] < 0
    ) {
      return false
    }
    return true
  }

  #shipHasSunk(ship) {
    if (ship.sunk) return true
  }

  #allShipsAreSunk() {
    if (this.shipsSunk.length === this.ships.length) return true
  }

  // WIP BELOW

  getGameboardAsList() {
    const list = []
    const width = this.width
    const height = this.height

    for (let y = height; y > 0; y--) {
      for (let x = 0; x < width; x++) {
        const cell = [x, y]
        if (this.cellHasShip(cell)) list.push(cell)
      }
    }
  }
}

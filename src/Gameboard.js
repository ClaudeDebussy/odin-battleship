import { Ship } from './Ship.js'

export class Gameboard {
  constructor(size = [10, 10]) {
    this.width = size[0]
    this.height = size[1]
  }

  ships = []
  hits = []
  shipsSunk = []
  gameOver = false

  placeNewShip(type, orientation, position) {
    // Check if ship already there
    const ship = new Ship({ type, orientation, position })

    // Check if desired ship position is inside gameboard
    if (!this.#shipPositionIsInsideGameboard(ship)) {
      throw new Error('Invalid gameboard position.')
    }

    // Check if ship position conflicts with another ship's position
    if (!this.#shipPositionHasNoConflictsWithOtherShips(ship)) {
      throw new Error('Ship position conflicts with other ships.')
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
        shipCells[i][0] > this.width - 1 ||
        shipCells[i][1] > this.height - 1 ||
        shipCells[i][0] < 0 ||
        shipCells[i][1] < 0
      ) {
        return false
      }
    }
    return true
  }

  #shipPositionHasNoConflictsWithOtherShips(ship) {
    if (!(ship instanceof Ship)) {
      throw new Error('Parameter must be instance of Ship object.')
    }

    const placingShipCells = this.#getShipCells(
      ship.position,
      ship.orientation,
      ship.length,
    )

    const shipsOnTheBoard = this.ships

    for (let i = 0; i < shipsOnTheBoard.length; i++) {
      const checkShipCells = this.#getShipCells(
        shipsOnTheBoard[i].position,
        shipsOnTheBoard[i].orientation,
        shipsOnTheBoard[i].length,
      )
      for (let j = 0; j < placingShipCells.length; j++) {
        for (let k = 0; k < checkShipCells.length; k++) {
          if (this.#arraysAreEqual(placingShipCells[j], checkShipCells[k])) {
            return false
          }
        }
      }
    }
    return true
  }

  cellHasShip(cell) {
    // Check if ANY ship has a cell matching the input cell
    return this.ships.some((ship) => {
      const cellsWithShips = this.#getShipCells(
        ship.position,
        ship.orientation,
        ship.length,
      )
      return cellsWithShips.some((shipCell) =>
        this.#arraysAreEqual(shipCell, cell),
      )
    })
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
      cell[0] > this.width - 1 ||
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

  computerPlaceShips() {
    const shipList = [
      'carrier',
      'battleship',
      'cruiser',
      'submarine',
      'destroyer',
    ]
    while (shipList.length) {
      for (let i = 0; i < shipList.length; ) {
        const type = shipList[i]
        const orientation = this.#generateRandomOrientation()
        const position = this.#generateRandomCoordinate()

        try {
          this.placeNewShip(type, orientation, position)
          shipList.shift()
        } catch (error) {
          console.log(`Failed to place ${type}. Retrying...`)
        }
      }
    }
    console.log("Placed computer's ships successfully!")
  }

  #generateRandomOrientation() {
    const orientations = ['north', 'south', 'east', 'west']
    const randomNumber = Math.floor(Math.random() * 4)
    return orientations[randomNumber]
  }

  #generateRandomCoordinate() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
  }

  getGameboardStateAsList() {
    const list = []
    const width = this.width
    const height = this.height
    let x
    let y

    for (y = height; y > 0; y--) {
      for (x = 0; x < width; x++) {
        const cell = [x, y - 1]
        if (this.cellHasShip(cell)) {
          list.push(1)
        } else {
          list.push(0)
        }
      }
      if (x === width - 1) {
        x = 0
      }
    }
    return list
  }
}

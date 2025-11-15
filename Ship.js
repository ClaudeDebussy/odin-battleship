export class Ship {
  constructor({
    type = 'battleship',
    orientation = 'north',
    position = [5, 5],
  } = {}) {
    this.type = type
    this.length = this.#SHIP_LENGTH(this.type)
    this.orientation = orientation
    this.position = position
    this.timesHit = 0
    this.sunk = false
  }

  #SHIP_LENGTH(type) {
    switch (type) {
      case 'carrier':
        return 5
      case 'battleship':
        return 4
      case 'cruiser':
        return 3
      case 'submarine':
        return 3
      case 'destroyer':
        return 2
    }
  }

  hit() {
    this.timesHit++
    // check if is sunk
    this.isSunk()
  }

  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true
    }
  }
}

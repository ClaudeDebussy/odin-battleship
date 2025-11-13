export class Ship {
  constructor(length) {
    this.length = length
    this.timesHit = 0
    this.sunk = false
  }

  hit() {
    this.timesHit++
    // check if is sunk
    this.isSunk()
  }

  isSunk() {
    if (this.timesHit === this.length) {this.sunk = true} 
  }


}

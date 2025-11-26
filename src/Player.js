import { Gameboard } from './Gameboard.js'

export class Player {
  #name
  #startingPlayer

  constructor(type, name = 'Player') {
    if (type != 'human' && type != 'computer') {
      throw new Error('Invalid player type.')
    }
    this.type = type
    this.gameboard = new Gameboard()
    this.#name = name
    this.#startingPlayer = false
  }

  set name(name) {
    this.#name = name
  }

  get name() {
    return this.#name
  }

  setStartingPlayer() {
    this.#startingPlayer = true
  }

  get startingPlayer() {
    return this.#startingPlayer
  }

  reset() {
    this.#startingPlayer = false
  }
}

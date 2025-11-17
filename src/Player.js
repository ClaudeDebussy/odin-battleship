import { Gameboard } from './Gameboard'

export class Player {
  #name

  constructor(type, name = 'Player') {
    if (type != 'human' && type != 'computer') {
      throw new Error('Invalid player type.')
    }
    this.type = type
    this.gameboard = new Gameboard()
    this.#name = name
  }

  set name(name) {
    this.#name = name
  }

  get name() {
    return this.#name
  }
}

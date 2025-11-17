import { Player } from './Player'
import { Gameboard } from './Gameboard'

function newGame() {
  Gameboard.reset()
}

export function rename(player, newName) {
  if (!(player instanceof Player))
    throw new Error('Parameter must be instance of Player object.')
  if (typeof newName != 'string') {
    throw new Error('New name must be String object.')
  }
  if (newName.length > 20) {
    throw new Error('Name cannot be longer than 20 chars.')
  }
  player.name = newName
}

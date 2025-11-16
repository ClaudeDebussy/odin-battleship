import { Gameboard } from './Gameboard.js'
import { Player } from './Player.js'

describe('testing players', () => {
  it('should not accept invalid player type', () => {
    expect(() => new Player('invalid type')).toThrow()
  })

  it('should create a proper human player', () => {
    const humanPlayer = new Player('human')
    expect(humanPlayer.type).toBe('human')
    expect(humanPlayer.gameboard).toBeInstanceOf(Gameboard)
  })

  it('should create a proper computer player', () => {
    const computerPlayer = new Player('computer')
    expect(computerPlayer.type).toBe('computer')
    expect(computerPlayer.gameboard).toBeInstanceOf(Gameboard)
  })
})

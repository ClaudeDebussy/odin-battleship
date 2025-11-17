import { Player } from '../src/Player'
import { rename } from '../src/ui'

describe('managing UI', () => {
  it('should rename players', () => {
    player = new Player('human', 'Bob')
    rename(player, 'new name')
    expect(player.name).toBe('new name')
  })

  it('should disallow non-Person objects in rename function', () => {
    player = new Player('human', 'Sally')
    expect(() => rename(67, 'john')).toThrow()
  })

  it('should disallow invalid names', () => {
    player = new Player('human', 'Sally')
    expect(() => rename(player, 23)).toThrow()
    expect(() => rename(player, '123456789012345678901')).toThrow()
  })
})

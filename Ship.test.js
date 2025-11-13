import { Ship } from "./Ship"

describe('managing Ship objects', () => {

  const ship = new Ship("battleship")

  it('should properly create a Ship object', () => {
    expect(ship).toHaveProperty('length', 4)
    expect(ship).toHaveProperty('timesHit', 0)
    expect(ship).toHaveProperty('sunk', false)
  })

  it('should increment hit when hit', () => {
    ship.hit()
    expect(ship.timesHit).toBe(1)
    ship.hit()
    expect(ship.timesHit).toBe(2)
  })

  it('should be sunk when timesHit is equal to length', () => {
    expect(ship.sunk).toBe(false) // ship starts out alive
    ship.hit()
    ship.hit()
    console.log(ship.timesHit)
    expect(ship.sunk).toBe(true)
  })

})
import { Gameboard } from '../src/Gameboard'
import { Ship } from '../src/Ship'

const gameboard = new Gameboard()
const shipType = 'battleship'
gameboard.placeNewShip()

describe('managing gameboard', () => {
  it('should throw error if not valid gameboard position', () => {
    expect(() =>
      gameboard.placeNewShip('submarine', 'north', [5, 11]),
    ).toThrow()
    expect(() =>
      gameboard.placeNewShip('submarine', 'north', [11, 5]),
    ).toThrow()
    expect(() => gameboard.placeNewShip('submarine', 'west', [10, 5])).toThrow()
    expect(() => gameboard.placeNewShip('submarine', 'east', [0, 5])).toThrow()
  })

  const data = [
    { array: gameboard.ships, itemToFind: shipType, expected: shipType },
  ]

  test.each(data)(
    `should find a ${shipType}`,
    ({ array, itemToFind, expected }) => {
      const foundItem = array.find((item) => item.type === itemToFind)
      expect(foundItem.type).toBe(expected)
    },
  )

  it('should detect if ship present on square', () => {
    expect(gameboard.cellHasShip([5, 5])).toBeTruthy()
    expect(gameboard.cellHasShip([5, 4])).toBeTruthy()
    expect(gameboard.cellHasShip([5, 3])).toBeTruthy()
    expect(gameboard.cellHasShip([5, 2])).toBeTruthy()
    expect(gameboard.cellHasShip([5, 1])).toBeFalsy()
  })

  it('should properly reset the board', () => {
    gameboard.reset()
    expect(gameboard.ships.length).toBe(0)
    expect(gameboard.hits.length).toBe(0)
    expect(gameboard.shipsSunk.length).toBe(0)
    expect(gameboard.gameOver).toBeFalsy()

    // TODO implement reset of hits array
  })

  it('should handle successful hits', () => {
    expect(() => gameboard.receiveAttack([11, 0])).toThrow()
    expect(() => gameboard.receiveAttack([0, 11])).toThrow()
    expect(() => gameboard.receiveAttack([-1, 0])).toThrow()
    expect(() => gameboard.receiveAttack([0, -1])).toThrow()

    gameboard.placeNewShip('submarine', 'north', [5, 5])
    gameboard.receiveAttack([5, 5])
    expect(gameboard.hits[0][0]).toBe(5)
    expect(gameboard.hits[0][1]).toBe(5)
    gameboard.receiveAttack([5, 3])
    expect(gameboard.hits[1][0]).toBe(5)
    expect(gameboard.hits[1][1]).toBe(3)

    expect(gameboard.cellHasAlreadyBeenHit([5, 3])).toBeTruthy()

    expect(gameboard.getShipAtLocation([5, 3]).type).toBe('submarine')
    expect(gameboard.getShipAtLocation([5, 3]).timesHit).toBe(2)

    gameboard.receiveAttack([5, 4])
    expect(gameboard.getShipAtLocation([5, 4]).sunk).toBeTruthy()
    expect(gameboard.shipsSunk[0].type).toBe('submarine')

    expect(gameboard.gameOver).toBe(true)

    gameboard.receiveAttack([1, 2]) //test attack that hits no ship
    expect(gameboard.hits[3][0]).toBe(1)
    expect(gameboard.hits[3][1]).toBe(2)
  })
})

import { Gameboard } from './Gameboard'
import { Ship } from './Ship'

const gameboard = new Gameboard()
const shipType = 'battleship'
gameboard.placeShip(shipType, 5,5)

describe('managing gameboard', () => {
  const data = [
    { array: gameboard.ships, itemToFind: shipType, expected: shipType}
  ]

  test.each(data)(`should find a ${shipType}`, ({array, itemToFind, expected}) => {
    const foundItem = array.find(item => item.type === itemToFind)
    expect(foundItem.type).toBe(expected)
  })

  it('should detect if ship present on square', () => {
    expect(gameboard.hasShip(5,5)).toBeTruthy()
  })

})
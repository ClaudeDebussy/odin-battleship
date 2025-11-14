import { Gameboard } from './Gameboard'
import { Ship } from './Ship'

const gameboard = new Gameboard()
const shipType = 'battleship'
gameboard.placeShip()

describe('managing gameboard', () => {
  const data = [
    { array: gameboard.ships, itemToFind: shipType, expected: shipType}
  ]

  test.each(data)(`should find a ${shipType}`, ({array, itemToFind, expected}) => {
    const foundItem = array.find(item => item.type === itemToFind)
    expect(foundItem.type).toBe(expected)
  })

  it('should detect if ship present on square', () => {
    expect(gameboard.cellHasShip([5,5])).toBeTruthy()
    expect(gameboard.cellHasShip([5,4])).toBeTruthy()
    expect(gameboard.cellHasShip([5,3])).toBeTruthy()
    expect(gameboard.cellHasShip([5,2])).toBeTruthy()
    expect(gameboard.cellHasShip([5,1])).toBeFalsy()
  })

})
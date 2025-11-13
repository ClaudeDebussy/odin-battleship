import { Gameboard } from './Gameboard'
import { Ship } from './Ship'

const gameboard = new Gameboard()

describe('managing gameboard', () => {

  it('should place a ship at particular coordinates', () => {
    gameboard.placeShip(5,5)
    expect(gameboard.hasShip(5,5)).toBeTruthy()
  })

})
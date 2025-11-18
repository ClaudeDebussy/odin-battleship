/**
 * @jest-environment jsdom
 */

import { newGame } from '../src/ui'

describe('writing to the DOM', () => {
  it('should render a new board', () => {
    document.body.innerHTML = `<div class="container">
      <div id="player1BoardContainer"></div>
      <div id="player2BoardContainer"></div>
    </div>`

    newGame()
    expect(
      document.getElementById('player1BoardContainer').childElementCount,
    ).toBe(100)
  })
})

/**
 * @jest-environment jsdom
 */

import { newGame } from '../src/ui'

describe('writing to the DOM', () => {
  it('should render a new board', () => {
    document.body.innerHTML = `<div class="container">
      <div class="playerContainer">
        <div class="board"></div>
      </div>
      <div class="playerContainer">
        <div class="board"></div>
      </div>
      <div class="bottomNavBar">
        <button class="newGame">New game</button>
      </div>
      <h3 class="turnIndicator left">Player 1's turn</h3>
      <h3 class="turnIndicator right">Computer's turn</h3>`

    newGame()
    expect(document.querySelector('.board').childElementCount).toBe(100)
    let firstCell = document.querySelector('.board').firstChild
    expect(firstCell.className).toBe('cell [0,9]')
  })
})

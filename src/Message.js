import PubSub from './PubSub'

const Message = {
  messageElement: null,

  templates: {
    PLACE_SHIPS: (name) => `${name}: Place your ships... Press R to rotate.`,
    COMPUTER_PLACE_SHIPS: () => `Computer is placing its ships...`,
    WHO_STARTS: (name) => `${name} starts!`,
    PLAYER_GO: (name) => `${name}'s turn. Pick a cell to attack!`,
    COMPUTER_GO: () => `Computer's turn. Picking a cell to attack...`,
    COMPUTER_ATTACKS: (cell) => `Computer attack's ${cell}!`,
  },

  init: function () {
    this.messageElement = document.querySelector('.message')

    PubSub.subscribe('PLACE_SHIPS', (player) => {
      this.render('PLACE_SHIPS', player)
    })

    PubSub.subscribe('COMPUTER_PLACE_SHIPS', () => {
      this.render('COMPUTER_PLACE_SHIPS')
    })

    PubSub.subscribe('WHO_STARTS', (player) => {
      this.render('WHO_STARTS', player)
    })

    PubSub.subscribe('PLAYER_GO', (player) => {
      this.render('PLAYER_GO', player)
    })

    PubSub.subscribe('COMPUTER_GO', (player) => {
      this.render('COMPUTER_GO', player)
    })

    PubSub.subscribe('COMPUTER_ATTACKS', (cell) => {
      this.render('COMPUTER_ATTACKS', cell)
    })
  },

  render: function (templateKey, data) {
    const templateFn = this.templates[templateKey]

    if (templateFn) {
      this.messageElement.textContent = templateFn(data)
    }
  },
}

export default Message

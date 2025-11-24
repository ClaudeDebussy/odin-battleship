import PubSub from './PubSub'

const Message = {
  messageElement: null,

  templates: {
    PLACE_SHIPS: (name) => `${name}: Place your ships... Press R to rotate.`,
    GAME_START: () => `Game started! Good luck.`,
  },

  init: function () {
    this.messageElement = document.querySelector('.message')
    PubSub.subscribe('PLACE_SHIPS', (player) => {
      this.render('PLACE_SHIPS', player)
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

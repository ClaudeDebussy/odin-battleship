const PubSub = {
  events: {},

  subscribe: function (eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
      this.events[eventName].push(fn)
    } else if (this.events[eventName] && !this.events[eventName].includes(fn)) {
      this.events[eventName].push(fn)
    }
  },

  publish: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(data)
      })
    }
  },
}

export default PubSub

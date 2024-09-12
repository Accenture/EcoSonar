// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'Plugins',
  pluginsNumber: 0,
  score: 100,

  check: function (measures) {
    this.pluginsNumber = measures.pluginsNumber

    if (this.pluginsNumber === 0) {
      this.score = 100
    } else {
      this.score = 0
    }
  }
}, 'frameMeasuresReceived')

// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'Plugins',
  pluginsNumber: 0,

  check: function (measures) {
    this.pluginsNumber = measures.pluginsNumber
  }
}, 'frameMeasuresReceived')

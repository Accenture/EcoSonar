// eslint-disable-next-line no-undef
rulesManager.registerRule({
  complianceLevel: 'A',
  id: 'ExternalizeJs',
  inlineJsScriptsNumber: 0,

  check: function (measures) {
    this.inlineJsScriptsNumber = measures.inlineJsScriptsNumber
  }
}, 'frameMeasuresReceived')

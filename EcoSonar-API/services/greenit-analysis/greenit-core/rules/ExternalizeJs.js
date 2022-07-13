// eslint-disable-next-line no-undef
rulesManager.registerRule({
  complianceLevel: 'A',
  id: 'ExternalizeJs',
  inlineJsScriptsNumber: 0,
  score: 100,

  check: function (measures) {
    this.inlineJsScriptsNumber = measures.inlineJsScriptsNumber
    if (this.inlineJsScriptsNumber === 0) {
      this.score = 100
    } else if (this.inlineJsScriptsNumber <= 1) {
      this.score = 75
    } else if (this.inlineJsScriptsNumber <= 2) {
      this.score = 50
    } else if (this.inlineJsScriptsNumber <= 3) {
      this.score = 20
    } else {
      this.score = 0
    }
  }
}, 'frameMeasuresReceived')

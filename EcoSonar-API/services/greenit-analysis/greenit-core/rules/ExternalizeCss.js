// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'ExternalizeCss',
  inlineStyleSheetsNumber: 0,
  score: 100,

  check: function (measures) {
    this.inlineStyleSheetsNumber = measures.inlineStyleSheetsNumber

    if (this.inlineStyleSheetsNumber === 0) {
      this.score = 100
    } else if (this.inlineStyleSheetsNumber <= 1) {
      this.score = 75
    } else if (this.inlineStyleSheetsNumber <= 2) {
      this.score = 50
    } else if (this.inlineStyleSheetsNumber <= 3) {
      this.score = 20
    } else {
      this.score = 0
    }
  }
}, 'frameMeasuresReceived')

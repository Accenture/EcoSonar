// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'PrintStyleSheet',
  printStyleSheetsNumber: 0,
  score: 100,

  check: function (measures) {
    this.printStyleSheetsNumber = measures.printStyleSheetsNumber

    if (this.printStyleSheetsNumber >= 1) {
      this.score = 100
    } else {
      this.score = 0
    }
  }
}, 'frameMeasuresReceived')

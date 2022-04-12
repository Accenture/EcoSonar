// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'PrintStyleSheet',
  printStyleSheetsNumber: 0,

  check: function (measures) {
    this.printStyleSheetsNumber = measures.printStyleSheetsNumber
  }
}, 'frameMeasuresReceived')

// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'ExternalizeCss',
  inlineStyleSheetsNumber: 0,

  check: function (measures) {
    this.inlineStyleSheetsNumber = measures.inlineStyleSheetsNumber
  }
}, 'frameMeasuresReceived')

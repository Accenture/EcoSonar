/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'EmptySrcTag',
  emptySrcTagNumber: 0,

  check: function (measures) {
    this.emptySrcTagNumber = measures.emptySrcTagNumber
  }
}, 'frameMeasuresReceived')

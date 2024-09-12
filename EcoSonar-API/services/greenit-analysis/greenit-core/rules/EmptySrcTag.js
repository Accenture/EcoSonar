/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'EmptySrcTag',
  emptySrcTagNumber: 0,
  score: 100,

  check: function (measures) {
    this.emptySrcTagNumber = measures.emptySrcTagNumber

    if (this.emptySrcTagNumber === 0) {
      this.score = 100
    } else {
      this.score = 0
    }
  }
}, 'frameMeasuresReceived')

/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'HttpRequests',
  nbRequest: 0,
  requests: '',
  score: 100,

  check: function (measures) {
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        this.requests += entry.request.url + '|'
      })
    }
    this.nbRequest = measures.nbRequest

    if (this.nbRequest <= 10) {
      this.score = 100
    } else if (this.nbRequest <= 25) {
      this.score = 75
    } else if (this.nbRequest <= 33) {
      this.score = 65
    } else if (this.nbRequest <= 40) {
      this.score = 50
    } else if (this.nbRequest <= 86) {
      this.score = 35
    } else if (this.nbRequest <= 168) {
      this.score = 20
    } else {
      this.score = 0
    }
  }
}, 'harReceived')

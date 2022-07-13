/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'HttpError',
  errorNumber: 0,
  errors: '',
  score: 100,

  check: function (measures) {
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        if (entry.response) {
          if (entry.response.status >= 400) {
            this.errorNumber++
            this.errors += entry.request.url + ' ' + entry.response.status + '|'
          }
        }
      })
    }

    if (this.errorNumber === 0) {
      this.score = 100
    } else if (this.errorNumber <= 1) {
      this.score = 50
    } else {
      this.score = 0
    }
  }
}, 'harReceived')

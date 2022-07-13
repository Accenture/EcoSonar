/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'NoRedirect',
  redirectNumber: 0,
  redirections: '',
  score: 100,

  check: function (measures) {
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        if (entry.response) {
          if (isHttpRedirectCode(entry.response.status)) {
            this.redirections += entry.request.url + ' ' + entry.response.status + '|'
            this.redirectNumber++
          }
        }
      })
    }

    if (this.redirectNumber === 0) {
      this.score = 100
    } else if (this.redirectNumber === 1) {
      this.score = 75
    } else if (this.redirectNumber === 2) {
      this.score = 35
    } else {
      this.score = 0
    }
  }
}, 'harReceived')

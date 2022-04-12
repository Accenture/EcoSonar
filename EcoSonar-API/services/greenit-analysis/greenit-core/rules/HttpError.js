/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'HttpError',
  errorNumber: 0,
  errors: '',

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
  }
}, 'harReceived')

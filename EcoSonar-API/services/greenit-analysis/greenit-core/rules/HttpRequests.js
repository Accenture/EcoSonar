/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'HttpRequests',
  nbRequest: 0,
  requests: '',

  check: function (measures) {
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        this.requests += entry.request.url + '|'
      })
    }
    this.nbRequest = measures.nbRequest
  }
}, 'harReceived')

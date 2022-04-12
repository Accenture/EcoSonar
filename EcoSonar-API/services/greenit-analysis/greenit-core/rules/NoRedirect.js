/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'NoRedirect',
  redirectNumber: 0,
  redirections: '',

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
  }
}, 'harReceived')

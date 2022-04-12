/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'StyleSheets',
  styleSheets: '',
  styleSheetsNumber: 0,

  check: function (measures) {
    const styleSheetsToAdd = []
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        if (getResponseHeaderFromResource(entry, 'content-type').toLowerCase().includes('text/css')) {
          if (styleSheetsToAdd.indexOf(entry.request.url) === -1) {
            styleSheetsToAdd.push(entry.request.url)
            this.styleSheets += entry.request.url + '|'
            this.styleSheetsNumber++
          }
        }
      })
    }
  }
}, 'harReceived')

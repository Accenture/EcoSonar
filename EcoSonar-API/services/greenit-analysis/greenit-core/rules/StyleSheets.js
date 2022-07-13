/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'StyleSheets',
  styleSheets: '',
  styleSheetsNumber: 0,
  score: 100,

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

    if (this.styleSheetsNumber <= 1) {
      this.score = 100
    } else if (this.styleSheetsNumber <= 2) {
      this.score = 75
    } else if (this.styleSheetsNumber <= 3) {
      this.score = 65
    } else if (this.styleSheetsNumber <= 4) {
      this.score = 50
    } else if (this.styleSheetsNumber <= 7) {
      this.score = 35
    } else if (this.styleSheetsNumber <= 10) {
      this.score = 20
    } else { this.score = 0 }
  }
}, 'harReceived')

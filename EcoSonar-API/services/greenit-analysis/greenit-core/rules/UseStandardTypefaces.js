/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'UseStandardTypefaces',
  totalFontsSize: 0,
  fonts: '',
  score: 100,

  check: function (measures) {
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        if (isFontResource(entry) && (entry.response.content.size > 0)) {
          this.totalFontsSize += entry.response.content.size
          this.fonts += entry.request.url + ' ' + Math.round(entry.response.content.size / 1000) + 'KB|'
        }
      })
    }

    if (this.totalFontsSize === 0) {
      this.score = 100
    } else if (this.totalFontsSize <= 10000) {
      this.score = 50
    } else {
      this.score = 0
    }
  }
}, 'harReceived')

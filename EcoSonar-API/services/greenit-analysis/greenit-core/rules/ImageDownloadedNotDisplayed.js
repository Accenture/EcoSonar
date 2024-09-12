/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'ImageDownloadedNotDisplayed',
  imgAnalysed: '',
  imageDownloadedNotDisplayedNumber: 0,
  score: 100,

  isRevelant: function (entry) {
    // Very small images could be download even if not display as it may be icons
    if (entry.naturalWidth * entry.naturalHeight < 10000) return false
    return (entry.clientWidth === 0 && entry.clientHeight === 0)
  },

  check: function (measures) {
    const imgAnalysedToAdd = new Map()
    measures.imagesResizedInBrowser.forEach(entry => {
      if (!imgAnalysedToAdd.has(entry.src) && this.isRevelant(entry)) {
        imgAnalysedToAdd.set(entry.src) // Do not count two times the same picture
        this.imageDownloadedNotDisplayedNumber += 1
        this.imgAnalysed += entry.src + '|'
      }
    })

    if (this.imageDownloadedNotDisplayedNumber === 0) {
      this.score = 100
    } else if (this.imageDownloadedNotDisplayedNumber <= 4) {
      this.score = 50
    } else if (this.imageDownloadedNotDisplayedNumber <= 6) {
      this.score = 25
    } else {
      this.score = 0
    }
  }
}, 'frameMeasuresReceived')

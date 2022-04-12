/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'ImageDownloadedNotDisplayed',
  imgAnalysed: '',
  imageDownloadedNotDisplayedNumber: 0,

  isRevelant: function (entry) {
    // Very small images could be download even if not display  as it may be icons
    if (entry.naturalWidth * entry.naturalHeight < 10000) return false
    if (entry.clientWidth === 0 && entry.clientHeight === 0) return true
    return false
  },

  check: function (measures) {
    const imgAnalysedToAdd = new Map()
    measures.imagesResizedInBrowser.forEach(entry => {
      if (imgAnalysedToAdd.has(entry.src) && this.isRevelant(entry)) {
        imgAnalysedToAdd.set(entry.src) // Do not count two times the same picture
        this.imageDownloadedNotDisplayedNumber += 1
        this.imgAnalysed += entry.src + '|'
      }
    })
  }
}, 'frameMeasuresReceived')

/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'DontResizeImageInBrowser',
  imagesResizedInBrowserNumber: 0,
  imgAnalysed: '',
  score: 100,

  isRevelant: function (entry) {
    // exclude svg
    if (isSvgUrl(entry.src)) return false

    // difference of 1 pixel is not relevant
    if (entry.naturalWidth - entry.clientWidth < 2) return false
    if (entry.naturalHeight - entry.clientHeight < 2) return false

    // If picture is 0x0 it meens it's not visible on the ui , see imageDownloadedNotDisplayed
    return entry.clientWidth !== 0
  },

  check: function (measures) {
    const imgAnalysedToAdd = new Map()
    measures.imagesResizedInBrowser.forEach(entry => {
      if (!imgAnalysedToAdd.has(entry.src) && this.isRevelant(entry)) { // Do not count two times the same picture
        imgAnalysedToAdd.set(entry.src)
        this.imagesResizedInBrowserNumber += 1
        this.imgAnalysed += entry.src + '|'
      }
    })

    if (this.imagesResizedInBrowserNumber === 0) {
      this.score = 100
    } else if (this.imagesResizedInBrowserNumber <= 1) {
      this.score = 35
    } else if (this.imagesResizedInBrowserNumber <= 3) {
      this.score = 20
    } else {
      this.score = 0
    }
  }

}, 'frameMeasuresReceived')

/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'MinifiedJs',
  totalJsSize: 0,
  minifiedJsSize: 0,
  percentMinifiedJs: 0,
  contents: '',
  score: 100,

  check: function (_measures, resourceContent) {
    if (resourceContent.type.toUpperCase() === 'SCRIPT') {
      this.totalJsSize += resourceContent.content.length
      if (isMinified(resourceContent.content)) {
        this.minifiedJsSize += resourceContent.content.length
      } else {
        this.contents += `${resourceContent.url}|`
      }
      this.percentMinifiedJs = this.minifiedJsSize / this.totalJsSize * 100

      if (this.percentMinifiedJs === 100) {
        this.score = 100
      } else if (this.percentMinifiedJs >= 99.28) {
        this.score = 35
      } else if (this.percentMinifiedJs >= 98.56) {
        this.score = 20
      } else {
        this.score = 0
      }
    }
  }
}, 'resourceContentReceived')

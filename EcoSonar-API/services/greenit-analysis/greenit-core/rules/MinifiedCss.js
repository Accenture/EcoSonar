/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'MinifiedCss',
  totalCssSize: 0,
  minifiedCssSize: 0,
  percentMinifiedCss: 0,
  contents: '',
  score: 100,

  check: function (_measures, resourceContent) {
    if (resourceContent.type.toUpperCase() === 'STYLESHEET') {
      this.totalCssSize += resourceContent.content.length
      if (isMinified(resourceContent.content)) {
        this.minifiedCssSize += resourceContent.content.length
      } else {
        this.contents += `${resourceContent.url}|`
      }
      this.percentMinifiedCss = this.minifiedCssSize / this.totalCssSize * 100

      if (this.percentMinifiedCss === 100) {
        this.score = 100
      } else if (this.percentMinifiedCss >= 98.82) {
        this.score = 35
      } else if (this.percentMinifiedCss >= 97.64) {
        this.score = 20
      } else {
        this.score = 0
      }
    }
  }
}, 'resourceContentReceived')

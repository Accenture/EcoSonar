/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'MinifiedCss',
  totalCssSize: 0,
  minifiedCssSize: 0,
  percentMinifiedCss: 0,
  contents: '',

  check: function (measures, resourceContent) {
    if (resourceContent.type.toUpperCase() === 'STYLESHEET') {
      this.totalCssSize += resourceContent.content.length
      if (isMinified(resourceContent.content)) {
        this.minifiedCssSize += resourceContent.content.length
      } else {
        this.contents += `${resourceContent.url}|`
      }
      this.percentMinifiedCss = this.minifiedCssSize / this.totalCssSize * 100
    }
  }
}, 'resourceContentReceived')

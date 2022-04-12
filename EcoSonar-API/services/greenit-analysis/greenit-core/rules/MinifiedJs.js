/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'MinifiedJs',
  totalJsSize: 0,
  minifiedJsSize: 0,
  percentMinifiedJs: 0,
  contents: '',

  check: function (measures, resourceContent) {
    if (resourceContent.type.toUpperCase() === 'SCRIPT') {
      this.totalJsSize += resourceContent.content.length
      if (isMinified(resourceContent.content)) {
        this.minifiedJsSize += resourceContent.content.length
      } else {
        this.contents += `${resourceContent.url}|`
      }
      this.percentMinifiedJs = this.minifiedJsSize / this.totalJsSize * 100
    }
  }
}, 'resourceContentReceived')

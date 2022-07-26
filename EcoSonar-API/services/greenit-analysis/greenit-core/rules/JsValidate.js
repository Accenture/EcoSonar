/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'JsValidate',
  contents: '',
  errors: 0,
  totalJsSize: 0,
  score: 100,

  check: function (_measures, resourceContent) {
    if (resourceContent.type.toUpperCase() === 'SCRIPT') {
      const errorNumber = computeNumberOfErrorsInJSCode(resourceContent.content, resourceContent.url)
      if (errorNumber > 0) {
        this.errors += errorNumber
        this.contents += `URL ${resourceContent.url} has ${errorNumber} error(s)|`
      }
    }

    if (this.errors === 0) {
      this.score = 100
    } else if (this.errors <= 1) {
      this.score = 50
    } else {
      this.score = 0
    }
  }
}, 'resourceContentReceived')

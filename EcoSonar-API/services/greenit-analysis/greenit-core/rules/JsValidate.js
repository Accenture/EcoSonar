/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'JsValidate',
  contents: '',
  errors: 0,
  totalJsSize: 0,

  check: function (measures, resourceContent) {
    if (resourceContent.type.toUpperCase() === 'SCRIPT') {
      const errorNumber = computeNumberOfErrorsInJSCode(resourceContent.content, resourceContent.url)
      if (errorNumber > 0) {
        this.errors += errorNumber
        this.contents += `URL ${resourceContent.url} has ${errorNumber} error(s)|`
      }
    }
  }
}, 'resourceContentReceived')

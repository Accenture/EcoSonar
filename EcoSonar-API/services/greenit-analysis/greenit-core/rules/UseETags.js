/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'UseETags',
  staticResourcesSize: 0,
  staticResourcesWithETagsSize: 0,
  eTagsRatio: 'N.A',
  eTags: '',

  check: function (measures) {
    this.staticResourcesSize = 0
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        if (isStaticRessource(entry)) {
          this.staticResourcesSize += entry.response.content.size
          if (isRessourceUsingETag(entry)) {
            this.staticResourcesWithETagsSize += entry.response.content.size
          } else this.eTags += `${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}|`
        }
      })
    }
    if (this.staticResourcesSize > 0) {
      this.eTagsRatio = this.staticResourcesWithETagsSize / this.staticResourcesSize * 100
    }
  }
}, 'harReceived')

/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'UseETags',
  staticResourcesSize: 0,
  staticResourcesWithETagsSize: 0,
  eTagsRatio: 'N.A',
  eTags: '',
  score: 100,

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

      if (this.eTagsRatio === 100) {
        this.score = 100
      } else if (this.eTagsRatio >= 95) {
        this.score = 75
      } else if (this.eTagsRatio > 90) {
        this.score = 50
      } else {
        this.score = 0
      }
    }
  }
}, 'harReceived')

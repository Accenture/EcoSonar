/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'AddExpiresOrCacheControlHeaders',
  requests: '',
  cacheHeaderRatio: 'N.A',
  score: 100,

  check: function (measures) {
    let staticResourcesSize = 0
    let staticResourcesWithCache = 0

    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        if (isStaticRessource(entry)) {
          staticResourcesSize += entry.response.content.size
          if (hasValidCacheHeaders(entry)) {
            staticResourcesWithCache += entry.response.content.size
          } else {
            this.requests += `${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}|`
          }
        }
      })
    }
    if (staticResourcesSize > 0) {
      this.cacheHeaderRatio = staticResourcesWithCache / staticResourcesSize * 100
      if (this.cacheHeaderRatio === 100) {
        this.score = 100
      } else if (this.cacheHeaderRatio > 96.76) {
        this.score = 75
      } else if (this.cacheHeaderRatio > 90) {
        this.score = 50
      } else if (this.cacheHeaderRatio >= 88.83) {
        this.score = 35
      } else if (this.cacheHeaderRatio >= 84.85) {
        this.score = 20
      } else {
        this.score = 0
      }
    }
  }
}, 'harReceived')

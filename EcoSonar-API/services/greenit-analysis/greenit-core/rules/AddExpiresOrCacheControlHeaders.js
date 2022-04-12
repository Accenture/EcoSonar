/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'AddExpiresOrCacheControlHeaders',
  requests: '',
  cacheHeaderRatio: 'N.A',

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
    }
  }
}, 'harReceived')

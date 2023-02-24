/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'CompressHttp',
  requests: '',
  compressRatio: 'N.A',
  score: 100,

  check: function (measures) {
    let compressibleResourcesSize = 0
    let compressibleResourcesCompressedSize = 0
    if (measures.entries.length) {
      measures.entries.forEach(entry => {
        if (isCompressibleResource(entry)) {
          compressibleResourcesSize += entry.response.content.size
          if (isResourceCompressed(entry)) {
            compressibleResourcesCompressedSize += entry.response.content.size
          } else this.requests += `${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}|`
        }
      })
    }
    if (compressibleResourcesSize > 0) {
      this.compressRatio = compressibleResourcesCompressedSize / compressibleResourcesSize * 100
      if (this.compressRatio === 100) {
        this.score = 100
      } else if (this.compressRatio >= 99.38) {
        this.score = 75
      } else if (this.compressRatio >= 95.32) {
        this.score = 65
      } else if (this.compressRatio >= 94) {
        this.score = 50
      } else if (this.compressRatio >= 92.45) {
        this.score = 35
      } else if (this.compressRatio >= 89.06) {
        this.score = 20
      } else {
        this.score = 0
      }
    }
  }
}, 'harReceived')

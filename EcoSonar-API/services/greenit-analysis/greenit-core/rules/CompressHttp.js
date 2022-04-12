/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
rulesManager.registerRule({
  id: 'CompressHttp',
  requests: '',
  compressRatio: 'N.A',

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
    }
  }
}, 'harReceived')

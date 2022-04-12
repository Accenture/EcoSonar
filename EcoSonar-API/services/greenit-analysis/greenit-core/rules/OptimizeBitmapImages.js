/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'OptimizeBitmapImages',
  nbImagesToOptimize: 0,
  totalMinGains: 0,
  img: '',

  check: function (measures) {
    if (measures.entries) {
      measures.entries.forEach(entry => {
        if (entry.response) {
          const imageType = getImageTypeFromResource(entry)
          if (imageType !== '') {
            const myImage = new Image()
            myImage.src = entry.request.url
            // needed to access object in the function after
            myImage.rule = this

            myImage.size = entry.response.content.size
            myImage.onload = function () {
              const minGains = getMinOptimisationGainsForImage(this.width * this.height, this.size, imageType)
              if (minGains > 500) { // exclude small gain
                this.nbImagesToOptimize++
                this.totalMinGains += minGains
                this.img += `${this.src} ${Math.round(this.size / 1000)}, ${this.width} x ${this.height}, ${String(Math.round(minGains / 1000))}|`
              }
            }
          }
        }
      })
    }
  }
}, 'harReceived')

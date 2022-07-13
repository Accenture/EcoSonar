/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'OptimizeBitmapImages',
  nbImagesToOptimize: 0,
  totalMinGains: 0,
  img: '',
  score: 100,

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

    if (this.totalMinGains <= 0) {
      this.score = 100
    } else if (this.totalMinGains <= 25000) {
      this.score = 75
    } else if (this.totalMinGains <= 50000) {
      this.score = 50
    } else if (this.totalMinGains <= 75000) {
      this.score = 25
    } else {
      this.score = 0
    }
  }
}, 'harReceived')

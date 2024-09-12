/* eslint-disable no-undef */
rulesManager.registerRule(
  {
    id: 'OptimizeBitmapImages',
    img: '',
    score: 100,
    nbImagesToOptimize: 0,
    totalMinGains: 0,

    check: function (measures) {
      const imagesLoadingPromises = []
      const imagesLoadingStatus = []
      const imagesToLoad = []

      if (measures.entries) {
        measures.entries.forEach((entry) => {
          if (entry.response) {
            const imageType = getImageTypeFromResource(entry)
            if (imageType !== '') {
              const myImage = new Image()
              myImage.src = entry.request.url
              // needed to access object in the function after
              myImage.size = entry.response.content.size
              myImage.rule = this

              // Creating a variable that allow us to resolve the promise outside the promise declaration
              let resolveLoaded
              const loadedPromise = new Promise((resolve, _reject) => {
                resolveLoaded = resolve
              })
              myImage.resolveLoaded = resolveLoaded

              // Setting status of image into each array
              myImage.index = imagesToLoad.length
              imagesToLoad.push(myImage)
              imagesLoadingStatus.push(false)

              // Pushing a instance of the promise for each image
              imagesLoadingPromises.push(loadedPromise)

              // Onload is executed for each image
              myImage.onload = function () {
                const minGains = getMinOptimisationGainsForImage(this.width * this.height, this.size, imageType)
                if (minGains > 500) {
                  // exclude small gain
                  this.rule.nbImagesToOptimize++
                  this.rule.totalMinGains += minGains
                  this.rule.img += `${this.src} ${Math.round(this.size / 1000)}, ${this.width} x ${this.height}, ${String(Math.round(minGains / 1000))}|`
                }
                // In case it successfully load the image, we set the status to true and resolve the promise
                imagesLoadingStatus[this.index] = true
                this.resolveLoaded()
              }
            }
          }
        })
      }

      // Creating a variable to confirm that the score has been calculated
      let resolveScoreCalculated
      scoreCalculated = new Promise((resolve, _reject) => {
        resolveScoreCalculated = resolve
      })

      // Creating a variable to store the context, to avoid promise to give it own to the function called inside
      const context = this

      // Creating two promises : a timeout after 5s and allLoadedPromise that wait for every loaded promise into imageLoadingPromises array to be resolved
      const timeoutPromise = new Promise((resolve, _reject) => {
        setTimeout(resolve, 5000)
      })
      const allLoadedPromises = Promise.all(imagesLoadingPromises)

      // Race will resolved after the first promise is resolved
      Promise.race([timeoutPromise, allLoadedPromises]).then(() => {
        imagesLoadingStatus.forEach((loaded, index) => {
          if (loaded === false) {
            console.warn("Optimize bitmap image - Image couldn't be loaded in time : ")
            console.warn(imagesToLoad[index])
          }
        })
        calculateScore(context)
        resolveScoreCalculated()
      })

      function calculateScore (context) {
        if (context.totalMinGains <= 0) {
          context.score = 100
        } else if (context.totalMinGains <= 25000) {
          context.score = 75
        } else if (context.totalMinGains <= 50000) {
          context.score = 50
        } else if (context.totalMinGains <= 75000) {
          context.score = 25
        } else {
          context.score = 0
        }
      }
    }

  },
  'harReceived'
)

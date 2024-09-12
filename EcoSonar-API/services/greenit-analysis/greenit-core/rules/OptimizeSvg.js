/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'OptimizeSvg',
  totalSizeToOptimize: 0,
  totalResourcesToOptimize: 0,
  img: '',
  score: 100,

  check: function (_measures, resourceContent) {
    if ((resourceContent.type.toUpperCase() === 'IMAGE') && isSvgUrl(resourceContent.url)) {
      if (!isSvgOptimized(window.atob(resourceContent.content))) {
        this.img += `${resourceContent.url} ${String(Math.round(resourceContent.content.length / 100) / 10)}|`
        this.totalSizeToOptimize += resourceContent.content.length
        this.totalResourcesToOptimize++
      }
    }

    if (this.totalSizeToOptimize === 0) {
      this.score = 100
    } else if (this.totalSizeToOptimize <= 15000) {
      this.score = 50
    } else if (this.totalSizeToOptimize <= 17000) {
      this.score = 35
    } else if (this.totalSizeToOptimize < 20000) {
      this.score = 20
    } else {
      this.score = 0
    }
  }
}, 'resourceContentReceived')

/* eslint-disable no-undef */
rulesManager.registerRule({
  id: 'OptimizeSvg',
  totalSizeToOptimize: 0,
  totalResourcesToOptimize: 0,
  img: '',

  check: function (measures, resourceContent) {
    if ((resourceContent.type.toUpperCase() === 'IMAGE') && isSvgUrl(resourceContent.url)) {
      if (!isSvgOptimized(window.atob(resourceContent.content))) {
        this.img += `${resourceContent.url} ${String(Math.round(resourceContent.content.length / 100) / 10)}|`
        this.totalSizeToOptimize += resourceContent.content.length
        this.totalResourcesToOptimize++
      }
    }
  }
}, 'resourceContentReceived')

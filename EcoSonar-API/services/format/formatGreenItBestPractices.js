const formatBestPracticesForProject = require('../format/formatBestPracticesForProject')

class FormatGreenItBestPractices {}

/**
 * BEST PRACTICES
 *
 */
FormatGreenItBestPractices.prototype.addExpiresOrCacheControlHeaders = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let count = 0
  let cacheHeaderRatio = 0
  const requests = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.addExpiresOrCacheControlHeaders.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.addExpiresOrCacheControlHeaders.score, numberOfValues).numberOfValues
    reports[i].bestPractices.addExpiresOrCacheControlHeaders.requests.map((item) => requests.add(item))
    if (
      reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio >= 0 &&
      reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio !== 'N.A' &&
      reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio !== undefined
    ) {
      cacheHeaderRatio = cacheHeaderRatio + reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio
      count++
    }
    i++
  }
  if (count === 0) {
    cacheHeaderRatio = 'N.A'
  } else if (cacheHeaderRatio !== 0) {
    cacheHeaderRatio = formatBestPracticesForProject.getPercentage(cacheHeaderRatio, count)
  }

  const array = Array.from(requests)
  return formatBestPracticesForProject.formatResponse(cacheHeaderRatio, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.compressHttp = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let count = 0
  let compressRatio = 0
  const requests = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.compressHttp.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.compressHttp.score, numberOfValues).numberOfValues
    reports[i].bestPractices.compressHttp.requests.map((item) => requests.add(item))
    if (
      reports[i].bestPractices.compressHttp.compressRatio >= 0 &&
      reports[i].bestPractices.compressHttp.compressRatio !== 'N.A' &&
      reports[i].bestPractices.compressHttp.compressRatio !== undefined
    ) {
      compressRatio = compressRatio + reports[i].bestPractices.compressHttp.compressRatio
      count++
    }
    i++
  }
  if (count === 0) {
    compressRatio = 'N.A'
  } else if (compressRatio !== 0) {
    compressRatio = formatBestPracticesForProject.getPercentage(compressRatio, count)
  }

  const array = Array.from(requests)
  return formatBestPracticesForProject.formatResponse(compressRatio, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.domainsNumber = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const dom = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.domainsNumber.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.domainsNumber.score, numberOfValues).numberOfValues
    reports[i].bestPractices.domainsNumber.domains.map((item) => dom.add(item))
    i++
  }

  const array = Array.from(dom)
  const domainsNumberAverage = formatBestPracticesForProject.getPercentage(array.length, i)
  return formatBestPracticesForProject.formatResponse(domainsNumberAverage, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.dontResizeImageInBrowser = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const img = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.dontResizeImageInBrowser.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.dontResizeImageInBrowser.score, numberOfValues).numberOfValues
    reports[i].bestPractices.dontResizeImageInBrowser.imgAnalysed.map((item) => img.add(item))
    i++
  }

  const array = Array.from(img)
  const numberimageAnalyse = array.length
  return formatBestPracticesForProject.formatResponse(numberimageAnalyse, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.emptySrcTag = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let emptySrcTagNumber = 0

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.emptySrcTag.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.emptySrcTag.score, numberOfValues).numberOfValues
    if (
      reports[i].bestPractices.emptySrcTag.emptySrcTagNumber >= 0 &&
      reports[i].bestPractices.emptySrcTag.emptySrcTagNumber !== 'N.A' &&
      reports[i].bestPractices.emptySrcTag.emptySrcTagNumber !== undefined
    ) {
      emptySrcTagNumber = emptySrcTagNumber + reports[i].bestPractices.emptySrcTag.emptySrcTagNumber
    }
    i++
  }
  return formatBestPracticesForProject.formatResponse(emptySrcTagNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), [])
}

FormatGreenItBestPractices.prototype.externalizeCss = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let inlineStyleSheetsNumber = 0

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.externalizeCss.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.externalizeCss.score, numberOfValues).numberOfValues
    if (
      reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber >= 0 &&
      reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber !== 'N.A' &&
      reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber !== undefined
    ) {
      inlineStyleSheetsNumber = inlineStyleSheetsNumber + reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber
    }
    i++
  }
  return formatBestPracticesForProject.formatResponse(inlineStyleSheetsNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), [])
}

FormatGreenItBestPractices.prototype.externalizeJs = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let inlineJsScriptsNumber = 0

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.externalizeJs.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.externalizeJs.score, numberOfValues).numberOfValues
    if (
      reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber >= 0 &&
      reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber !== 'N.A' &&
      reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber !== undefined
    ) {
      inlineJsScriptsNumber = inlineJsScriptsNumber + reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber
    }
    i++
  }
  return formatBestPracticesForProject.formatResponse(inlineJsScriptsNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), [])
}

FormatGreenItBestPractices.prototype.httpError = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const err = new Set()
  const errorNumber = 0

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.httpError.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.httpError.score, numberOfValues).numberOfValues
    reports[i].bestPractices.httpError.errors.map((item) => err.add(item))
    i++
  }
  const array = Array.from(err)
  return formatBestPracticesForProject.formatResponse(errorNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.httpRequests = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let averageNumberOfRequest = 0
  const requests = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.httpRequests.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.httpRequests.score, numberOfValues).numberOfValues
    reports[i].bestPractices.httpRequests.requests.map((item) => requests.add(item))
    i++
  }
  const array = Array.from(requests)
  averageNumberOfRequest = Math.ceil(array.length / reports.length)
  return formatBestPracticesForProject.formatResponse(averageNumberOfRequest, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.imageDownloadedNotDisplayed = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let imageDownloadedNotDisplayedNumber = 0
  const img = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.imageDownloadedNotDisplayed.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.imageDownloadedNotDisplayed.score, numberOfValues).numberOfValues
    reports[i].bestPractices.imageDownloadedNotDisplayed.imgAnalysed.map((item) => img.add(item))
    i++
  }
  const array = Array.from(img)
  imageDownloadedNotDisplayedNumber = array.length
  return formatBestPracticesForProject.formatResponse(imageDownloadedNotDisplayedNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.jsValidate = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let errors = 0
  const array = []

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.jsValidate.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.jsValidate.score, numberOfValues).numberOfValues
    reports[i].bestPractices.jsValidate.contents.map((item) => array.push(item))
    if (reports[i].bestPractices.jsValidate.errors >= 0 && reports[i].bestPractices.jsValidate.errors !== 'N.A' && reports[i].bestPractices.jsValidate.errors !== undefined) {
      errors = errors + reports[i].bestPractices.jsValidate.errors
    }
    i++
  }
  return formatBestPracticesForProject.formatResponse(errors, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.maxCookiesLength = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let maxCookiesLength = 0
  let j
  const domains = new Map()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.maxCookiesLength.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.maxCookiesLength.score, numberOfValues).numberOfValues
    j = 0
    while (j < reports[i].bestPractices.maxCookiesLength.domains.length) {
      const word = reports[i].bestPractices.maxCookiesLength.domains[j].split(' ')
      const cookiesLength = word[0]
      if (cookiesLength !== 0) {
        const domainToCheck = word[1]
        if (domains.has(domainToCheck)) {
          if (domains.get(domainToCheck) < cookiesLength) {
            domains.set(domainToCheck, cookiesLength)
          }
        } else {
          domains.set(domainToCheck, cookiesLength)
        }
      }
      j++
    }
    i++
  }
  i = 0
  while (i < reports.length) {
    if (reports[i].bestPractices.maxCookiesLength.maxCookiesLength > maxCookiesLength) {
      maxCookiesLength = reports[i].bestPractices.maxCookiesLength.maxCookiesLength
    }
    i++
  }

  const tab = Array.from(domains)
  let str
  const array = []
  i = 0
  while (i < tab.length) {
    str = tab[i][0] + ' ' + tab[i][1]
    array.push(str)
    i++
  }
  return formatBestPracticesForProject.formatResponse(maxCookiesLength, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.minifiedCss = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let totalCssSize = 0
  let minifiedCssSize = 0
  const totalPercentMinifiedCss = 0
  let averagePercentMinifiedCss = 0
  const array = []

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.minifiedCss.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.minifiedCss.score, numberOfValues).numberOfValues
    reports[i].bestPractices.minifiedCss.contents.map((item) => array.push(item))
    if (reports[i].bestPractices.minifiedCss.totalCssSize >= 0 && reports[i].bestPractices.minifiedCss.totalCssSize !== 'N.A' && reports[i].bestPractices.minifiedCss.totalCssSize !== undefined) {
      totalCssSize = totalCssSize + reports[i].bestPractices.minifiedCss.totalCssSize
    }
    if (
      reports[i].bestPractices.minifiedCss.minifiedCssSize >= 0 &&
      reports[i].bestPractices.minifiedCss.minifiedCssSize !== 'N.A' &&
      reports[i].bestPractices.minifiedCss.minifiedCssSize !== undefined
    ) {
      minifiedCssSize = minifiedCssSize + reports[i].bestPractices.minifiedCss.minifiedCssSize
    }
    i++
  }

  if (totalCssSize === 0) {
    averagePercentMinifiedCss = 'N.A'
  } else {
    averagePercentMinifiedCss = totalPercentMinifiedCss / numberOfValues
  }

  return formatBestPracticesForProject.formatResponse(averagePercentMinifiedCss, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.minifiedJs = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let totalJsSize = 0
  let minifiedJsSize = 0
  const totalPercentMinifiedJs = 0
  let averagePercentMinifiedJs = 0
  const array = []

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.minifiedJs.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.minifiedJs.score, numberOfValues).numberOfValues
    reports[i].bestPractices.minifiedJs.contents.map((item) => array.push(item))
    if (reports[i].bestPractices.minifiedJs.totalJsSize >= 0 && reports[i].bestPractices.minifiedJs.totalJsSize !== 'N.A' && reports[i].bestPractices.minifiedJs.totalJsSize !== undefined) {
      totalJsSize = totalJsSize + reports[i].bestPractices.minifiedJs.totalJsSize
    }
    if (reports[i].bestPractices.minifiedJs.minifiedJsSize >= 0 && reports[i].bestPractices.minifiedJs.minifiedJsSize !== 'N.A' && reports[i].bestPractices.minifiedJs.minifiedJsSize !== undefined) {
      minifiedJsSize = minifiedJsSize + reports[i].bestPractices.minifiedJs.minifiedJsSize
    }
    i++
  }

  if (totalJsSize === 0) {
    averagePercentMinifiedJs = 'N.A'
  } else {
    averagePercentMinifiedJs = totalPercentMinifiedJs / numberOfValues
  }
  return formatBestPracticesForProject.formatResponse(averagePercentMinifiedJs, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.noCookieForStaticRessources = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let count = 0
  let totalCookiesSize = 0
  const cookiesTab = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.noCookieForStaticRessources.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.noCookieForStaticRessources.score, numberOfValues).numberOfValues
    reports[i].bestPractices.noCookieForStaticRessources.cookies.map((item) => cookiesTab.add(item))
    if (
      reports[i].bestPractices.noCookieForStaticRessources.totalCookiesSize >= 0 &&
      reports[i].bestPractices.noCookieForStaticRessources.totalCookiesSize !== 'N.A' &&
      reports[i].bestPractices.noCookieForStaticRessources.totalCookiesSize !== undefined
    ) {
      totalCookiesSize = totalCookiesSize + reports[i].bestPractices.noCookieForStaticRessources.totalCookiesSize
      count++
    }
    i++
  }

  if (count === 0) {
    totalCookiesSize = 0
  } else {
    totalCookiesSize = totalCookiesSize / count
  }
  const array = Array.from(cookiesTab)
  return formatBestPracticesForProject.formatResponse(totalCookiesSize, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.noRedirect = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let redirectNumber = 0
  const red = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.noRedirect.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.noRedirect.score, numberOfValues).numberOfValues
    reports[i].bestPractices.noRedirect.redirections.map((item) => red.add(item))
    i++
  }

  const array = Array.from(red)
  redirectNumber = array.length
  return formatBestPracticesForProject.formatResponse(redirectNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.optimizeBitmapImages = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let count = 0
  let totalMinGains = 0
  const image = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.optimizeBitmapImages.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.optimizeBitmapImages.score, numberOfValues).numberOfValues
    reports[i].bestPractices.optimizeBitmapImages.img.map((item) => image.add(item))
    if (
      reports[i].bestPractices.optimizeBitmapImages.totalMinGains >= 0 &&
      reports[i].bestPractices.optimizeBitmapImages.totalMinGains !== 'N.A' &&
      reports[i].bestPractices.optimizeBitmapImages.totalMinGains !== undefined
    ) {
      count++
      totalMinGains = totalMinGains + reports[i].bestPractices.optimizeBitmapImages.totalMinGains
    }
    i++
  }

  if (count === 0) {
    totalMinGains = 0
  } else {
    totalMinGains = totalMinGains / count
  }
  const array = Array.from(image)
  return formatBestPracticesForProject.formatResponse(totalMinGains, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.optimizeSvg = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let count = 0
  let totalResourcesToOptimize = 0
  const image = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.optimizeSvg.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.optimizeSvg.score, numberOfValues).numberOfValues
    reports[i].bestPractices.optimizeSvg.img.map((item) => image.add(item))
    if (
      reports[i].bestPractices.optimizeSvg.totalResourcesToOptimize >= 0 &&
      reports[i].bestPractices.optimizeSvg.totalResourcesToOptimize !== 'N.A' &&
      reports[i].bestPractices.optimizeSvg.totalResourcesToOptimize !== undefined
    ) {
      count++
      totalResourcesToOptimize = totalResourcesToOptimize + reports[i].bestPractices.optimizeSvg.totalResourcesToOptimize
    }
    i++
  }

  if (count === 0) {
    totalResourcesToOptimize = 0
  }
  const array = Array.from(image)
  return formatBestPracticesForProject.formatResponse(totalResourcesToOptimize, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.plugins = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let pluginsNumber = 0

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.plugins.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.plugins.score, numberOfValues).numberOfValues
    if (reports[i].bestPractices.plugins.pluginsNumber >= 0 && reports[i].bestPractices.plugins.pluginsNumber !== 'N.A' && reports[i].bestPractices.plugins.pluginsNumber !== undefined) {
      pluginsNumber = pluginsNumber + reports[i].bestPractices.plugins.pluginsNumber
    }
    i++
  }
  return formatBestPracticesForProject.formatResponse(pluginsNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), [])
}

FormatGreenItBestPractices.prototype.printStyleSheet = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let printStyleSheetsNumber = 0

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.printStyleSheet.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.printStyleSheet.score, numberOfValues).numberOfValues
    if (
      reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber !== undefined &&
      reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber !== 'N.A' &&
      reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber > 0
    ) {
      printStyleSheetsNumber = printStyleSheetsNumber + reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber
    }
    i++
  }
  return formatBestPracticesForProject.formatResponse(printStyleSheetsNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), [])
}

FormatGreenItBestPractices.prototype.socialNetworkButton = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let nbSocialNetworkButton = 0
  const socialTab = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.socialNetworkButton.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.socialNetworkButton.score, numberOfValues).numberOfValues
    reports[i].bestPractices.socialNetworkButton.socialNetworks.map((item) => socialTab.add(item))
    i++
  }
  const array = Array.from(socialTab)
  nbSocialNetworkButton = array.length
  return formatBestPracticesForProject.formatResponse(nbSocialNetworkButton, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.styleSheets = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let styleSheetsAverage = 0
  const styleSheetsTab = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.styleSheets.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.styleSheets.score, numberOfValues).numberOfValues
    reports[i].bestPractices.styleSheets.styleSheets.map((item) => styleSheetsTab.add(item))
    i++
  }

  const array = Array.from(styleSheetsTab)
  styleSheetsAverage = array.length / numberOfValues

  return formatBestPracticesForProject.formatResponse(styleSheetsAverage, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.useETags = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let count = 0
  let eTagsRatio = 0
  const tab = new Set()

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.useETags.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.useETags.score, numberOfValues).numberOfValues
    reports[i].bestPractices.useETags.eTags.map((item) => tab.add(item))
    if (reports[i].bestPractices.useETags.eTagsRatio >= 0 && reports[i].bestPractices.useETags.eTagsRatio !== 'N.A' && reports[i].bestPractices.useETags.eTagsRatio !== undefined) {
      count++
      eTagsRatio = eTagsRatio + reports[i].bestPractices.useETags.eTagsRatio
    }
    i++
  }

  if (count === 0) {
    eTagsRatio = 'N.A'
  } else if (eTagsRatio !== 0) {
    eTagsRatio = formatBestPracticesForProject.getPercentage(eTagsRatio, count)
  }
  const array = Array.from(tab)
  return formatBestPracticesForProject.formatResponse(eTagsRatio, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.useStandardTypefaces = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const tab = new Set()
  let totalFontsSize = 0

  while (i < reports.length) {
    totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.useStandardTypefaces.score, numberOfValues).totalScore
    numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.useStandardTypefaces.score, numberOfValues).numberOfValues
    reports[i].bestPractices.useStandardTypefaces.fonts.map((item) => tab.add(item))
    if (
      reports[i].bestPractices.useStandardTypefaces.totalFontsSize >= 0 &&
      reports[i].bestPractices.useStandardTypefaces.totalFontsSize !== 'N.A' &&
      reports[i].bestPractices.useStandardTypefaces.totalFontsSize !== undefined
    ) {
      totalFontsSize = totalFontsSize + reports[i].bestPractices.useStandardTypefaces.totalFontsSize
    }
    i++
  }
  const array = Array.from(tab)
  return formatBestPracticesForProject.formatResponse(Math.trunc(totalFontsSize / 1000), formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

const formatGreenItBestPractices = new FormatGreenItBestPractices()
module.exports = formatGreenItBestPractices

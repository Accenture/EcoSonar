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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.addExpiresOrCacheControlHeaders.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.addExpiresOrCacheControlHeaders.requests.map((item) => requests.add(item))
    if (
      reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio >= 0 &&
      reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio !== 'N.A' &&
      reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio !== undefined
    ) {
      cacheHeaderRatio += reports[i].bestPractices.addExpiresOrCacheControlHeaders.cacheHeaderRatio
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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.compressHttp.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.compressHttp.requests.map((item) => requests.add(item))
    if (
      reports[i].bestPractices.compressHttp.compressRatio >= 0 &&
      reports[i].bestPractices.compressHttp.compressRatio !== 'N.A' &&
      reports[i].bestPractices.compressHttp.compressRatio !== undefined
    ) {
      compressRatio += reports[i].bestPractices.compressHttp.compressRatio
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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.domainsNumber.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.domainsNumber.domains.map((item) => dom.add(item))
    i++
  }

  const array = Array.from(dom)
  const domainsNumberAverage = Math.round(array.length / numberOfValues)
  return formatBestPracticesForProject.formatResponse(domainsNumberAverage, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.dontResizeImageInBrowser = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const img = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.dontResizeImageInBrowser.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.dontResizeImageInBrowser.imgAnalysed.map((item) => img.add(item))
    i++
  }

  const array = Array.from(img)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.emptySrcTag = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let emptySrcTagNumber = 0

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.emptySrcTag.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    if (
      reports[i].bestPractices.emptySrcTag.emptySrcTagNumber >= 0 &&
      reports[i].bestPractices.emptySrcTag.emptySrcTagNumber !== 'N.A' &&
      reports[i].bestPractices.emptySrcTag.emptySrcTagNumber !== undefined
    ) {
      emptySrcTagNumber += reports[i].bestPractices.emptySrcTag.emptySrcTagNumber
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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.externalizeCss.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    if (
      reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber >= 0 &&
      reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber !== 'N.A' &&
      reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber !== undefined
    ) {
      inlineStyleSheetsNumber += reports[i].bestPractices.externalizeCss.inlineStyleSheetsNumber
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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.externalizeJs.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    if (
      reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber >= 0 &&
      reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber !== 'N.A' &&
      reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber !== undefined
    ) {
      inlineJsScriptsNumber += reports[i].bestPractices.externalizeJs.inlineJsScriptsNumber
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

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.httpError.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.httpError.errors.map((item) => err.add(item))
    i++
  }
  const array = Array.from(err)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.httpRequests = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const requests = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.httpRequests.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.httpRequests.requests.map((item) => requests.add(item))
    i++
  }
  const array = Array.from(requests)
  const averageNumberOfRequest = Math.round(array.length / numberOfValues)
  return formatBestPracticesForProject.formatResponse(averageNumberOfRequest, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.imageDownloadedNotDisplayed = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const img = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.imageDownloadedNotDisplayed.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.imageDownloadedNotDisplayed.imgAnalysed.map((item) => img.add(item))
    i++
  }
  const array = Array.from(img)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.jsValidate = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const array = []

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.jsValidate.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.jsValidate.contents.map((item) => array.push(item))
    i++
  }
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.maxCookiesLength = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let maxCookiesLength = 0
  let j
  const domains = new Map()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.maxCookiesLength.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
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
  let averagePercentMinifiedCss = 0
  const array = []
  let isApplicable = true

  while (i < reports.length) {
    // In case the analyzed URL does not use any CSS we don't count it as a consistent
    if (reports[i].bestPractices.minifiedCss.totalCssSize > 0) {
      const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.minifiedCss.score, numberOfValues)
      totalScore = addScoresResult.totalScore
      numberOfValues = addScoresResult.numberOfValues
      reports[i].bestPractices.minifiedCss.contents.map((item) => array.push(item))
      if (reports[i].bestPractices.minifiedCss.totalCssSize >= 0 && reports[i].bestPractices.minifiedCss.totalCssSize !== 'N.A' && reports[i].bestPractices.minifiedCss.totalCssSize !== undefined) {
        totalCssSize += reports[i].bestPractices.minifiedCss.totalCssSize
      }
      if (
        reports[i].bestPractices.minifiedCss.minifiedCssSize >= 0 &&
      reports[i].bestPractices.minifiedCss.minifiedCssSize !== 'N.A' &&
      reports[i].bestPractices.minifiedCss.minifiedCssSize !== undefined
      ) {
        minifiedCssSize += reports[i].bestPractices.minifiedCss.minifiedCssSize
      }
    } i++
  }

  // Then we use isApplicable param to set the compliance for this specific URL on N.A in order to avoid a non-using CSS URL to have a G grade
  if (totalCssSize === 0) {
    averagePercentMinifiedCss = 'N.A'
    isApplicable = false
  } else {
    averagePercentMinifiedCss = Math.round(minifiedCssSize / totalCssSize * 100)
  }
  return formatBestPracticesForProject.formatResponse(averagePercentMinifiedCss, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array, isApplicable)
}

FormatGreenItBestPractices.prototype.minifiedJs = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let totalJsSize = 0
  let minifiedJsSize = 0
  let averagePercentMinifiedJs = 0
  const array = []
  let isApplicable = true

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.minifiedJs.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.minifiedJs.contents.map((item) => array.push(item))
    if (reports[i].bestPractices.minifiedJs.totalJsSize >= 0 && reports[i].bestPractices.minifiedJs.totalJsSize !== 'N.A' && reports[i].bestPractices.minifiedJs.totalJsSize !== undefined) {
      totalJsSize += reports[i].bestPractices.minifiedJs.totalJsSize
    }
    if (reports[i].bestPractices.minifiedJs.minifiedJsSize >= 0 && reports[i].bestPractices.minifiedJs.minifiedJsSize !== 'N.A' && reports[i].bestPractices.minifiedJs.minifiedJsSize !== undefined) {
      minifiedJsSize += reports[i].bestPractices.minifiedJs.minifiedJsSize
    }
    i++
  }

  if (totalJsSize === 0) {
    // Then we use isApplicable param to set the compliance for this specific URL on N.A in order to avoid a non-using JS URL to have a G grade
    averagePercentMinifiedJs = 'N.A'
    isApplicable = false
  } else {
    averagePercentMinifiedJs = Math.round(minifiedJsSize / totalJsSize * 100)
  }
  return formatBestPracticesForProject.formatResponse(averagePercentMinifiedJs, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array, isApplicable)
}

FormatGreenItBestPractices.prototype.noCookieForStaticRessources = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const cookiesTab = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.noCookieForStaticRessources.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.noCookieForStaticRessources.cookies.map((item) => cookiesTab.add(item))
    i++
  }
  const array = Array.from(cookiesTab)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.noRedirect = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const red = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.noRedirect.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.noRedirect.redirections.map((item) => red.add(item))
    i++
  }

  const array = Array.from(red)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.optimizeBitmapImages = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const image = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.optimizeBitmapImages.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.optimizeBitmapImages.img.map((item) => image.add(item))
    i++
  }
  const array = Array.from(image)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.optimizeSvg = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const image = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.optimizeSvg.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.optimizeSvg.img.map((item) => image.add(item))
    i++
  }
  const array = Array.from(image)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.plugins = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  let pluginsNumber = 0

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.plugins.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    if (reports[i].bestPractices.plugins.pluginsNumber >= 0 && reports[i].bestPractices.plugins.pluginsNumber !== 'N.A' && reports[i].bestPractices.plugins.pluginsNumber !== undefined) {
      pluginsNumber += reports[i].bestPractices.plugins.pluginsNumber
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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.printStyleSheet.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    if (
      reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber !== undefined &&
      reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber !== 'N.A' &&
      reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber > 0
    ) {
      printStyleSheetsNumber += reports[i].bestPractices.printStyleSheet.printStyleSheetsNumber
    }
    i++
  }
  return formatBestPracticesForProject.formatResponse(printStyleSheetsNumber, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), [])
}

FormatGreenItBestPractices.prototype.socialNetworkButton = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const socialTab = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.socialNetworkButton.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.socialNetworkButton.socialNetworks.map((item) => socialTab.add(item))
    i++
  }
  const array = Array.from(socialTab)
  return formatBestPracticesForProject.formatResponse(array.length, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

FormatGreenItBestPractices.prototype.styleSheets = function (reports) {
  let totalScore = 0
  let numberOfValues = 0
  let i = 0
  const styleSheetsTab = new Set()

  while (i < reports.length) {
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.styleSheets.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.styleSheets.styleSheets.map((item) => styleSheetsTab.add(item))
    i++
  }

  const array = Array.from(styleSheetsTab)
  const styleSheetsAverage = Math.round(array.length / numberOfValues)
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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.useETags.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.useETags.eTags.map((item) => tab.add(item))
    if (reports[i].bestPractices.useETags.eTagsRatio >= 0 && reports[i].bestPractices.useETags.eTagsRatio !== 'N.A' && reports[i].bestPractices.useETags.eTagsRatio !== undefined) {
      count++
      eTagsRatio += reports[i].bestPractices.useETags.eTagsRatio
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
    const addScoresResult = formatBestPracticesForProject.addScores(totalScore, reports[i].bestPractices.useStandardTypefaces.score, numberOfValues)
    totalScore = addScoresResult.totalScore
    numberOfValues = addScoresResult.numberOfValues
    reports[i].bestPractices.useStandardTypefaces.fonts.map((item) => tab.add(item))
    if (
      reports[i].bestPractices.useStandardTypefaces.totalFontsSize >= 0 &&
      reports[i].bestPractices.useStandardTypefaces.totalFontsSize !== 'N.A' &&
      reports[i].bestPractices.useStandardTypefaces.totalFontsSize !== undefined
    ) {
      totalFontsSize += reports[i].bestPractices.useStandardTypefaces.totalFontsSize
    }
    i++
  }
  const array = Array.from(tab)
  return formatBestPracticesForProject.formatResponse(Math.round(totalFontsSize / 1000), formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), array)
}

const formatGreenItBestPractices = new FormatGreenItBestPractices()
module.exports = formatGreenItBestPractices

class FormatGreenItBestPractices {}

FormatGreenItBestPractices.prototype.formatReports = function (reports) {
  const addExpiresOrCacheControlHeaders = this.addExpiresOrCacheControlHeaders(reports)
  const compressHttp = this.compressHttp(reports)
  const domainsNumber = this.domainsNumber(reports)
  const dontResizeImageInBrowser = this.dontResizeImageInBrowser(reports)
  const emptySrcTag = this.emptySrcTag(reports)
  const externalizeCss = this.externalizeCss(reports)
  const externalizeJs = this.externalizeJs(reports)
  const httpError = this.httpError(reports)
  const httpRequests = this.httpRequests(reports)
  const imageDownloadedNotDisplayed = this.imageDownloadedNotDisplayed(reports)
  const jsValidate = this.jsValidate(reports)
  const maxCookiesLength = this.maxCookiesLength(reports)
  const minifiedCss = this.minifiedCss(reports)
  const minifiedJs = this.minifiedJs(reports)
  const noCookieForStaticRessources = this.noCookieForStaticRessources(reports)
  const noRedirect = this.noRedirect(reports)
  const optimizeBitmapImages = this.optimizeBitmapImages(reports)
  const optimizeSvg = this.optimizeSvg(reports)
  const plugins = this.plugins(reports)
  const printStyleSheet = this.printStyleSheet(reports)
  const socialNetworkButton = this.socialNetworkButton(reports)
  const styleSheets = this.styleSheets(reports)
  const useETags = this.useETags(reports)
  const useStandardTypefaces = this.useStandardTypefaces(reports)
  const compliance = [
    ['addExpiresOrCacheControlHeaders', addExpiresOrCacheControlHeaders],
    ['compressHttp', compressHttp],
    ['domainsNumber', domainsNumber],
    ['dontResizeImageInBrowser', dontResizeImageInBrowser],
    ['emptySrcTag', emptySrcTag],
    ['externalizeCss', externalizeCss],
    ['externalizeJs', externalizeJs],
    ['httpError', httpError],
    ['httpRequests', httpRequests],
    ['imageDownloadedNotDisplayed', imageDownloadedNotDisplayed],
    ['jsValidate', jsValidate],
    ['maxCookiesLength', maxCookiesLength],
    ['minifiedCss', minifiedCss],
    ['minifiedJs', minifiedJs],
    ['noCookieForStaticRessources', noCookieForStaticRessources],
    ['noRedirect', noRedirect],
    ['optimizeBitmapImages', optimizeBitmapImages],
    ['optimizeSvg', optimizeSvg],
    ['plugins', plugins],
    ['printStyleSheet', printStyleSheet],
    ['socialNetworkButton', socialNetworkButton],
    ['styleSheets', styleSheets],
    ['useETags', useETags],
    ['useStandardTypefaces', useStandardTypefaces]]

  const resultFormatted = this.formatCompliance(compliance)

  resultFormatted.addExpiresOrCacheControlHeaders.description = addExpiresOrCacheControlHeaders[1]
  resultFormatted.compressHttp.description = compressHttp[1]
  resultFormatted.domainsNumber.description = domainsNumber[1]
  resultFormatted.dontResizeImageInBrowser.description = dontResizeImageInBrowser[1]
  resultFormatted.emptySrcTag.description = emptySrcTag[1]
  resultFormatted.externalizeCss.description = externalizeCss[1]
  resultFormatted.externalizeJs.description = externalizeJs[1]
  resultFormatted.httpError.description = httpError[1]
  resultFormatted.httpRequests.description = httpRequests[1]
  resultFormatted.imageDownloadedNotDisplayed.description = imageDownloadedNotDisplayed[1]
  resultFormatted.jsValidate.description = jsValidate[1]
  resultFormatted.maxCookiesLength.description = maxCookiesLength[1]
  resultFormatted.minifiedCss.description = minifiedCss[1]
  resultFormatted.minifiedJs.description = minifiedJs[1]
  resultFormatted.noCookieForStaticRessources.description = noCookieForStaticRessources[1]
  resultFormatted.noRedirect.description = noRedirect[1]
  resultFormatted.optimizeBitmapImages.description = optimizeBitmapImages[1]
  resultFormatted.optimizeSvg.description = optimizeSvg[1]
  resultFormatted.plugins.description = plugins[1]
  resultFormatted.printStyleSheet.description = printStyleSheet[1]
  resultFormatted.socialNetworkButton.description = socialNetworkButton[1]
  resultFormatted.styleSheets.description = styleSheets[1]
  resultFormatted.useETags.description = useETags[1]
  resultFormatted.useStandardTypefaces.description = useStandardTypefaces[1]

  return resultFormatted
}

FormatGreenItBestPractices.prototype.formatCompliance = function (compliance) {
  const tabA = []
  const tabB = []
  const tabC = []
  const tabNA = []
  let i = 0
  while (i < compliance.length) {
    if (compliance[i][1][2] === 'A') {
      tabA.push(compliance[i])
    } else if (compliance[i][1][2] === 'B') {
      tabB.push(compliance[i])
    } else if (compliance[i][1][2] === 'C') {
      tabC.push(compliance[i])
    } else {
      tabNA.push(compliance[i])
    }
    i++
  }
  // json
  i = 0
  let json = '{'
  while (i < tabC.length) {
    json = json + '"' + tabC[i][0] + '"' + ':{"title":' + '"' + tabC[i][1][0] + '"' + ',"compliance":'
    json = json + '"' + tabC[i][1][2] + '"' + '}'
    if (i < tabC.length - 1 || (tabB.length !== 0 || tabA.length !== 0 || tabNA.length !== 0)) {
      json = json + ','
    }
    i++
  }
  i = 0
  while (i < tabB.length) {
    json = json + '"' + tabB[i][0] + '"' + ':{"title":' + '"' + tabB[i][1][0] + '"' + ',"compliance":'
    json = json + '"' + tabB[i][1][2] + '"' + '}'
    if (i < tabB.length - 1 || (tabA.length !== 0 || tabNA.length !== 0)) {
      json = json + ','
    }
    i++
  }
  i = 0
  while (i < tabA.length) {
    json = json + '"' + tabA[i][0] + '"' + ':{"title":' + '"' + tabA[i][1][0] + '"' + ',"compliance":'
    json = json + '"' + tabA[i][1][2] + '"' + '}'
    if (i < tabA.length - 1 || tabNA.length !== 0) {
      json = json + ','
    }
    i++
  }
  i = 0
  while (i < tabNA.length) {
    json = json + '"' + tabNA[i][0] + '"' + ':{"title":' + '"' + tabNA[i][1][0] + '"' + ',"compliance":'
    json = json + '"' + tabNA[i][1][2] + '"' + '}'
    if (i < tabNA.length - 1) {
      json = json + ','
    }
    i++
  }
  json = json + '}'
  return JSON.parse(json)
}

FormatGreenItBestPractices.prototype.addExpiresOrCacheControlHeaders = function (reports) {
  let i = 0
  let count = 0

  const requests = new Set()
  let cacheHeaderRatio = 0

  const response = []

  while (i < reports.length) {
    reports[i].bestPractices.AddExpiresOrCacheControlHeaders.requests.map(item => requests.add(item))
    if (reports[i].bestPractices.AddExpiresOrCacheControlHeaders.cacheHeaderRatio >= 0 && reports[i].bestPractices.AddExpiresOrCacheControlHeaders.cacheHeaderRatio !== 'N.A' && reports[i].bestPractices.AddExpiresOrCacheControlHeaders.cacheHeaderRatio !== undefined) {
      cacheHeaderRatio = cacheHeaderRatio + reports[i].bestPractices.AddExpiresOrCacheControlHeaders.cacheHeaderRatio
      count++
    }
    i++
  }
  if (count === 0) {
    cacheHeaderRatio = 'N.A'
  } else if (cacheHeaderRatio !== 0) {
    cacheHeaderRatio = Math.round((cacheHeaderRatio / count) * 100) / 100
  }
  response.push(cacheHeaderRatio)
  const array = Array.from(requests)
  response.push(array)

  // compliance level
  let compliance
  if (cacheHeaderRatio === 'N.A') {
    compliance = 'N.A'
  } else if (cacheHeaderRatio > 95) {
    compliance = 'A'
  } else if (cacheHeaderRatio > 90) {
    compliance = 'B'
  } else {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.compressHttp = function (reports) {
  let i = 0
  let count = 0

  const requests = new Set()
  let compressRatio = 0

  const response = []

  while (i < reports.length) {
    reports[i].bestPractices.CompressHttp.requests.map(item => requests.add(item))
    if (reports[i].bestPractices.CompressHttp.compressRatio >= 0 && reports[i].bestPractices.CompressHttp.compressRatio !== 'N.A' && reports[i].bestPractices.CompressHttp.compressRatio !== undefined) {
      compressRatio = compressRatio + reports[i].bestPractices.CompressHttp.compressRatio
      count++
    }
    i++
  }

  if (count === 0) {
    compressRatio = 'N.A'
  } else if (compressRatio !== 0) {
    compressRatio = Math.round((compressRatio / count) * 100) / 100
  }
  response.push(compressRatio)
  const array = Array.from(requests)
  response.push(array)

  // compliance level
  let compliance
  if (compressRatio === 'N.A') {
    compliance = 'N.A'
  } else if (compressRatio > 95) {
    compliance = 'A'
  } else if (compressRatio > 90) {
    compliance = 'B'
  } else {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.domainsNumber = function (reports) {
  let i = 0

  const dom = new Set()
  const response = []

  while (i < reports.length) {
    reports[i].bestPractices.DomainsNumber.domains.map(item => dom.add(item))
    i++
  }
  const array = Array.from(dom)
  const domainsNumberAverage = Math.round((array.length / i) * 100) / 100
  response.push(domainsNumberAverage)
  response.push(array)

  // compliance level
  let compliance
  if (domainsNumberAverage <= 2) {
    compliance = 'A'
  } else if (domainsNumberAverage <= 3) {
    compliance = 'B'
  } else if (domainsNumberAverage > 3) {
    compliance = 'C'
  } else {
    compliance = 'N.A'
  }

  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.dontResizeImageInBrowser = function (reports) {
  let i = 0
  const img = new Set()

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.DontResizeImageInBrowser.imgAnalysed.map(item => img.add(item))
    i++
  }

  const array = Array.from(img)
  const numberimageAnalyse = array.length
  response.push(numberimageAnalyse)
  response.push(array)

  // compliance level
  let compliance
  if (numberimageAnalyse === 0) {
    compliance = 'A'
  } else if (numberimageAnalyse > 0) {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.emptySrcTag = function (reports) {
  let i = 0
  let emptySrcTagNumber = 0

  const response = []
  while (i < reports.length) {
    if (reports[i].bestPractices.EmptySrcTag.emptySrcTagNumber >= 0 && reports[i].bestPractices.EmptySrcTag.emptySrcTagNumber !== 'N.A' && reports[i].bestPractices.EmptySrcTag.emptySrcTagNumber !== undefined) {
      emptySrcTagNumber = emptySrcTagNumber + reports[i].bestPractices.EmptySrcTag.emptySrcTagNumber
    }
    i++
  }
  response.push(emptySrcTagNumber)
  response.push([])
  // compliance level
  let compliance
  if (emptySrcTagNumber === 0) {
    compliance = 'A'
  } else if (emptySrcTagNumber > 0) {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.externalizeCss = function (reports) {
  let i = 0

  let inlineStyleSheetsNumber = 0

  const response = []
  while (i < reports.length) {
    if (reports[i].bestPractices.ExternalizeCss.inlineStyleSheetsNumber >= 0 && reports[i].bestPractices.ExternalizeCss.inlineStyleSheetsNumber !== 'N.A' && reports[i].bestPractices.ExternalizeCss.inlineStyleSheetsNumber !== undefined) {
      inlineStyleSheetsNumber = inlineStyleSheetsNumber + reports[i].bestPractices.ExternalizeCss.inlineStyleSheetsNumber
    }
    i++
  }
  response.push(inlineStyleSheetsNumber)
  response.push([])

  // compliance level
  let compliance
  if (inlineStyleSheetsNumber === 0) {
    compliance = 'A'
  } else if (inlineStyleSheetsNumber > 0) {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.externalizeJs = function (reports) {
  let i = 0

  let inlineJsScriptsNumber = 0

  const response = []
  while (i < reports.length) {
    if (reports[i].bestPractices.ExternalizeJs.inlineJsScriptsNumber >= 0 && reports[i].bestPractices.ExternalizeJs.inlineJsScriptsNumber !== 'N.A' && reports[i].bestPractices.ExternalizeJs.inlineJsScriptsNumber !== undefined) {
      inlineJsScriptsNumber = inlineJsScriptsNumber + reports[i].bestPractices.ExternalizeJs.inlineJsScriptsNumber
    }
    i++
  }
  response.push(inlineJsScriptsNumber)
  response.push([])

  // compliance level
  let compliance
  if (inlineJsScriptsNumber === 0) {
    compliance = 'A'
  } else if (inlineJsScriptsNumber > 0) {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.httpError = function (reports) {
  let i = 0
  const err = new Set()
  let errorNumber = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.HttpError.errors.map(item => err.add(item))
    i++
  }

  const array = Array.from(err)
  errorNumber = array.length
  response.push(errorNumber)
  response.push(array)

  // compliance level
  let compliance
  if (errorNumber === 0) {
    compliance = 'A'
  } else if (errorNumber > 0) {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.httpRequests = function (reports) {
  let i = 0
  const requests = new Set()
  let averageNumberOfRequest = 0
  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.HttpRequests.requests.map(item =>
      requests.add(item))
    i++
  }
  const array = Array.from(requests)
  averageNumberOfRequest = Math.ceil(array.length / reports.length)
  response.push(averageNumberOfRequest)
  response.push(array)

  // compliance level
  let compliance
  if (averageNumberOfRequest > 40) {
    compliance = 'C'
  } else if (averageNumberOfRequest > 26) {
    compliance = 'B'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.imageDownloadedNotDisplayed = function (reports) {
  let i = 0

  const img = new Set()
  let imageDownloadedNotDisplayedNumber = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.ImageDownloadedNotDisplayed.imgAnalysed.map(item => img.add(item))
    i++
  }

  const array = Array.from(img)
  imageDownloadedNotDisplayedNumber = array.length
  response.push(imageDownloadedNotDisplayedNumber)
  response.push(array)
  // compliance level
  let compliance
  if (imageDownloadedNotDisplayedNumber === 0) {
    compliance = 'A'
  } else if (imageDownloadedNotDisplayedNumber > 0) {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.jsValidate = function (reports) {
  let i = 0

  const contents = []
  let errors = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.JsValidate.contents.map(item => contents.push(item))

    if (reports[i].bestPractices.JsValidate.errors >= 0 && reports[i].bestPractices.JsValidate.errors !== 'N.A' && reports[i].bestPractices.JsValidate.errors !== undefined) {
      errors = errors + reports[i].bestPractices.JsValidate.errors
    }
    i++
  }
  response.push(errors)
  response.push(contents)

  // compliance level
  let compliance
  if (errors === 0) {
    compliance = 'A'
  } else if (errors > 0) {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.maxCookiesLength = function (reports) {
  let i = 0

  const domains = new Map()
  let maxCookiesLength = 0
  let j
  const response = []
  while (i < reports.length) {
    j = 0
    while (j < reports[i].bestPractices.MaxCookiesLength.domains.length) {
      const word = reports[i].bestPractices.MaxCookiesLength.domains[j].split(' ')
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
    if (reports[i].bestPractices.MaxCookiesLength.maxCookiesLength > maxCookiesLength) {
      maxCookiesLength = reports[i].bestPractices.MaxCookiesLength.maxCookiesLength
    }
    i++
  }

  const tab = Array.from(domains)
  let str
  const res = []
  i = 0
  while (i < tab.length) {
    str = tab[i][0] + ' ' + tab[i][1]
    res.push(str)
    i++
  }
  response.push(maxCookiesLength)
  response.push(res)

  // compliance level
  let compliance
  if (maxCookiesLength === 0) {
    compliance = 'N.A'
  } else if (maxCookiesLength > 1024) {
    compliance = 'C'
  } else if (maxCookiesLength > 512) {
    compliance = 'B'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.minifiedCss = function (reports) {
  let i = 0

  let totalCssSize = 0
  let minifiedCssSize = 0
  let percentMinifiedCss = 0
  const contents = []

  const response = []

  while (i < reports.length) {
    reports[i].bestPractices.MinifiedCss.contents.map(item => contents.push(item))
    if (reports[i].bestPractices.MinifiedCss.totalCssSize >= 0 && reports[i].bestPractices.MinifiedCss.totalCssSize !== 'N.A' && reports[i].bestPractices.MinifiedCss.totalCssSize !== undefined) {
      totalCssSize = totalCssSize + reports[i].bestPractices.MinifiedCss.totalCssSize
    }
    if (reports[i].bestPractices.MinifiedCss.minifiedCssSize >= 0 && reports[i].bestPractices.MinifiedCss.minifiedCssSize !== 'N.A' && reports[i].bestPractices.MinifiedCss.minifiedCssSize !== undefined) {
      minifiedCssSize = minifiedCssSize + reports[i].bestPractices.MinifiedCss.minifiedCssSize
    }
    i++
  }
  if (totalCssSize === 0) {
    percentMinifiedCss = 'N.A'
  } else {
    percentMinifiedCss = Math.round((minifiedCssSize / totalCssSize * 100) * 100) / 100
  }
  response.push(percentMinifiedCss)
  response.push(contents)
  // compliance level
  let compliance
  if (percentMinifiedCss > 95) {
    compliance = 'A'
  } else if (percentMinifiedCss > 90) {
    compliance = 'B'
  } else if (percentMinifiedCss > 0) {
    compliance = 'C'
  } else {
    compliance = 'N.A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.minifiedJs = function (reports) {
  let i = 0

  let totalJsSize = 0
  let minifiedJsSize = 0
  let percentMinifiedJs = 0
  const contents = []
  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.MinifiedJs.contents.map(item => contents.push(item))
    if (reports[i].bestPractices.MinifiedJs.totalJsSize >= 0 && reports[i].bestPractices.MinifiedJs.totalJsSize !== 'N.A' && reports[i].bestPractices.MinifiedJs.totalJsSize !== undefined) {
      totalJsSize = totalJsSize + reports[i].bestPractices.MinifiedJs.totalJsSize
    }
    if (reports[i].bestPractices.MinifiedJs.minifiedJsSize >= 0 && reports[i].bestPractices.MinifiedJs.minifiedJsSize !== 'N.A' && reports[i].bestPractices.MinifiedJs.minifiedJsSize !== undefined) {
      minifiedJsSize = minifiedJsSize + reports[i].bestPractices.MinifiedJs.minifiedJsSize
    }
    i++
  }
  if (totalJsSize === 0) {
    percentMinifiedJs = 'N.A'
  } else {
    percentMinifiedJs = Math.round((minifiedJsSize / totalJsSize * 100) * 100) / 100
  }
  response.push(percentMinifiedJs)
  response.push(contents)
  // compliance level
  let compliance
  if (percentMinifiedJs > 95) {
    compliance = 'A'
  } else if (percentMinifiedJs > 90) {
    compliance = 'B'
  } else if (percentMinifiedJs > 0) {
    compliance = 'C'
  } else {
    compliance = 'N.A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.noCookieForStaticRessources = function (reports) {
  let i = 0
  let count2 = 0

  const cookiesTab = new Set()
  let totalCookiesSize = 0

  const response = []

  while (i < reports.length) {
    reports[i].bestPractices.NoCookieForStaticRessources.cookies.map(item => cookiesTab.add(item))
    if (reports[i].bestPractices.NoCookieForStaticRessources.totalCookiesSize >= 0 && reports[i].bestPractices.NoCookieForStaticRessources.totalCookiesSize !== 'N.A' && reports[i].bestPractices.NoCookieForStaticRessources.totalCookiesSize !== undefined) {
      totalCookiesSize = totalCookiesSize + reports[i].bestPractices.NoCookieForStaticRessources.totalCookiesSize
      count2++
    }
    i++
  }
  if (count2 === 0) {
    totalCookiesSize = 0
  } else {
    totalCookiesSize = totalCookiesSize / count2
  }
  response.push(totalCookiesSize)
  const array = Array.from(cookiesTab)
  response.push(array)

  // compliance level
  let compliance
  if (totalCookiesSize > 2000) {
    compliance = 'C'
  } else if (totalCookiesSize > 0) {
    compliance = 'B'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.noRedirect = function (reports) {
  let i = 0
  const red = new Set()
  let redirectNumber = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.NoRedirect.redirections.map(item => red.add(item))
    i++
  }

  const array = Array.from(red)
  redirectNumber = array.length
  response.push(redirectNumber)
  response.push(array)

  // compliance level
  let compliance
  if (redirectNumber > 0) {
    compliance = 'C'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.optimizeBitmapImages = function (reports) {
  let i = 0
  let count2 = 0

  const image = new Set()
  let totalMinGains = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.OptimizeBitmapImages.img.map(item => image.add(item))
    if (reports[i].bestPractices.OptimizeBitmapImages.totalMinGains >= 0 && reports[i].bestPractices.OptimizeBitmapImages.totalMinGains !== 'N.A' && reports[i].bestPractices.OptimizeBitmapImages.totalMinGains !== undefined) {
      count2++
      totalMinGains = totalMinGains + reports[i].bestPractices.OptimizeBitmapImages.totalMinGains
    }
    i++
  }
  response.push(totalMinGains)
  const array = Array.from(image)
  response.push(array)

  if (count2 === 0) {
    totalMinGains = 0
  } else {
    totalMinGains = totalMinGains / count2
  }
  // compliance level
  let compliance
  if (totalMinGains > 50000) {
    compliance = 'C'
  } else if (totalMinGains > 0) {
    compliance = 'B'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.optimizeSvg = function (reports) {
  let i = 0
  let count1 = 0

  const image = new Set()
  let totalSizeToOptimize = 0
  const response = []

  while (i < reports.length) {
    reports[i].bestPractices.OptimizeSvg.img.map(item => image.add(item))
    if (reports[i].bestPractices.OptimizeSvg.totalSizeToOptimize >= 0 && reports[i].bestPractices.OptimizeSvg.totalSizeToOptimize !== 'N.A' && reports[i].bestPractices.OptimizeSvg.totalSizeToOptimize !== undefined) {
      count1++
      totalSizeToOptimize = totalSizeToOptimize + reports[i].bestPractices.OptimizeSvg.totalSizeToOptimize
    }
    i++
  }
  response.push(totalSizeToOptimize)
  const array = Array.from(image)
  response.push(array)

  // compliance level
  if (count1 === 0) {
    totalSizeToOptimize = 0
  } else {
    totalSizeToOptimize = totalSizeToOptimize / count1
  }
  let compliance
  if (totalSizeToOptimize > 20000) {
    compliance = 'C'
  } else if (totalSizeToOptimize > 0) {
    compliance = 'B'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.plugins = function (reports) {
  let i = 0
  let pluginsNumber = 0

  const response = []
  while (i < reports.length) {
    if (reports[i].bestPractices.Plugins.pluginsNumber >= 0 && reports[i].bestPractices.Plugins.pluginsNumber !== 'N.A' && reports[i].bestPractices.Plugins.pluginsNumber !== undefined) {
      pluginsNumber = pluginsNumber + reports[i].bestPractices.Plugins.pluginsNumber
    }
    i++
  }
  response.push(pluginsNumber)
  response.push([])

  // compliance level
  let compliance
  if (pluginsNumber > 0) {
    compliance = 'C'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.printStyleSheet = function (reports) {
  let i = 0
  let printStyleSheetsNumber = 0

  const response = []
  let compliance = 'A'
  while (i < reports.length) {
    if (reports[i].bestPractices.PrintStyleSheet.printStyleSheetsNumber !== undefined && reports[i].bestPractices.PrintStyleSheet.printStyleSheetsNumber !== 'N.A' && reports[i].bestPractices.PrintStyleSheet.printStyleSheetsNumber > 0) {
      printStyleSheetsNumber = printStyleSheetsNumber + reports[i].bestPractices.PrintStyleSheet.printStyleSheetsNumber
    } else {
      compliance = 'C'
    }
    i++
  }
  response.push(printStyleSheetsNumber)
  response.push([])
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.socialNetworkButton = function (reports) {
  let i = 0
  const socialTab = new Set()
  let nbSocialNetworkButton = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.SocialNetworkButton.socialNetworks.map(item => socialTab.add(item))
    i++
  }

  const array = Array.from(socialTab)
  nbSocialNetworkButton = array.length
  response.push(nbSocialNetworkButton)
  response.push(array)
  // compliance level
  let compliance
  if (nbSocialNetworkButton > 0) {
    compliance = 'C'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.styleSheets = function (reports) {
  let i = 0
  let count = 0

  const styleSheetsTab = new Set()
  let styleSheetsNumber = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.StyleSheets.styleSheets.map(item => styleSheetsTab.add(item))
    if (reports[i].bestPractices.StyleSheets.styleSheetsNumber >= 0 && reports[i].bestPractices.StyleSheets.styleSheetsNumber !== 'N.A' && reports[i].bestPractices.StyleSheets.styleSheetsNumber !== undefined) {
      count++
    }
    i++
  }

  const array = Array.from(styleSheetsTab)
  styleSheetsNumber = array.length
  response.push(styleSheetsNumber)
  response.push(array)

  // compliance level
  if (count === 0) {
    styleSheetsNumber = 0
  } else {
    styleSheetsNumber = styleSheetsNumber / count
  }
  let compliance
  if (styleSheetsNumber > 3) {
    compliance = 'C'
  } else if (styleSheetsNumber === 3) {
    compliance = 'B'
  } else {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.useETags = function (reports) {
  let i = 0
  let count1 = 0
  const tab = new Set()
  let eTagsRatio = 0

  const response = []

  while (i < reports.length) {
    reports[i].bestPractices.UseETags.eTags.map(item => tab.add(item))
    if (reports[i].bestPractices.UseETags.eTagsRatio >= 0 && reports[i].bestPractices.UseETags.eTagsRatio !== 'N.A' && reports[i].bestPractices.UseETags.eTagsRatio !== undefined) {
      count1++
      eTagsRatio = eTagsRatio + reports[i].bestPractices.UseETags.eTagsRatio
    }
    i++
  }
  if (count1 === 0) {
    eTagsRatio = 'N.A'
  } else if (eTagsRatio !== 0) {
    eTagsRatio = Math.round((eTagsRatio / count1) * 100) / 100
  }
  response.push(eTagsRatio)
  const array = Array.from(tab)
  response.push(array)

  // compliance level
  let compliance
  if (eTagsRatio === 'N.A') {
    compliance = 'N.A'
  } else if (eTagsRatio > 95) {
    compliance = 'A'
  } else if (eTagsRatio > 90) {
    compliance = 'B'
  } else {
    compliance = 'C'
  }
  response.push(compliance)
  return response
}

FormatGreenItBestPractices.prototype.useStandardTypefaces = function (reports) {
  let i = 0
  const tab = new Set()
  let totalFontsSize = 0

  const response = []
  while (i < reports.length) {
    reports[i].bestPractices.UseStandardTypefaces.fonts.map(item => tab.add(item))
    if (reports[i].bestPractices.UseStandardTypefaces.totalFontsSize >= 0 && reports[i].bestPractices.UseStandardTypefaces.totalFontsSize !== 'N.A' && reports[i].bestPractices.UseStandardTypefaces.totalFontsSize !== undefined) {
      totalFontsSize = totalFontsSize + reports[i].bestPractices.UseStandardTypefaces.totalFontsSize
    }
    i++
  }
  response.push(Math.trunc(totalFontsSize / 1000))
  const array = Array.from(tab)
  response.push(array)
  // compliance level
  let compliance
  if (totalFontsSize > 10000) {
    compliance = 'C'
  } else if (totalFontsSize > 0) {
    compliance = 'B'
  } else if (totalFontsSize === 0) {
    compliance = 'A'
  }
  response.push(compliance)
  return response
}

const formatGreenItBestPractices = new FormatGreenItBestPractices()
module.exports = formatGreenItBestPractices


const formatGreenItBestPractices = require('./formatGreenItBestPractices')
const formatBestPracticesForProject = require('../format/formatBestPracticesForProject')

class FormatGreenItReports {}

FormatGreenItReports.prototype.returnFormattedGreenIt = function (reports) {
  const greenItBestPractices = {
    addExpiresOrCacheControlHeaders: formatGreenItBestPractices.addExpiresOrCacheControlHeaders(reports),
    compressHttp: formatGreenItBestPractices.compressHttp(reports),
    domainsNumber: formatGreenItBestPractices.domainsNumber(reports),
    dontResizeImageInBrowser: formatGreenItBestPractices.dontResizeImageInBrowser(reports),
    emptySrcTag: formatGreenItBestPractices.emptySrcTag(reports),
    externalizeCss: formatGreenItBestPractices.externalizeCss(reports),
    externalizeJs: formatGreenItBestPractices.externalizeJs(reports),
    httpError: formatGreenItBestPractices.httpError(reports),
    httpRequests: formatGreenItBestPractices.httpRequests(reports),
    imageDownloadedNotDisplayed: formatGreenItBestPractices.imageDownloadedNotDisplayed(reports),
    jsValidate: formatGreenItBestPractices.jsValidate(reports),
    maxCookiesLength: formatGreenItBestPractices.maxCookiesLength(reports),
    minifiedCss: formatGreenItBestPractices.minifiedCss(reports),
    minifiedJs: formatGreenItBestPractices.minifiedJs(reports),
    noCookieForStaticRessources: formatGreenItBestPractices.noCookieForStaticRessources(reports),
    noRedirect: formatGreenItBestPractices.noRedirect(reports),
    optimizeBitmapImages: formatGreenItBestPractices.optimizeBitmapImages(reports),
    optimizeSvg: formatGreenItBestPractices.optimizeSvg(reports),
    plugins: formatGreenItBestPractices.plugins(reports),
    printStyleSheet: formatGreenItBestPractices.printStyleSheet(reports),
    socialNetworkButton: formatGreenItBestPractices.socialNetworkButton(reports),
    styleSheets: formatGreenItBestPractices.styleSheets(reports),
    useETags: formatGreenItBestPractices.useETags(reports),
    useStandardTypefaces: formatGreenItBestPractices.useStandardTypefaces(reports)
  }

  Object.keys(greenItBestPractices).forEach(function (k) {
    greenItBestPractices[k].tool = 'GreenIT-Analysis'
  })

  return formatBestPracticesForProject.sortByScore(greenItBestPractices)
}
const formatGreenItReports = new FormatGreenItReports()
module.exports = formatGreenItReports

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/*
 *  Copyright (C) 2019  didierfred@gmail.com
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let currentRulesChecker
let lastAnalyseStartingTime = 0
let measuresAcquisition
let har
let resources
let scoreCalculated

function computeEcoIndexMeasures (measures) {
  measures.ecoIndex = computeEcoIndex(measures.domSize, measures.nbRequest, Math.round(measures.responsesSize / 1000))
  measures.grade = getEcoIndexGrade(measures.ecoIndex)
}

async function launchAnalyse () {
  const now = Date.now()

  // To avoid parallel analyse , force 1 secondes between analysis
  if (now - lastAnalyseStartingTime < 1000) {
    debug(() => 'Ignore click')
    return
  }
  lastAnalyseStartingTime = now
  currentRulesChecker = rulesManager.getNewRulesChecker()
  measuresAcquisition = new MeasuresAcquisition(currentRulesChecker)
  measuresAcquisition.initializeMeasures()
  measuresAcquisition.aggregateFrameMeasures(startAnalyseCore())
  measuresAcquisition.startMeasuring()
  await scoreCalculated

  const returnObj = measuresAcquisition.getMeasures()
  const bestPractices = measuresAcquisition.getBestPractices()
  returnObj.bestPractices = formatBestPractices(bestPractices)
  const { dataEntries, emptySrcTagNumber, entries, imagesResizedInBrowser, inlineJsScriptsNumber, inlineStyleSheetsNumber, pluginsNumber, printStyleSheetsNumber, url, ...reducedReturnObj } = returnObj
  return reducedReturnObj
}

function MeasuresAcquisition (rules) {
  let measures
  const localRulesChecker = rules
  let nbGetHarTry = 0

  this.initializeMeasures = () => {
    measures = {
      url: '',
      domSize: 0,
      nbRequest: 0,
      responsesSize: 0,
      responsesSizeUncompress: 0,
      ecoIndex: 100,
      grade: 'A',
      pluginsNumber: 0,
      printStyleSheetsNumber: 0,
      inlineStyleSheetsNumber: 0,
      emptySrcTagNumber: 0,
      inlineJsScriptsNumber: 0,
      imagesResizedInBrowser: []
    }
  }

  this.startMeasuring = function () {
    getNetworkMeasure()
    getResourcesMeasure()
  }

  this.getMeasures = () => measures

  this.getBestPractices = () => Object.fromEntries(localRulesChecker.getAllRules())

  this.aggregateFrameMeasures = function (frameMeasures) {
    measures.domSize += frameMeasures.domSize
    computeEcoIndexMeasures(measures)

    measures.pluginsNumber += frameMeasures.pluginsNumber

    measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber
    if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber
    measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber
    if (frameMeasures.inlineJsScript.length > 0) {
      const resourceContent = {
        url: 'inline js',
        type: 'script',
        content: frameMeasures.inlineJsScript
      }
      localRulesChecker.sendEvent('resourceContentReceived', measures, resourceContent)
    }
    if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber

    measures.imagesResizedInBrowser = frameMeasures.imagesResizedInBrowser

    localRulesChecker.sendEvent('frameMeasuresReceived', measures)
  }

  const getNetworkMeasure = () => {
    console.log('Start network measure...')
    // only account for network traffic, filtering resources embedded through data urls
    const entries = har.entries.filter(entry => isNetworkResource(entry))

    // Get the "mother" url
    if (entries.length > 0) measures.url = entries[0].request.url
    else {
      // Bug with firefox  when we first get har.entries when starting the plugin , we need to ask again to have it
      if (nbGetHarTry < 1) {
        debug(() => 'No entries, try again to get HAR in 1s')
        nbGetHarTry++
        setTimeout(getNetworkMeasure, 1000)
      }
    }

    measures.entries = entries
    measures.dataEntries = har.entries.filter(entry => isDataResource(entry)) // embeded data urls

    if (entries.length) {
      measures.nbRequest = entries.length
      entries.forEach(entry => {
        // If chromium :
        // _transferSize represent the real data volume transfert
        // while content.size represent the size of the page which is uncompress
        if (entry.response._transferSize) {
          measures.responsesSize += entry.response._transferSize
          measures.responsesSizeUncompress += entry.response.content.size
        } else {
          // In firefox , entry.response.content.size can sometimes be undefined
          if (entry.response.content.size) measures.responsesSize += entry.response.content.size
        }
      })
      localRulesChecker.sendEvent('harReceived', measures)

      computeEcoIndexMeasures(measures)
    }
  }

  function getResourcesMeasure () {
    resources.forEach(resource => {
      if (resource.url.startsWith('file') || resource.url.startsWith('http')) {
        if ((resource.type.toUpperCase() === 'SCRIPT') || (resource.type.toUpperCase() === 'STYLESHEET') || (resource.type.toUpperCase() === 'IMAGE')) {
          const resourceAnalyser = new ResourceAnalyser(resource)
          resourceAnalyser.analyseContent(resource)
        }
      }
    })
  }

  function ResourceAnalyser (resource) {
    const resourceToAnalyse = resource

    this.analyseContent = (code) => {
      // exclude from analyse the injected script
      if ((resourceToAnalyse.type.toUpperCase() === 'SCRIPT') && (resourceToAnalyse.url.includes('script/analyseFrame.js'))) return

      const resourceContent = {
        url: resourceToAnalyse.url,
        type: resourceToAnalyse.type,
        content: code.content
      }
      localRulesChecker.sendEvent('resourceContentReceived', measures, resourceContent)
    }
  }
}

function formatBestPractices (bestPractices) {
  if (bestPractices.AddExpiresOrCacheControlHeaders.requests) {
    const requestsFormatted = bestPractices.AddExpiresOrCacheControlHeaders.requests.split('|')
    requestsFormatted.pop()
    bestPractices.AddExpiresOrCacheControlHeaders.requests = requestsFormatted
  }
  if (bestPractices.CompressHttp.requests) {
    const requestsFormatted = bestPractices.CompressHttp.requests.split('|')
    requestsFormatted.pop()
    bestPractices.CompressHttp.requests = requestsFormatted
  }
  if (bestPractices.DomainsNumber.domains) {
    const domainsFormatted = bestPractices.DomainsNumber.domains.split('|')
    domainsFormatted.pop()
    bestPractices.DomainsNumber.domains = domainsFormatted
  }
  if (bestPractices.DontResizeImageInBrowser.imgAnalysed) {
    const imgAnalysedFormatted = bestPractices.DontResizeImageInBrowser.imgAnalysed.split('|')
    imgAnalysedFormatted.pop()
    bestPractices.DontResizeImageInBrowser.imgAnalysed = imgAnalysedFormatted
  }
  if (bestPractices.HttpError.errors) {
    const errorsFormatted = bestPractices.HttpError.errors.split('|')
    errorsFormatted.pop()
    bestPractices.HttpError.errors = errorsFormatted
  }
  if (bestPractices.HttpRequests.requests) {
    const requestsFormatted = bestPractices.HttpRequests.requests.split('|')
    requestsFormatted.pop()
    bestPractices.HttpRequests.requests = requestsFormatted
  }
  if (bestPractices.ImageDownloadedNotDisplayed.imgAnalysed) {
    const imgAnalysedFormatted = bestPractices.ImageDownloadedNotDisplayed.imgAnalysed.split('|')
    imgAnalysedFormatted.pop()
    bestPractices.ImageDownloadedNotDisplayed.imgAnalysed = imgAnalysedFormatted
  }
  if (bestPractices.JsValidate.contents) {
    const contentsFormatted = bestPractices.JsValidate.contents.split('|')
    contentsFormatted.pop()
    bestPractices.JsValidate.contents = contentsFormatted
  }
  if (bestPractices.MaxCookiesLength.domains) {
    const domainsFormatted = bestPractices.MaxCookiesLength.domains.split('|')
    domainsFormatted.pop()
    bestPractices.MaxCookiesLength.domains = domainsFormatted
  }
  if (bestPractices.NoCookieForStaticRessources.cookies) {
    const cookiesFormatted = bestPractices.NoCookieForStaticRessources.cookies.split('|')
    cookiesFormatted.pop()
    bestPractices.NoCookieForStaticRessources.cookies = cookiesFormatted
  }
  if (bestPractices.NoRedirect.redirections) {
    const redirectionsFormatted = bestPractices.NoRedirect.redirections.split('|')
    redirectionsFormatted.pop()
    bestPractices.NoRedirect.redirections = redirectionsFormatted
  }
  if (bestPractices.OptimizeBitmapImages.img) {
    const imgFormatted = bestPractices.OptimizeBitmapImages.img.split('|')
    imgFormatted.pop()
    bestPractices.OptimizeBitmapImages.img = imgFormatted
  }
  if (bestPractices.OptimizeSvg.img) {
    const imgFormatted = bestPractices.OptimizeSvg.img.split('|')
    imgFormatted.pop()
    bestPractices.OptimizeSvg.img = imgFormatted
  }
  if (bestPractices.SocialNetworkButton.socialNetworks) {
    const socialNetworksFormatted = bestPractices.SocialNetworkButton.socialNetworks.split('|')
    socialNetworksFormatted.pop()
    bestPractices.SocialNetworkButton.socialNetworks = socialNetworksFormatted
  }
  if (bestPractices.StyleSheets.styleSheets) {
    const styleSheetsFormatted = bestPractices.StyleSheets.styleSheets.split('|')
    styleSheetsFormatted.pop()
    bestPractices.StyleSheets.styleSheets = styleSheetsFormatted
  }
  if (bestPractices.UseETags.eTags) {
    const eTagsFormatted = bestPractices.UseETags.eTags.split('|')
    eTagsFormatted.pop()
    bestPractices.UseETags.eTags = eTagsFormatted
  }
  if (bestPractices.UseStandardTypefaces.fonts) {
    const fontsFormatted = bestPractices.UseStandardTypefaces.fonts.split('|')
    fontsFormatted.pop()
    bestPractices.UseStandardTypefaces.fonts = fontsFormatted
  }
  if (bestPractices.MinifiedCss.contents) {
    const contentsFormatted = bestPractices.MinifiedCss.contents.split('|')
    contentsFormatted.pop()
    bestPractices.MinifiedCss.contents = contentsFormatted
  }
  if (bestPractices.MinifiedJs.contents) {
    const contentsFormatted = bestPractices.MinifiedJs.contents.split('|')
    contentsFormatted.pop()
    bestPractices.MinifiedJs.contents = contentsFormatted
  }
  return bestPractices
}

const lighthouse = require('lighthouse')
const config = require('./config.js')
const puppeteer = require('puppeteer')
const authenticationService = require('../authenticationService')
const userJourneyService = require('../userJourneyService')
const viewPortParams = require('../../utils/viewportParams')

module.exports = {
  lighthouseAnalysis: async function (urlList, projectName) {
    const browserArgsDesktop = [
      '--no-sandbox', // can't run inside docker without
      '--disable-setuid-sandbox', // but security issues
      '--ignore-certificate-errors',
      '--window-size=1920,1080',
      '--start-maximized'
    ]
    const configDesktop = { ...config }
    const results = await lighthouseAnalysisWithSpecifiedConfig(urlList, projectName, browserArgsDesktop, configDesktop)
    const browserArgsMobile = [
      '--no-sandbox', // can't run inside docker without
      '--disable-setuid-sandbox', // but security issues
      '--ignore-certificate-errors',
      '--window-size=430,932',
      '--start-maximized'
    ]
    const configMobile = { ...config }
    configMobile.screenEmulation.width = 430
    configMobile.screenEmulation.height = 932

    const resultsMobile = await lighthouseAnalysisWithSpecifiedConfig(urlList, projectName, browserArgsMobile, configMobile)
    results.forEach((result) => {
      const currentResultMobile = resultsMobile.find((resultMobile) => result.url === resultMobile.url)
      if (currentResultMobile) {
        result.mobile = currentResultMobile
      }
    })
    return results
  }
}

async function lighthouseAnalysisWithSpecifiedConfig (urlList, projectName, browserArgs, config) {


  const proxyConfiguration = await authenticationService.useProxyIfNeeded(projectName)
  if (proxyConfiguration) {
    browserArgs.push(proxyConfiguration)
  }

  // start browser
  const browser = await puppeteer.launch({
    headless: true,
    args: browserArgs,
    ignoreHTTPSErrors: true,
    // Keep gpu horsepower in headless
    ignoreDefaultArgs: [
      '--disable-gpu'
    ],
    defaultViewport: viewPortParams.viewPortParams
  })

  const results = []
  const options = { logLevel: 'error', output: 'json', onlyCategories: ['performance', 'accessibility'], port: (new URL(browser.wsEndpoint())).port, disableStorageReset: true }

  try {
    let lighthouseResults
    let userJourney
    const loginSucceeded = await authenticationService.loginIfNeeded(browser, projectName)
    if (loginSucceeded) {
      for (const [index, url] of urlList.entries()) {
        try {
          console.log('Lighthouse Analysis launched for url ' + url)
          await userJourneyService.getUserFlow(projectName, url)
              .then((userflow) => {
                userJourney = userflow
              }).catch((error) => {
                console.log(error.message)
              })
          if (userJourney) {
            lighthouseResults = await userJourneyService.playUserFlowLighthouse(url, browser, userJourney)
          } else {
            lighthouseResults = await lighthouse(url, options, config)
          }
          console.log('Lighthouse Analysis ended for url ' + url)
          results[index] = { ...lighthouseResults.lhr, url }
        } catch (error) {
          console.log('LIGHTHOUSE ANALYSIS - An error occured when auditing ' + url)
          console.error('\x1b[31m%s\x1b[0m', error)
        }
      }
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error)
  } finally {
    await browser.close()
  }
  return results
}
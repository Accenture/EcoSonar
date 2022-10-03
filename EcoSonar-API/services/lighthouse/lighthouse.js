const lighthouse = require('lighthouse')
const config = require('./config.js')
const puppeteer = require('puppeteer')
const authenticationService = require('../authenticationService')
const userJourneyService = require('../userJourneyService')

module.exports = {
  lighthouseAnalysis: async function (urlList, projectName) {
    const browserArgs = [
      '--no-sandbox', // can't run inside docker without
      '--disable-setuid-sandbox', // but security issues
      '--ignore-certificate-errors'
    ]

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
      ]
    })

    const results = []
    try {
      const options = { logLevel: 'error', output: 'json', onlyCategories: ['performance', 'accessibility'], port: (new URL(browser.wsEndpoint())).port }
      let i = 0
      let runnerResult
      const loginSucceeded = await authenticationService.loginIfNeeded(browser)
      if (loginSucceeded) {
        while (i < urlList.length) {
          await userJourneyService.playUserJourney(urlList[i], browser)
          console.log('Lighthouse Analysis launched for url ' + urlList[i])
          runnerResult = await lighthouse(urlList[i], options, config)
          console.log('Lighthouse Analysis ended for url ' + urlList[i])
          results[i] = runnerResult.lhr
          i++
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
    } finally {
      await browser.close()
    }
    return results
  }
}

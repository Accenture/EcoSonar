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
      '--ignore-certificate-errors',
      '--window-size=1920,1080',
      '--start-maximized'
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
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    })

    const results = []
    const options = { logLevel: 'error', output: 'json', onlyCategories: ['performance', 'accessibility'], port: (new URL(browser.wsEndpoint())).port, disableStorageReset: true }

    try {
      let lighthouseResults
      let userJourney
      const loginSucceeded = await authenticationService.loginIfNeeded(browser)
      if (loginSucceeded) {
        for (const [index, url] of urlList.entries()) {
          try {
            console.log('Lighthouse Analysis launched for url ' + url)
            await userJourneyService.getUserFlow(url)
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
            results[index] = lighthouseResults.lhr
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
}

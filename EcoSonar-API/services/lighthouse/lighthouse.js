import lighthouse from 'lighthouse'
import puppeteer from 'puppeteer'
import config from './config.js'
import authenticationService from '../authenticationService.js'
import userJourneyService from '../userJourneyService.js'
import viewPortParams from '../../utils/viewportParams.js'

export default async function lighthouseAnalysis (urlList, projectName, username, password) {
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
    headless: 'new',
    args: browserArgs,
    ignoreHTTPSErrors: true,
    // Keep gpu horsepower in headless
    ignoreDefaultArgs: [
      '--disable-gpu',
      '--enable-automation'
    ],
    defaultViewport: viewPortParams
  })

  const results = []

  try {
    let lighthouseResults
    let userJourney
    const loginSucceeded = await authenticationService.loginIfNeeded(browser, projectName, username, password)
    if (loginSucceeded) {
      for (const [index, url] of urlList.entries()) {
        const page = await browser.newPage() // prevent browser to close before ending all pages analysis
        try {
          console.log('Lighthouse Analysis launched for url ' + url)
          await userJourneyService.getUserFlow(projectName, url)
            .then((result) => {
              userJourney = result
            }).catch((error) => {
              console.log(error.message)
            })
          if (userJourney) {
            lighthouseResults = await userJourneyService.playUserFlowLighthouse(url, browser, userJourney)
          } else {
            // Wait for Lighthouse to open url, then inject our stylesheet.
            browser.on('targetchanged', async target => {
              if (page && page.url() === url) {
                await page.addStyleTag({ content: '* {color: red}' })
              }
            })
            lighthouseResults = await lighthouse(url, { disableStorageReset: true }, config, page)
          }
          console.log('Lighthouse Analysis ended for url ' + url)
          results[index] = { ...lighthouseResults.lhr, url }
        } catch (error) {
          console.error('LIGHTHOUSE ANALYSIS - An error occured when auditing ' + url)
          console.error('\x1b[31m%s\x1b[0m', error)
        }
      }
    } else {
      console.warn('Could not log in, audit for lighthouse analysis is skipped')
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error)
  } finally {
    await browser.close()
  }
  return results
}

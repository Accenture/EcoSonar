import validator from 'html-validator'
import puppeteer from 'puppeteer'
import authenticationService from '../authenticationService.js'
import loggerService from '../../loggers/traces.js'

class W3cAnalysis {}

/**
 * This function run the W3C Validator by calling the W3C API.
 * @param {Array} urlsList is a list of urls that needs to be analysed by W3C HTML Validator
 * @returns a list of HTML issues
 */
W3cAnalysis.prototype.w3cAnalysisWithAPI = async function (urlsList) {
  const reports = []

  for (const url of urlsList) {
    try {
      const options = {
        url
      }
      loggerService.info(`W3C ANALYSIS : launching analyse for ${url} `)
      const resultForUrl = await validator(options)
      if (resultForUrl.messages[0].type === 'non-document-error') {
        loggerService.error('\x1b[31m%s\x1b[0m', `W3C ANALYSIS : URL ${url} cannot be found`)
        loggerService.error('\x1b[31m%s\x1b[0m', `W3C ANALYSIS : ${url} has been removed from result `)
      } else {
        reports.push(resultForUrl)
        loggerService.info(`W3C ANALYSIS : Analyse ended for ${url} `)
      }
    } catch (error) {
      loggerService.error('\x1b[31m%s\x1b[0m', error)
    }
  }
  return reports
}

/**
 * This function run the W3C Validator locally by setting the validator to WHATWG. It needs no external connection to the W3C API.
 * NOT CONNECTED TO EXISTING ECOSONAR ANALYSIS
 * @param {Array} urlsList is a list of urls that needs to be analysed by W3C HTML Validator
 * @returns a list of HTML issues
 */
W3cAnalysis.prototype.w3cAnalysisLocal = async function (urlsList, projectName, username, password) {
  // Initializing variables
  const resultForUrlsList = []
  const htmlResults = []

  // Browser arguments
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

  // Starting the browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: browserArgs,
    ignoreHTTPSErrors: true,
    // Keep gpu horsepower in headless
    ignoreDefaultArgs: [
      '--disable-gpu'
    ]
  })

  try {
    // Extracting the HTML content of each url with pupeteer
    const loginSucceeded = await authenticationService.loginIfNeeded(browser, projectName, username, password)
    if (loginSucceeded) {
      // analyse each page

      for (const url of urlsList) {
        const page = await browser.newPage()
        await page.setCacheEnabled(false)
        // Set BypassCSP allow pupeteer to insert script inside the created page, without it CSP using pages would block the script used later in the function
        page.setBypassCSP(true)

        try {
          await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' })
          const html = await page.evaluate(() => document.querySelector('*').outerHTML)

          htmlResults.push({ url, html })
        } catch {
          loggerService.error('\x1b[31m%s\x1b[0m', `W3C ANALYSIS : An error happened on URL ${url}`)
          loggerService.error('\x1b[31m%s\x1b[0m', `W3C ANALYSIS : ${url} has been removed from result `)
        }
        await page.close()
      }

      // Analysing the HTML with W3C
      for (const htmlResult of htmlResults) {
        try {
          const options = {
            validator: 'WHATWG',
            data: htmlResult.html,
            isFragment: false
          }
          loggerService.info(`W3C ANALYSIS : launching analyse for ${htmlResult.url} `)
          const resultForHtml = await validator(options)
          resultForUrlsList.push(htmlResult.url, resultForHtml)
          loggerService.info(`W3C ANALYSIS : Analyse ended for ${htmlResult.url} `)
        } catch (error) {
          loggerService.error('\x1b[31m%s\x1b[0m', `W3C ANALYSIS : An error happened on URL ${htmlResult.url}`)
          loggerService.error(error)
        }
      }

      return resultForUrlsList
    } else {
      loggerService.warn('Could not log in, audit for w3c analysis is skipped')
    }
  } catch (error) {
    loggerService.error('\x1b[31m%s\x1b[0m', error)
  } finally {
  loggerService.info('Closing browser for w3cAnalysis');
    await browser.close()
  }
}
const w3cAnalysis = new W3cAnalysis()
export default w3cAnalysis

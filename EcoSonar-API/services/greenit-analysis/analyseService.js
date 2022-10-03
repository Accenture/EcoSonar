const puppeteer = require('puppeteer')
const createGreenITReports = require('./greenit-analysis.js').createGreenITReports
const authenticationService = require('../authenticationService')

async function analyse (urlList, autoscroll, projectName) {
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
    ]
  })

  let reports
  try {
    const loginSucceeded = await authenticationService.loginIfNeeded(browser)
    if (loginSucceeded) {
      // analyse each page
      reports = await createGreenITReports(browser, urlList, autoscroll)
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error)
  } finally {
    // close browser
    const pages = await browser.pages()
    await Promise.all(pages.map(function (page) {
      if (!page.isClosed()) {
        return page.close()
      } else {
        return Promise.resolve()
      }
    })).catch((error) => console.error('\x1b[31m%s\x1b[0m', error))
    await browser.close()
  }
  return reports
}

module.exports = {
  analyse
}

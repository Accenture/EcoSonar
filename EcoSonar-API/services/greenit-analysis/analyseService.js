const puppeteer = require('puppeteer')
const createGreenITReports = require('./greenit-analysis.js').createGreenITReports
const authenticationService = require('../authenticationService')

async function analyse (urlList, autoscroll) {
  const browserArgs = [
    '--no-sandbox', // can't run inside docker without
    '--disable-setuid-sandbox' // but security issues
  ]

  // start browser
  const browser = await puppeteer.launch({
    headless: true,
    args: browserArgs,
    // Keep gpu horsepower in headless
    ignoreDefaultArgs: [
      '--disable-gpu'
    ]
  })

  const loginSucceeded = await authenticationService.loginIfNeeded(browser)

  let reports
  try {
    if (loginSucceeded) {
      // analyse each page
      reports = await createGreenITReports(browser, urlList, autoscroll)
    }
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

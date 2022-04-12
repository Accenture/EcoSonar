const puppeteer = require('puppeteer')
const createGreenITReports = require('./greenit-analysis.js').createGreenITReports

async function analyse (urlList) {
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

  let reports
  try {
    // analyse each page
    reports = await createGreenITReports(browser, urlList)
  } finally {
    // close browser
    const pages = await browser.pages()
    await Promise.all(pages.map(function (page) {
      if (!page.isClosed()) {
        return page.close()
      } else {
        return Promise.resolve()
      }
    })).catch((error) => console.log(error))
    await browser.close()
  }
  return reports
}

module.exports = {
  analyse
}

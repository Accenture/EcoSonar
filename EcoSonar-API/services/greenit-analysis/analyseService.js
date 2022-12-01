const puppeteer = require('puppeteer')
const createGreenITReports = require('./greenit-analysis.js').createGreenITReports
const authenticationService = require('../authenticationService')

async function analyse (urlList, autoscroll, projectName) {
  let reports
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

  const userJourneyEnabled = process.env.ECOSONAR_ENV_USER_JOURNEY_ENABLED || 'false'
  if (userJourneyEnabled === 'true') {
    console.log('Your EcoSonar project is using user journey to audit your website, GreenIT analysis will be made into different Chromium browser for right cookies configuration')
    reports = await launchAllAnalysisOnDifferentBrowser(browserArgs, urlList, projectName, autoscroll)
  } else {
    console.log('Your EcoSonar project is not using user journey to audit your website, GreenIT analysis will be made into the same Chromium Browser')
    reports = await launchAllAnalysisOnSameBrowser(browserArgs, urlList, projectName, autoscroll)
  }
  return reports
}

async function launchAllAnalysisOnDifferentBrowser (browserArgs, urlList, projectName, autoscroll) {
  let reports = []
  let report
  for (const url of urlList) {
    // start browser
    const browser = await puppeteer.launch({
      headless: false,
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

    try {
      const loginSucceeded = await authenticationService.loginIfNeeded(browser, projectName)
      if (loginSucceeded) {
        // analyse each page
        report = await createGreenITReports(browser, [url], autoscroll)
        reports = reports.concat(report)
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error.message)
    } finally {
      // close browser
      const pages = await browser.pages()
      await Promise.all(pages.map(function (page) {
        if (!page.isClosed()) {
          return page.close()
        } else {
          return Promise.resolve()
        }
      })).catch((error) => console.error('\x1b[31m%s\x1b[0m', error.message))
      await browser.close()
    }
  }

  return reports
}

async function launchAllAnalysisOnSameBrowser (browserArgs, urlList, projectName, autoscroll) {
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

  let reports
  try {
    const loginSucceeded = await authenticationService.loginIfNeeded(browser, projectName)
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

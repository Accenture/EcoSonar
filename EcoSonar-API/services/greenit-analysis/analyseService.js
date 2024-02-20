const puppeteer = require('puppeteer')
const createGreenITReports = require('./greenit-analysis.js').createGreenITReports
const authenticationService = require('../authenticationService')
const viewPortParams = require('../../utils/viewportParams')

async function analyse (urlList, autoscroll, projectName) {
  let reports = []
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
      headless: true,
      args: browserArgs,
      ignoreHTTPSErrors: true,
      // Keep gpu horsepower in headless
      ignoreDefaultArgs: ['--disable-gpu'],
      defaultViewport: viewPortParams.viewPortParams
    })

    try {
      const loginSucceeded = await authenticationService.loginIfNeeded(browser, projectName)
      if (loginSucceeded) {
        report = await createGreenITReports(browser, projectName, [url], autoscroll)
        reports = reports.concat(report)
      } else {
        console.warn('Could not log in, audit for greenit-analysis is skipped')
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
    } finally {
      await closeBrowser(browser)
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
    ignoreDefaultArgs: ['--disable-gpu'],
    defaultViewport: viewPortParams.viewPortParams
  })

  let reports = []
  try {
    const loginSucceeded = await authenticationService.loginIfNeeded(browser, projectName)
    if (loginSucceeded) {
      // analyse each page
      reports = await createGreenITReports(browser, projectName, urlList, autoscroll)
    } else {
      console.warn('Could not log in, audit for greenit-analysis is skipped')
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error)
  } finally {
    await closeBrowser(browser)
  }
  return reports
}

async function closeBrowser (browser) {
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

module.exports = {
  analyse
}

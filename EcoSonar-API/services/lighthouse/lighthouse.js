const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const config = require('./config.js')

module.exports = {
  lighthouseAnalysis: async function (urlList) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--disable-dev-shm-usage', '--headless', '--disable-gpu', '--no-sandbox'] })
    const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance', 'accessibility'], port: chrome.port }
    let i = 0
    const results = []
    let runnerResult
    while (i < urlList.length) {
      console.log('Lighthouse Analysis launched for url ' + urlList[i])
      runnerResult = await lighthouse(urlList[i], options, config)
      console.log('Lighthouse Analysis ended for url ' + urlList[i])
      results[i] = runnerResult.lhr
      i++
    }
    await chrome.kill()
    return results
  }
}

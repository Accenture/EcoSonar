const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const authenticationService = require('../authenticationService')
const urlConfigurationService = require('../urlConfigurationService')

class CrawlerService {}

/**
 * VARIABLES
 */
let webSitePrefixWithoutProtocol
let webSitePrefixWithProtocol
let websiteProtocol
let alternativeProtocol
let seenUrls

/**
 *
 * @param {*} projectName the name of the project
 * @param {*} mainUrl the main url used to start crawling
 */
CrawlerService.prototype.crawl = async function (projectName, mainUrl) {
  let crawledUrls = []
  let projectUrls = []
  seenUrls = []

  const browserArgs = [
    '--no-sandbox', // can't run inside docker without
    '--disable-setuid-sandbox', // but security issues
    '--ignore-certificate-errors',
    '--window-size=1920,1080'
  ]

  const proxyConfiguration = await authenticationService.useProxyIfNeeded(projectName)
  if (proxyConfiguration) {
    browserArgs.push(proxyConfiguration)
  }

  // start browser and authenticate
  const browser = await puppeteer.launch({
    headless: true,
    args: browserArgs,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--disable-gpu']
  })

  try {
    getWebsiteProtocolAndPrefix(mainUrl)
    await authenticationService.loginIfNeeded(browser)
    await recursiveCrawl(mainUrl, browser, crawledUrls)
  } catch (error) {
    console.log(error)
  } finally { browser.close() }

  // Get all the URL already registered in the project to avoid crawling them again
  await urlConfigurationService.getAll(projectName)
    .then((result) => {
      projectUrls = result
    }).catch(() => {
      console.log(`CRAWLER - Project ${projectName} has 0 url`)
    })
  // Removing mainUrl and aliases from return list if already exist in the project
  if (projectUrls.includes(mainUrl) || projectUrls.includes(mainUrl + '/') || projectUrls.includes(mainUrl.slice(0, -1)) || crawledUrls.includes(mainUrl + '/')) {
    crawledUrls = crawledUrls.filter((url) => (url !== mainUrl))
  }

  // Remove URLS that are being crawler twice due to ending slash in it (www.myurl.com/ vs www.myurl.com)
  for (const crawledUrl of crawledUrls) {
    crawledUrls = crawledUrls.filter((url) => (url !== crawledUrl.slice(0, -1)))
  }

  crawledUrls = crawledUrls.filter((url) => (!projectUrls.includes(url) && !projectUrls.includes(url + '/') && !projectUrls.includes(url.slice(0, -1))))

  return crawledUrls
}

/**
 *
 * @param {string} url the main url used to start scrawling
 * This function extract the websiteProtocol (http or https) and the website name from the given entry URL
 */
function getWebsiteProtocolAndPrefix (url) {
  if (url.includes('http://')) {
    websiteProtocol = 'http://'
    alternativeProtocol = 'https://'
  }
  if (url.includes('https://')) {
    websiteProtocol = 'https://'
    alternativeProtocol = 'http'
  }

  const urlWithoutWebsiteProtocol = url.replace(websiteProtocol, '')

  if (urlWithoutWebsiteProtocol.endsWith('/')) {
    webSitePrefixWithoutProtocol = urlWithoutWebsiteProtocol.slice(0, urlWithoutWebsiteProtocol.indexOf('/'))
  } else if (urlWithoutWebsiteProtocol.includes('/')) {
    webSitePrefixWithoutProtocol = urlWithoutWebsiteProtocol.slice(0, urlWithoutWebsiteProtocol.indexOf('/'))
  } else {
    webSitePrefixWithoutProtocol = urlWithoutWebsiteProtocol
  }
  webSitePrefixWithProtocol = websiteProtocol + webSitePrefixWithoutProtocol
}

/**
   *
   * @param {string} url is the entry point to crawl, can be any URL
   * @returns a array of URL
   * Crawler extract every URL into the website, then crawl them recursively until every URL has already been seen.
   */
async function recursiveCrawl (url, browser, crawledUrls) {
  try {
    if (!seenUrls.includes(url)) {
      if (CrawlerService.prototype.checkUrl(url)) {
        // CRAWLING PAGE
        console.log('CRAWLING', url)
        seenUrls.push(url)

        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle0' })
        const html = await page.evaluate(() => document.querySelector('*').outerHTML)
        await page.close()
        crawledUrls.push(url)

        // GETTING HTML FROM PAGE
        const $ = cheerio.load(html)

        const links = $('a')
          .map((_i, link) => link.attribs.href)
          .get()

        for (const link of links) {
          const retrievedUrl = CrawlerService.prototype.getUrl(link)
          if (retrievedUrl) {
            await recursiveCrawl(retrievedUrl, browser, crawledUrls)
          }
        }
      }
    }
  } catch (error) {
    console.error(`CRAWLER - An error occured with ${url}, url is removed from the result`)
    console.log(error)
  }
}

/**
 *
 * @param {string} link any link found by the scrawler
 * @returns a formatted link
 * Avoid issue with relatives URL by formatting links to be crawled. Ex : given '/about' when crawling, function will construct an usable URL with websiteProtocol and websitePrefix to be : 'https://nameofthewebsite.com/about'
 */

CrawlerService.prototype.getUrl = function (link) {
  // Exclude links that are outside website
  if ((link.includes(websiteProtocol) || link.includes(alternativeProtocol)) && link.slice(0, webSitePrefixWithProtocol.length) !== webSitePrefixWithProtocol) {
    return undefined
  } else {
    // If the link is part of the website
    if (!link.includes(websiteProtocol) && !link.includes(webSitePrefixWithoutProtocol) && !link.startsWith('/')) {
      return `${websiteProtocol}${webSitePrefixWithoutProtocol}/${link}`
    } else if (!link.includes(websiteProtocol) && !link.includes(webSitePrefixWithoutProtocol) && link.startsWith('/')) {
      return `${websiteProtocol}${webSitePrefixWithoutProtocol}${link}`
    } else if (link.includes(websiteProtocol) && link.includes(webSitePrefixWithoutProtocol)) {
      return link
    } else {
      return undefined
    }
  }
}

/**
 *
 * @param {string} url to check
 * Exclude the url that return a file or a mailing redirection
 * @returns a boolean depending on the result of the check
 */
CrawlerService.prototype.checkUrl = function (url) {
  const invalidUrl = ['.csv', '.pdf', 'mailto:', '.jpg', '.jpeg', '.gif', '.docx', '.txt', '.bmp', '#']
  const result = invalidUrl.some((element) => url.includes(element))
  if (result) {
    console.warn(`CRAWLER - Can't crawl mail or file redirection : ${url}, url is removed from the result`)
    seenUrls.push(url)
    return false
  } else return true
}

const crawlerService = new CrawlerService()
module.exports = crawlerService

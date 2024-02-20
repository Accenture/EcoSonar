const lighthouseUserFlow = require('lighthouse/lighthouse-core/fraggle-rock/api.js')
const PuppeteerHar = require('puppeteer-har')
const { clickOnElement, waitForSelectors, applyChange } = require('../utils/playSelectors')
const urlsProjectRepository = require('../dataBase/urlsProjectRepository')
const viewPortParams = require('../utils/viewportParams')
const SystemError = require('../utils/SystemError')

class UserJourneyService { }

UserJourneyService.prototype.playUserJourney = async function (url, browser, userJourney) {
  const page = await browser.newPage()
  await page.setViewport(viewPortParams.viewPortParams)
  // disabling cache
  await page.setCacheEnabled(false)

  // get har file
  const pptrHar = new PuppeteerHar(page)
  await pptrHar.start()
  page.setBypassCSP(true)

  // go to url
  await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' })
  const steps = userJourney.steps
  const timeout = 10000
  let step; let element; let promises
  for (step of steps) {
    try {
      switch (step.type) {
        case 'navigate':
          promises = []
          promises.push(page.waitForNavigation())
          await page.goto(step.url)
          await Promise.all(promises)
          break
        case 'click':
          element = await waitForSelectors(step.selectors, page, { timeout, visible: true })
          if (step.offsetX && step.offsetY) {
            await element.click({
              offset: {
                x: step.offsetX,
                y: step.offsetY
              }
            })
          } else {
            await element.click({})
          }

          break
        case 'change':
          element = await waitForSelectors(step.selectors, page, { timeout, visible: true })
          await applyChange(step.value, element)
          break
        case 'scroll' :
          await userJourneyService.scrollUntil(page, step.distancePercentage, step.selectors)
          break
        default:
          break
      }
    } catch (error) {
      console.error('USER JOURNEY : An error occured when launching user flow for url ' + url + ' in step ' + step.type)
      console.error(error)
    }
  }
  await page.waitForNavigation()
  const harObj = await pptrHar.stop()
  return {
    page,
    harObj
  }
}

UserJourneyService.prototype.playUserFlowLighthouse = async function (url, browser, userJourney) {
  const timeout = 10000
  const targetPage = await browser.newPage()
  await targetPage.setViewport(viewPortParams.viewPortParams)
  const flow = await lighthouseUserFlow.startFlow(targetPage, { name: url })
  const steps = userJourney.steps
  let step; let element
  for (step of steps) {
    switch (step.type) {
      case 'navigate':
        await flow.navigate(step.url, {
          stepName: step.url
        })
        await targetPage.setViewport(viewPortParams.viewPortParams)
        break
      case 'click':
        element = await waitForSelectors(step.selectors, targetPage, { timeout, visible: true })
        await clickOnElement(element, step)
        break
      case 'change':
        element = await waitForSelectors(step.selectors, targetPage, { timeout, visible: true })
        await applyChange(step.value, element)
        break
      case 'scroll' :
        await userJourneyService.scrollUntil(targetPage, step.distancePercentage, step.selectors)
        break
      default:
        break
    }
  }
  await targetPage.waitForNavigation()
  targetPage.close()
  const lighthouseResults = await flow.createFlowResult()
  return lighthouseResults.steps[0]
}

UserJourneyService.prototype.insertUserFlow = async function (projectName, url, userFlow) {
  let urlProject = null
  let systemError = false

  await urlsProjectRepository.getUserFlow(projectName, url)
    .then((result) => {
      urlProject = result
    })
    .catch(() => {
      systemError = true
    })
  if (!systemError && urlProject === null) {
    return Promise.reject(new Error('Url not found'))
  } else if (!systemError) {
    await urlsProjectRepository.insertUserFlow(urlProject, userFlow)
      .catch(() => {
        systemError = true
      })
  }
  return new Promise((resolve, reject) => {
    if (systemError) {
      reject(new SystemError())
    } else {
      resolve()
    }
  })
}

UserJourneyService.prototype.getUserFlow = async function (projectName, url) {
  return new Promise((resolve, reject) => {
    urlsProjectRepository.getUserFlow(projectName, url)
      .then((result) => {
        if (result === null || result.userFlow === undefined) {
          console.log('GET USER FLOW - Url flow not found')
          reject(new Error('The page to audit does not have any user flow saved into database.'))
        } else {
          resolve(Object.fromEntries(result.userFlow))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

UserJourneyService.prototype.deleteUserFlow = async function (projectName, url) {
  let urlProject = null
  let systemError = false

  await urlsProjectRepository.getUserFlow(projectName, url)
    .then((result) => {
      urlProject = result
    })
    .catch(() => {
      systemError = true
    })
  if (!systemError && urlProject === null) {
    return Promise.reject(new Error('Url not found'))
  } else if (!systemError) {
    urlsProjectRepository.deleteUserFlow(projectName, url)
      .catch(() => {
        systemError = true
      })
  }
  return new Promise((resolve, reject) => {
    if (systemError) {
      reject(new SystemError())
    } else {
      resolve()
    }
  })
}

UserJourneyService.prototype.scrollUntil = async function (page, distancePercentage, selectors = null) {
  console.log('AUTOSCROLL - autoscroll has started')
  if (distancePercentage) {
    await page.evaluate(async (percentage) => {
      await new Promise((resolve, _reject) => {
        let totalHeight = 0
        const distance = 100
        const scrollHeight = document.body.scrollHeight * percentage / 100
        const timer = setInterval(() => {
          window.scrollBy(0, distance)
          totalHeight += distance
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    }, distancePercentage)
  } else if (selectors !== null) {
    await page.evaluate((selector) => {
      const element = document.querySelector(selector[0])
      const y = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: y - 100 })
    }, selectors)
  }
  console.log('AUTOSCROLL - Autoscroll has ended ')
}

const userJourneyService = new UserJourneyService()
module.exports = userJourneyService

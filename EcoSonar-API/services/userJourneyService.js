const path = require('path')
const fs = require('fs')
const { waitForSelectors, applyChange } = require('../utils/playSelectors')

class UserJourneyService { }

UserJourneyService.prototype.playUserJourney = async function (url, browser) {
  const userJourney = await retrieveUserJourneyInformation(url)
  if (userJourney) {
    const targetPage = await browser.newPage()
    await targetPage.goto(url, { timeout: 0, waitUntil: 'networkidle2' })
    const steps = userJourney.steps
    const timeout = 30000
    let step; let element; let promises
    for (step of steps) {
      switch (step.type) {
        case 'navigate':
          promises = []
          promises.push(targetPage.waitForNavigation())
          await targetPage.goto(step.url)
          await Promise.all(promises)
          break
        case 'click':
          element = await waitForSelectors(step.selectors, targetPage, { timeout, visible: true })
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
          element = await waitForSelectors(step.selectors, targetPage, { timeout, visible: true })
          await applyChange(step.value, element)
          break
        default:
          break
      }
    }
    targetPage.waitForNavigation()
  }
}

async function retrieveUserJourneyInformation (url) {
  try {
    const files = fs.readdirSync(path.join(__dirname, '../userJourney'))
    const urlWithoutSpecialCharacters = url.replace(/[:?/]/g, '') + '.json'
    if (files.includes(urlWithoutSpecialCharacters)) {
      return JSON.parse(fs.readFileSync(path.join(__dirname, '../userJourney/', urlWithoutSpecialCharacters)))
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

const userJourneyService = new UserJourneyService()
module.exports = userJourneyService

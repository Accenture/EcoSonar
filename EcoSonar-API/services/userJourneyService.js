const path = require('path')
const fs = require('fs')

class UserJourneyService {}

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
    targetPage.close()
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

async function waitForSelectors (selectors, frame, options) {
  for (const selector of selectors) {
    try {
      return await waitForSelector(selector, frame, options)
    } catch (err) {
      console.error(err)
    }
  }
  throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors))
}

async function waitForSelector (selector, frame, options) {
  if (!Array.isArray(selector)) {
    selector = [selector]
  }
  if (!selector.length) {
    throw new Error('Empty selector provided to waitForSelector')
  }
  let element = null
  for (let i = 0; i < selector.length; i++) {
    const part = selector[i]
    if (part.startsWith('aria')) {
      console.log('Do not search for selectors with aria')
    }
    if (element) {
      element = await element.waitForSelector(part, options)
    } else {
      element = await frame.waitForSelector(part, options)
    }
    if (!element) {
      throw new Error('Could not find element: ' + selector.join('>>'))
    }
    if (i < selector.length - 1) {
      element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement()
    }
  }
  if (!element) {
    throw new Error('Could not find element: ' + selector.join('|'))
  }
  return element
}

async function applyChange (valueToChange, element) {
  const type = await element.evaluate(el => el.type)
  if (['select-one'].includes(type)) {
    await element.select(valueToChange)
  } else if (['textarea', 'text', 'url', 'tel', 'search', 'password', 'number', 'email'].includes(type)) {
    await element.type(valueToChange)
  } else {
    await element.focus()
    await element.evaluate((el, value) => {
      el.value = value
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }, valueToChange)
  }
}

const userJourneyService = new UserJourneyService()
module.exports = userJourneyService

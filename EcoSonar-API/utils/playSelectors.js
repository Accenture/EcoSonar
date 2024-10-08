import loggerService from '../loggers/traces.js'

async function clickOnElement (element, step) {
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
}

async function waitForSelectors (selectors, frame, options) {
  for (const selector of selectors) {
    try {
      if (!selector.length) {
        throw new Error('Empty selector provided to waitForSelector')
      } else if (Array.isArray(selector)) {
        return await waitForSelector(selector, frame, options)
      } else {
        return await waitForSelector([selector], frame, options)
      }
    } catch (err) {
      loggerService.error(err.message)
    }
  }
  throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors))
}

async function waitForSelector (selector, frame, options) {
  let element = null
  const firstSelector = selector[0]
  if (selector.length === 1  && firstSelector.indexOf('#') === 0) {
      const idStartsWith = firstSelector.replace('#', '')
      loggerService.info('Selector being picked '+ idStartsWith)
      return await frame.waitForSelector(firstSelector)
    }

  for (let i = 0; i < selector.length; i++) {
    const part = selector[i]
    if (part.startsWith('aria')) {
      console.log('Do not search for selectors with aria')
    }
    if (element) {
      element = element.waitForSelector(part, options)
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

export { clickOnElement, waitForSelectors, applyChange }

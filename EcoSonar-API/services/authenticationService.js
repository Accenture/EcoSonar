const { waitForSelectors, applyChange } = require('../utils/playSelectors')
const loginProxyConfigurationService = require('./loginProxyConfigurationService')
const viewPortParams = require('../utils/viewportParams')

class AuthenticationService { }

AuthenticationService.prototype.loginIfNeeded = async function (browser, projectName) {
  let loginInformations
  await loginProxyConfigurationService.getLoginCredentials(projectName)
    .then((login) => {
      loginInformations = login
    })
    .catch(() => {
      console.log('LOGIN CREDENTIALS - no login saved for this project')
    })
  if (loginInformations) {
    // Go to login url
    const [page] = await browser.pages()

    await page.setViewport(viewPortParams.viewPortParams)

    await page.goto(loginInformations.authentication_url, { timeout: 0, waitUntil: 'networkidle2' })
    // Fill login fields
    if (loginInformations.steps) {
      return loginOnMultiPages(page, loginInformations.steps)
    } else {
      return loginOnOnePage(page, loginInformations)
    }
  }
  return true
}

async function loginOnOnePage (page, loginInformations) {
  try {
    if (loginInformations.usernameSelector) {
      await page.type(loginInformations.usernameSelector, loginInformations.username)
    } else {
      await page.type('input[name=username], input[type=email]', loginInformations.username)
    }
    if (loginInformations.passwordSelector) {
      await page.type(loginInformations.passwordSelector, loginInformations.password)
    } else {
      await page.type('input[name=password], input[type=password], input[id=password]', loginInformations.password)
    }
    if (loginInformations.loginButtonSelector) {
      await page.click(loginInformations.loginButtonSelector)
    } else {
      await page.click('button[type=submit]')
    }
    await page.waitForNavigation()
    return true
  } catch (error) {
    console.error(error.message)
    if (error.message === 'Navigation timeout of 30000 ms exceeded') {
      return true
    }
    console.error('Could not log in')
    return false
  }
}

async function loginOnMultiPages (page, steps) {
  const timeout = 10000
  let step; let element
  try {
    for (step of steps) {
      element = await waitForSelectors(step.selectors, page, { timeout, visible: true })
      switch (step.type) {
        case 'click':
          await element.click()
          break
        case 'change':
          await applyChange(step.value, element)
          break
        default:
          break
      }
    }
    await page.waitForNavigation()
    return true
  } catch (error) {
    console.error(error.message)
    if (error.message === 'Navigation timeout of 10000 ms exceeded' || error.message === 'Navigation timeout of 30000 ms exceeded') {
      return true
    }
    console.error('Could not log in')
    return false
  }
}

AuthenticationService.prototype.useProxyIfNeeded = async function (projectName) {
  let proxyConfiguration = false
  await loginProxyConfigurationService.getProxyConfiguration(projectName)
    .then((res) => {
      proxyConfiguration = '--proxy-server=' + res.ipAddress + ':' + res.port
    })
    .catch(() => {
      console.log('PROXY CREDENTIALS - no proxy saved for this project')
    })
  return proxyConfiguration
}

const authenticationService = new AuthenticationService()
module.exports = authenticationService

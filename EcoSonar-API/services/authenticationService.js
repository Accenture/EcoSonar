import { waitForSelectors, applyChange } from '../utils/playSelectors.js'
import loginProxyConfigurationService from './loginProxyConfigurationService.js'
import viewPortParams from '../utils/viewportParams.js'

class AuthenticationService { }

AuthenticationService.prototype.loginIfNeeded = async function (browser, projectName, username, password) {
  let loginInformations
  await loginProxyConfigurationService.getLoginCredentials(projectName, username, password)
    .then((login) => {
      loginInformations = login
    })
    .catch(() => {
      console.log('LOGIN CREDENTIALS - no login saved for this project')
    })
  if (loginInformations) {
    // Go to login url
    const [page] = await browser.pages()

    await page.setViewport(viewPortParams)

    await page.goto(loginInformations.authentication_url, { timeout: 0, waitUntil: 'networkidle2' })
    // Fill login fields
    if (loginInformations.steps) {
      return loginOnMultiPages(page, loginInformations)
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

async function loginOnMultiPages (page, loginInformations) {
  const timeout = 10000
  let step; let element
  try {
    for (step of loginInformations.steps) {
      element = await waitForSelectors(step.selectors, page, { timeout, visible: true })
      switch (step.type) {
        case 'click':
          await element.click()
          break
        case 'change':
          if (step.value === '%USERNAME%') {
            await applyChange(loginInformations.username, element)
          } else if (step.value === '%PASSWORD%') {
            await applyChange(loginInformations.password, element)
          } else {
            await applyChange(step.value, element)
          }
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
export default authenticationService

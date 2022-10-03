const path = require('path')
const fs = require('fs')
const YAML = require('js-yaml')
const { waitForSelectors, applyChange } = require('../utils/playSelectors')

class AuthenticationService { }

AuthenticationService.prototype.loginIfNeeded = async function (browser) {
  const loginInformations = await getLoginInformations()
  if (loginInformations) {
    // Go to login url
    const [page] = await browser.pages()
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

async function getLoginInformations () {
  try {
    const ymlFile = fs.readFileSync(path.join(__dirname, '../login.yaml'), 'utf8')
    return YAML.load(ymlFile)
  } catch (e) {
    console.error(e)
    return false
  }
}

async function loginOnOnePage (page, loginInformations) {
  if (loginInformations.usernameSelector) {
    await page.type(loginInformations.usernameSelector, loginInformations.password)
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
    await page.waitForNavigation()
    return true
  } else {
    try {
      await page.click('button[type=submit]')
      await page.waitForNavigation()
      return true
    } catch (error) {
      console.error('Login button selector no found. Try to add a css selector for loginButtonSelector in the yaml file')
      return false
    }
  }
}

async function loginOnMultiPages (page, steps) {
  const timeout = 30000
  let step; let element
  try {
    for (step of steps) {
      switch (step.type) {
        case 'click':
          element = await waitForSelectors(step.selectors, page, { timeout, visible: true })
          await element.click({})
          break
        case 'change':
          element = await waitForSelectors(step.selectors, page, { timeout, visible: true })
          await applyChange(step.value, element)
          break
        default:
          break
      }
    }
    await page.waitForNavigation()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

AuthenticationService.prototype.useProxyIfNeeded = async function (projectName) {
  const proxyInformations = await getProxyInformations()
  if (proxyInformations && ((proxyInformations.projectName === undefined) || (proxyInformations.projectName && proxyInformations.projectName.includes(projectName)))) {
    return '--proxy-server=' + proxyInformations.ipaddress + ':' + proxyInformations.port
  } else {
    return false
  }
}

async function getProxyInformations () {
  try {
    const ymlFile = fs.readFileSync(path.join(__dirname, '../proxy.yaml'), 'utf8')
    return YAML.load(ymlFile)
  } catch {
    return false
  }
}

const authenticationService = new AuthenticationService()
module.exports = authenticationService

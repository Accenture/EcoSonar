const path = require('path')
const fs = require('fs')
const YAML = require('js-yaml')

async function loginIfNeeded (browser, url) {
  const loginInformations = await getLoginInformations()
  if (loginInformations) {
    // Go to login url
    const [page] = await browser.pages()
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' })
    // Fill login fields
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
    } else {
      try {
        await page.click('button[type=submit]')
      } catch (error) {
        console.error('Login button selector no found. Try to add a css selector for loginButtonSelector in the yaml file')
        return false
      }
    }
    await page.waitForNavigation()
    await page.close()
    return true
  }
  return true
}

async function getLoginInformations () {
  try {
    const ymlFile = fs.readFileSync(path.join(__dirname, '../login.yaml'), 'utf8')
    return YAML.load(ymlFile)
  } catch {
    return false
  }
}

module.exports = loginIfNeeded

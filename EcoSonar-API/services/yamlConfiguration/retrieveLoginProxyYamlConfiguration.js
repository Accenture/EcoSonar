import path from 'path'
import fs from 'fs'
import YAML from 'js-yaml'

class RetrieveLoginProxyYamlConfiguration {
}

RetrieveLoginProxyYamlConfiguration.prototype.getLoginInformations = async function () {
  try {
    const __dirname = path.resolve(path.dirname(''))
    const ymlFile = fs.readFileSync(path.join(__dirname, './services/yamlConfiguration/login.yaml'), 'utf8')
    return YAML.load(ymlFile)
  } catch (e) {
    return false
  }
}

RetrieveLoginProxyYamlConfiguration.prototype.getProxyInformations = async function () {
  try {
    const __dirname = path.resolve(path.dirname(''))
    const ymlFile = fs.readFileSync(path.join(__dirname, './services/yamlConfiguration/proxy.yaml'), 'utf8')
    return YAML.load(ymlFile)
  } catch {
    return false
  }
}

const retrieveLoginProxyYamlConfigurationService = new RetrieveLoginProxyYamlConfiguration()
export default retrieveLoginProxyYamlConfigurationService

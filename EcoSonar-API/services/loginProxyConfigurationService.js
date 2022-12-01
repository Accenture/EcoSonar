const projectsRepository = require('../dataBase/projectsRepository')
class LoginProxyConfigurationService {}

LoginProxyConfigurationService.prototype.insert = async function (projectName, loginCredentials, proxy) {
  const projectSettingsRegistered = await projectsRepository.getProjectSettings(projectName)
  if (projectSettingsRegistered === null) {
    await projectsRepository.createLoginConfiguration(projectName, loginCredentials, proxy)
      .then(() => {
        console.log('INSERT LOGIN - PROXY CONFIGURATION - Success')
      })
  } else {
    await projectsRepository.updateLoginConfiguration(projectName, projectSettingsRegistered.procedure, loginCredentials, proxy)
      .then(() => {
        console.log('UPDATE LOGIN - PROXY CONFIGURATION - Success')
      })
  }
}

LoginProxyConfigurationService.prototype.getLoginCredentials = async function (projectName) {
  const result = await projectsRepository.getProjectSettings(projectName)
  return new Promise((resolve, reject) => {
    if (result === null || result.login === undefined) {
      reject(new Error('Your project does not have login saved into database.'))
    } else {
      resolve(Object.fromEntries(result.login))
    }
  })
}

LoginProxyConfigurationService.prototype.getProxyConfiguration = async function (projectName) {
  const result = await projectsRepository.getProjectSettings(projectName)
  return new Promise((resolve, reject) => {
    if (result === null || result.proxy === undefined || result.proxy.ipAddress === undefined || result.proxy.port === undefined) {
      reject(new Error('Your project does not have proxy configuration saved into database.'))
    } else {
      resolve(result.proxy)
    }
  })
}

LoginProxyConfigurationService.prototype.deleteLoginCredentials = async function (projectName) {
  const result = await projectsRepository.getProjectSettings(projectName)
  if (result === null) {
    throw new Error('Project not found')
  } else {
    projectsRepository.deleteLoginCredentials(projectName, result.procedure, result.proxy)
  }
}

LoginProxyConfigurationService.prototype.deleteProxyConfiguration = async function (projectName) {
  const result = await projectsRepository.getProjectSettings(projectName)
  if (result === null) {
    throw new Error('Project not found')
  } else {
    projectsRepository.deleteProxyConfiguration(projectName, result.procedure, result.login)
  }
}

const loginproxyConfigurationService = new LoginProxyConfigurationService()
module.exports = loginproxyConfigurationService

const projectsRepository = require('../dataBase/projectsRepository')
const SystemError = require('../utils/SystemError')
const retrieveLoginProxyYamlConfigurationService = require('./yamlConfiguration/retrieveLoginProxyYamlConfiguration')

class LoginProxyConfigurationService {}

LoginProxyConfigurationService.prototype.insertLoginCredentials = async function (projectName, loginCredentials) {
  let projectSettingsRegistered = null
  let systemError = false

  await projectsRepository.getProjectSettings(projectName)
    .then((projectSettings) => {
      projectSettingsRegistered = projectSettings
    }).catch(() => {
      systemError = true
    })
  if (!systemError && projectSettingsRegistered === null) {
    await projectsRepository.createLoginConfiguration(projectName, loginCredentials)
      .catch(() => {
        systemError = true
      })
  } else if (!systemError) {
    await projectsRepository.updateLoginConfiguration(projectName, loginCredentials)
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

LoginProxyConfigurationService.prototype.insertProxyConfiguration = async function (projectName, proxy) {
  let projectSettingsRegistered = null
  let systemError = false

  await projectsRepository.getProjectSettings(projectName)
    .then((projectSettings) => {
      projectSettingsRegistered = projectSettings
    }).catch(() => {
      systemError = true
    })
  if (!systemError && projectSettingsRegistered === null) {
    await projectsRepository.createProxyConfiguration(projectName, proxy)
      .catch(() => {
        systemError = true
      })
  } else if (!systemError) {
    await projectsRepository.updateProxyConfiguration(projectName, proxy)
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

LoginProxyConfigurationService.prototype.getLoginCredentials = async function (projectName) {
  const configSettings = process.env.ECOSONAR_ENV_AUTHENTICATION_CONFIGURATION || 'database'
  const authenticationUrl = process.env.ECOSONAR_ENV_AUTHENTICATION_URL || ''
  const username = process.env.ECOSONAR_ENV_AUTHENTICATION_USERNAME || ''
  const password = process.env.ECOSONAR_ENV_AUTHENTICATION_PASSWORD || ''
  let loginInformations = {}
  let error = false

  if (configSettings === 'env' && authenticationUrl !== '' && username !== '' && password !== '') {
    loginInformations = {
      authentication_url: authenticationUrl,
      username,
      password
    }
  } else if (configSettings === 'yaml') {
    const login = await retrieveLoginProxyYamlConfigurationService.getLoginInformations()
    if (login !== false && (login.projectName === undefined || login.projectName.includes(projectName)) && login.authentication_url !== undefined && login.username !== undefined && login.password !== undefined) {
      loginInformations = {
        authentication_url: login.authentication_url,
        username: login.username,
        password: login.password
      }
    }
  } else {
    await projectsRepository.getProjectSettings(projectName)
      .then((result) => {
        if (!(result === null || result.login === undefined)) {
          loginInformations = {
            authentication_url: result.login.get('authentication_url'),
            username: result.login.get('username'),
            password: result.login.get('password'),
            steps: result.login.get('steps')
          }
        }
      })
      .catch(() => {
        error = true
      })
  }
  return new Promise((resolve, reject) => {
    if (error) {
      reject(new SystemError())
    } else if (Object.entries(loginInformations).length === 0) {
      reject(new Error('Your project does not have login saved.'))
    } else {
      resolve(loginInformations)
    }
  })
}

LoginProxyConfigurationService.prototype.getProxyConfiguration = async function (projectName) {
  const configSettings = process.env.ECOSONAR_ENV_AUTHENTICATION_CONFIGURATION || 'database'
  const ipAddress = process.env.ECOSONAR_ENV_PROXY_IP_ADDRESS || ''
  const port = process.env.ECOSONAR_ENV_PROXY_PORT || ''
  let proxyInformations = {}
  let error = false

  if (configSettings === 'env' && ipAddress !== '' && port !== '') {
    proxyInformations = {
      ipAddress,
      port
    }
  } else if (configSettings === 'yaml') {
    const proxy = await retrieveLoginProxyYamlConfigurationService.getProxyInformations()
    if (proxy !== false && (proxy.projectName === undefined || proxy.projectName.includes(projectName)) && proxy.ipaddress !== undefined && proxy.port !== undefined) {
      proxyInformations = {
        ipAddress: proxy.ipaddress,
        port: proxy.port
      }
    }
  } else {
    await projectsRepository.getProjectSettings(projectName)
      .then((result) => {
        if (!(result === null || result.proxy === undefined || result.proxy.ipAddress === undefined || result.proxy.port === undefined)) {
          proxyInformations = result.proxy
        }
      })
      .catch(() => {
        error = true
      })
  }
  return new Promise((resolve, reject) => {
    if (error) {
      reject(new SystemError())
    } else if (Object.entries(proxyInformations).length === 0) {
      reject(new Error('Your project does not have proxy configuration saved.'))
    } else {
      resolve(proxyInformations)
    }
  })
}

LoginProxyConfigurationService.prototype.deleteLoginCredentials = async function (projectName) {
  let projectRegistered = null
  let systemError = false

  await projectsRepository.getProjectSettings(projectName)
    .then((result) => {
      projectRegistered = result
    })
    .catch(() => {
      systemError = true
    })
  if (!systemError && projectRegistered === null) {
    return Promise.reject(new Error('Project not found'))
  } else if (!systemError) {
    projectsRepository.deleteLoginCredentials(projectName, projectRegistered.procedure, projectRegistered.proxy)
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

LoginProxyConfigurationService.prototype.deleteProxyConfiguration = async function (projectName) {
  let projectRegistered = null
  let systemError = false

  await projectsRepository.getProjectSettings(projectName)
    .then((result) => {
      projectRegistered = result
    })
    .catch(() => {
      systemError = true
    })
  if (!systemError && projectRegistered === null) {
    return Promise.reject(new Error('Project not found'))
  } else if (!systemError) {
    projectsRepository.deleteProxyConfiguration(projectName, projectRegistered.procedure, projectRegistered.login)
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

const loginproxyConfigurationService = new LoginProxyConfigurationService()
module.exports = loginproxyConfigurationService

import configurationRepository from '../dataBase/configurationRepository.js'
import urlsProjectRepository from '../dataBase/urlsProjectRepository.js'
import SystemError from '../utils/SystemError.js'
import loggerService from '../loggers/traces.js'

class ConfigurationService { }

ConfigurationService.prototype.saveConfiguration = async function (projectName, w3cBool, carbonBool) {
  let systemError = false
  let idKey = null;
  let configExist = false;

  await urlsProjectRepository.getUrlProject(projectName)
    .then((result) => {
      idKey = result.idKey })
    .catch(() => { systemError = true })

  if (idKey == null) {
    res.status(404).json({ error: 'No project named ' + projectName + ' found' })
  }

  loggerService.info(`GET CONFIGURATION - Checking if project ${projectName} already has a config`)
  await configurationRepository.findConfiguration(idKey)
    .then((result) => {
      if (result != null) {
        configExist = true
        loggerService.info(`GET CONFIGURATION - Project ${projectName} config present`)
      }
    })

  if (configExist == false) {
    loggerService.info(`GET CONFIGURATION - Creating a config for the project ${projectName}`)
    return new Promise((resolve, reject) => {
      if (!systemError && idKey !== null) {
        configurationRepository.insertConfiguration(idKey, w3cBool, carbonBool)
          .then(() => resolve())
          .catch((error) => reject(error))     
      } 
       else {
        reject(new SystemError())
    }})
  } else {
    return new Promise((resolve, reject) => {
      configurationRepository.findConfiguration(idKey)
        .then((existingConfig) => {
          if (existingConfig === null) {
            resolve({ Configuration: '' })
          }
          resolve({ Configuration: existingConfig })
        }).catch((err) => {
          reject(err)
        })
    })
  }
}

ConfigurationService.prototype.updateConfiguration = async function (res, projectName, w3cBool, carbonBool) {
  let systemError = false
  let idKey = null;

  await urlsProjectRepository.getUrlProject(projectName)
    .then((result) => {
      idKey = result.idKey })
    .catch(() => { systemError = true })

  if (idKey == null) {
    res.status(404).json({ error: 'No project named ' + projectName + ' found' })
  }
  return new Promise((resolve, reject) => {
    if (!systemError && idKey !== null) {
      configurationRepository.updateConfiguration(idKey, w3cBool, carbonBool)
        .then(() => resolve())
        .catch((error) => reject(error))     
    } 
     else {
      reject(new SystemError())
    }
  })
}

ConfigurationService.prototype.getConfiguration = async function (projectName, res) {

  let systemError = false
  let idKey = null;

  await urlsProjectRepository.getUrlProject(projectName)
  .then((result) => {
    idKey = result.idKey })
  .catch(() => { systemError = true })

  if (idKey == null) {
    res.status(404).json({ error: 'No project named ' + projectName + ' found' })
  }

  return new Promise((resolve, reject) => {
    configurationRepository.findConfiguration(idKey)
      .then((existingConfig) => {
        if (existingConfig === null) {
          resolve({ Configuration: '' })
        }
        resolve({ Configuration: existingConfig })
      }).catch((err) => {
        reject(err)
      })
  })
}

ConfigurationService.prototype.getW3CConfig = async function (projectName, res) {

  let systemError = false
  let idKey = null;

  await urlsProjectRepository.getUrlProject(projectName)
  .then((result) => {
    idKey = result.idKey })
  .catch(() => { systemError = true })

  if (idKey == null) {
    res.status(404).json({ error: 'No project named ' + projectName + ' found' })
  }

  return new Promise((resolve, reject) => {
    configurationRepository.findConfiguration(idKey)
      .then((existingConfig) => {
        if (existingConfig === null) {
          resolve({ Configuration: '' })
        }
        resolve({ Configuration: existingConfig.W3C })
      }).catch((err) => {
        reject(err)
      })
  })
}

const configurationService = new ConfigurationService()
export default configurationService

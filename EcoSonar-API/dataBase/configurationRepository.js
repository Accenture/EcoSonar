import configurations from './models/configurations.js'
import SystemError from '../utils/SystemError.js'
import loggerService from '../loggers/traces.js'

const ConfigurationRepository = function () {
  /**
   * add a new new configuration for a project
   * @param {JSON} configuration the configuration to save
   */
  this.insertConfiguration = function (idProject, W3C, carbon) {
    return new Promise((resolve, reject) => {
      configurations.create({ idProject, W3C, carbon })
        .then(() => { resolve() })
        .catch((error) => {
          console.log(error)
          loggerService.error('\x1b[31m%s\x1b[0m', error)
          if (error._message === 'configuration validation failed') {
            reject(new Error(error.message))
          }
          reject(new SystemError())
        })
    })
  }

  /**
   * update an existing configuration of a project
   * @param {JSON} configuration the configuration to save
   */
  this.updateConfiguration = async function (idProject, W3C, carbon) {
    return new Promise((resolve, reject) => {
      configurations.updateOne({ idProject, W3C, carbon })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          loggerService.error('\x1b[31m%s\x1b[0m', error)
          if (error._message === 'configuration validation failed') {
            reject(new Error(error.message))
          }
          reject(new SystemError())
        })
    })
  }

  /**
   * find an existing configuration of a project
   * @param {String} id of the project 
   */
  this.findConfiguration = async function (idProject) {
    return new Promise((resolve, reject) => {
      configurations.findOne({ idProject: { $eq: idProject } }, { W3C: 1, carbon: 1})
      .then((result) => { resolve(result) })
        .catch((error) => {
          loggerService.error('\x1b[31m%s\x1b[0m', error)
          if (error._message === 'configuration validation failed') {
            reject(new Error(error.message))
          }
          reject(new SystemError())
        })
    })
  }
}

const configurationRepository = new ConfigurationRepository()
export default configurationRepository

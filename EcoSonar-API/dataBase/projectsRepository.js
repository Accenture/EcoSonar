const projects = require('./models/projects')
const SystemError = require('../utils/SystemError')
const urlsProject = require('./models/urlsprojects')

const ProjectsRepository = function () {
  /**
   * get all projects in database that match a regexp
   * @param {string} filterName regexp for the project name
   * @returns an array with the projectName for all projects found
   */
  this.findAllProjectsNames = async function (filterName) {
    let query = {}
    if (filterName !== null) {
      query = { projectName: { $regex: new RegExp(filterName, 'i') } }
    }
    return new Promise((resolve, reject) => {
      urlsProject.find(query)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error.message)
          reject(new SystemError())
        })
    })
  }

  /**
   * add a new procedure for a project
   * @param {string} projectName the name of the project
   * @param {string} procedure the procedure to add
   */
  this.createProcedure = function (projectName, procedure) {
    return new Promise((resolve, reject) => {
      projects.create({ projectName, procedure })
        .then(() => { resolve() })
        .catch((error) => {
          if (error._message === 'projects validation failed') {
            reject(new Error(error.message))
          }
          console.error('\x1b[31m%s\x1b[0m', error.message)
          const systemError = new SystemError()
          reject(systemError)
        })
    })
  }

  /**
   * update the procedure of a project
   * @param {string} projectName  the name of the project
   * @param {string} selectedProcedure the new procedure to update
   */
  this.updateProjectProcedure = async function (projectName, selectedProcedure) {
    return new Promise((resolve, reject) => {
      projects.updateOne({ projectName }, { procedure: selectedProcedure })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          if (error._message === 'projects validation failed') {
            reject(new Error(error.message))
          }
          console.error('\x1b[31m%s\x1b[0m', error)
          const systemError = new SystemError()
          reject(systemError)
        })
    })
  }

  /**
   * Create login Configuration to be saved in the project
   * @param {string} projectName is the name of the project
   * @param {JSON} loginCredentials is the login credentials to be set when analysing the project
   */
  this.createLoginConfiguration = async function (projectName, loginCredentials) {
    const loginMap = (loginCredentials !== undefined && loginCredentials !== null) ? new Map(Object.entries(loginCredentials)) : {}
    return new Promise((resolve, reject) => {
      projects.create({ projectName, login: loginMap })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('PROJECTS REPOSITORY - login creation failed')
          console.error('\x1b[31m%s\x1b[0m', error)
          const systemError = new SystemError()
          reject(systemError)
        })
    })
  }

  /**
 * Create proxy configuration to be saved in the project
 * @param {string} projectName is the name of the project
 * @param {string} proxy is the proxy configuration to be set when analysing the project
 */
  this.createProxyConfiguration = async function (projectName, proxy) {
    return new Promise((resolve, reject) => {
      projects.create({ projectName, proxy })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('PROJECTS REPOSITORY - proxy creation failed')
          console.error('\x1b[31m%s\x1b[0m', error)
          const systemError = new SystemError()
          reject(systemError)
        })
    })
  }

  /**
   * Update login Configuration to be saved in the project
   * @param {string} projectName is the name of the project
   * @param {string} procedure is the procedure to be saved in a specified enumeration
   * @param {JSON} loginCredentials is the login credentials to be set when analysing the project
   */
  this.updateLoginConfiguration = async function (projectName, procedure, loginCredentials) {
    const loginMap = new Map(Object.entries(loginCredentials))
    return new Promise((resolve, reject) => {
      projects.updateOne({ projectName }, { login: loginMap, procedure })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('PROJECTS REPOSITORY - login update failed')
          console.error('\x1b[31m%s\x1b[0m', error)
          const systemError = new SystemError()
          reject(systemError)
        })
    })
  }

  /**
 * Update proxy configuration to be saved in the project
 * @param {string} projectName is the name of the project
 * @param {string} procedure is the procedure to be saved in a specified enumeration
 * @param {JSON} proxy is the proxy configuration to be set when analysing the project
 */
  this.updateProxyConfiguration = async function (projectName, procedure, proxy) {
    return new Promise((resolve, reject) => {
      projects.updateOne({ projectName }, { proxy, procedure })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('PROJECTS REPOSITORY - proxy update failed')
          console.error('\x1b[31m%s\x1b[0m', error)
          const systemError = new SystemError()
          reject(systemError)
        })
    })
  }

  /**
   * find project settings in the table projects
   * @param {string} projectNameReq name of the project
   * @returns project settings
   */
  this.getProjectSettings = async function (projectName) {
    let systemError = null
    let result
    try {
      result = await projects.findOne({ projectName }, { login: 1, procedure: 1, proxy: 1 })
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error.message)
      console.log(`Error when retrieving project settings for ${projectName}`)
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (result === null) {
        reject(new Error(`Project Settings is not defined for project ${projectName}`))
      } else {
        resolve(result)
      }
    })
  }

  /**
   * Deletion of login credentials for project
   * @param {string} projectNameReq name of the project
   * @param {string} procedureRegistered procedure registered for the project
   * @param {JSON} proxyRegistered proxy registered for the project
   */
  this.deleteLoginCredentials = async function (projectNameReq, procedureRegistered, proxyRegistered) {
    let systemError = null
    try {
      if (procedureRegistered !== undefined && proxyRegistered !== undefined) {
        await projects.updateOne({ projectName: projectNameReq }, { $unset: { login: '' } })
      } else {
        await projects.deleteOne({ projectName: projectNameReq })
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error.message)
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        console.log('error during deletion of login credentials in ' + projectNameReq)
        reject(systemError)
      } else {
        resolve()
      }
    })
  }

  /**
   * Deletion of proxy configuration for project
   * @param {string} projectNameReq name of the project
   * @param {string} procedureRegistered procedure registered for the project
   * @param {JSON} loginRegistered login registered for the project
   */
  this.deleteProxyConfiguration = async function (projectNameReq, procedureRegistered, loginRegistered) {
    let systemError = null
    try {
      if (procedureRegistered !== undefined || loginRegistered !== undefined) {
        await projects.updateOne({ projectName: projectNameReq }, { $unset: { proxy: '', ipAddress: '', port: '' } })
      } else {
        await projects.deleteOne({ projectName: projectNameReq })
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error.message)
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        console.log('error during deletion of proxy configuration in ' + projectNameReq)
        reject(systemError)
      } else {
        resolve()
      }
    })
  }

  /**
   * Deletion of one project based on his name
   * @param {string} projectNameReq name of the project
   */
  this.deleteProjectPerProjectName = async function (projectNameReq) {
    return new Promise((resolve, reject) => {
      projects.deleteOne({ projectName: projectNameReq })
        .then(() => {
          console.log(`DELETE URLS PROJECT - project ${projectNameReq} deleted`)
          resolve()
        }).catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }
}

const projectsRepository = new ProjectsRepository()
module.exports = projectsRepository

const projects = require('./models/projects')
const SystemError = require('../utils/SystemError')

const ProjectsRepository = function () {
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
          console.error('\x1b[31m%s\x1b[0m', error)
          if (error._message === 'projects validation failed') {
            reject(new Error(error.message))
          }
          reject(new SystemError())
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
          console.error('\x1b[31m%s\x1b[0m', error)
          if (error._message === 'projects validation failed') {
            reject(new Error(error.message))
          }
          reject(new SystemError())
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
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
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
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Update login Configuration to be saved in the project
   * @param {string} projectName is the name of the project
   * @param {JSON} loginCredentials is the login credentials to be set when analysing the project
   */
  this.updateLoginConfiguration = async function (projectName, loginCredentials) {
    const loginMap = new Map(Object.entries(loginCredentials))
    return new Promise((resolve, reject) => {
      projects.updateOne({ projectName }, { login: loginMap })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
 * Update proxy configuration to be saved in the project
 * @param {string} projectName is the name of the project
 * @param {JSON} proxy is the proxy configuration to be set when analysing the project
 */
  this.updateProxyConfiguration = async function (projectName, proxy) {
    return new Promise((resolve, reject) => {
      projects.updateOne({ projectName }, { proxy })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find project settings in the table projects
   * @param {string} projectNameReq name of the project
   * @returns project settings
   */
  this.getProjectSettings = async function (projectName) {
    return new Promise((resolve, reject) => {
      projects.findOne({ projectName }, { login: 1, procedure: 1, proxy: 1 })
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Deletion of login credentials for project
   * @param {string} projectNameReq name of the project
   * @param {string} procedureRegistered procedure registered for the project
   * @param {JSON} proxyRegistered proxy registered for the project
   */
  this.deleteLoginCredentials = async function (projectNameReq, procedureRegistered, proxyRegistered) {
    let systemError = false
    try {
      if (procedureRegistered !== undefined || proxyRegistered.ipAddress !== undefined || proxyRegistered.port !== undefined) {
        await projects.updateOne({ projectName: projectNameReq }, { $unset: { login: '' } })
      } else {
        await projects.deleteOne({ projectName: projectNameReq })
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      systemError = true
    }
    return new Promise((resolve, reject) => {
      if (systemError) {
        reject(new SystemError())
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
    let systemError = false
    try {
      if (procedureRegistered !== undefined || loginRegistered !== undefined) {
        await projects.updateOne({ projectName: projectNameReq }, { $unset: { proxy: '', ipAddress: '', port: '' } })
      } else {
        await projects.deleteOne({ projectName: projectNameReq })
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      systemError = true
    }
    return new Promise((resolve, reject) => {
      if (systemError) {
        reject(new SystemError())
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

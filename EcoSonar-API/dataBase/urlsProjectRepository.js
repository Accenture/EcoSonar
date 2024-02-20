const uniqid = require('uniqid')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')

const UrlsProjectRepository = function () {
  /**
   * insertion of one or more url on the table urlsProject
   * @param {string} projectName project Name
   * @param {Array} urlList urls to be saved
   */
  this.insertAll = async function (projectName, urlList) {
    const urlsProjects = []
    for (const url of urlList) {
      urlsProjects.push({
        idKey: uniqid(),
        projectName,
        urlName: url
      })
    }
    return new Promise((resolve, reject) => {
      urlsprojects.insertMany(urlsProjects)
        .then(() => { resolve() })
        .catch((err) => {
          console.error('\x1b[31m%s\x1b[0m', err)
          if (err._message === 'urlsprojects validation failed') {
            const indexError = urlList.indexOf(err.errors.urlName.properties.value)
            const errors = []
            let index = 0
            while (index < urlsProjects.length) {
              if (index === indexError) {
                errors[index] = 'Url has an invalid syntax'
              } else {
                errors[index] = ''
              }
              index++
            }
            reject(errors)
          } else {
            reject(new SystemError())
          }
        })
    })
  }

  /**
   * Deletion of an url
   * @param {Object} url url to be deleted
   */
  this.deleteUrl = async function (url) {
    return new Promise((resolve, reject) => {
      urlsprojects.deleteOne({ urlName: url[0].urlName })
        .then((result) => {
          console.log(`DELETE URL - On URL PROJECT ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * deletion of all urls of a project
   * @param {Array} urlIdKeyList list of id key representing url saved
   */
  this.deleteProject = async function (urlIdKeyList) {
    return new Promise((resolve, reject) => {
      urlsprojects.deleteMany({ idKey: { $in: urlIdKeyList } })
        .then((result) => {
          console.log(`DELETE URLS PROJECT - On urlsprojects ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * list all urls of a project
   * @param {string} projectNameReq name of the project
   */
  this.findAll = async function (projectNameReq) {
    return new Promise((resolve, reject) => {
      urlsprojects.find({ projectName: projectNameReq })
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
   * Insert or Update user flow for a specific url
   * @param {JSON} urlObject urlProject previously registered
   * @param {JSON} userFlow user flow to be saved
   */
  this.insertUserFlow = async function (urlObject, userFlow) {
    const userflowMap = new Map(Object.entries(userFlow))
    return new Promise((resolve, reject) => {
      urlsprojects.updateOne({ idKey: urlObject.idKey, projectName: urlObject.projectName, urlName: urlObject.urlName }, { userFlow: userflowMap })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find user flow for url to be audited
   * @param {string} projectName project name
   * @param {string} url url name
   * @returns user flow for the project and url defined
   */
  this.getUserFlow = async function (projectName, urlName) {
    return new Promise((resolve, reject) => {
      urlsprojects.findOne({ projectName, urlName }, { idKey: 1, projectName: 1, urlName: 1, userFlow: 1 })
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
   * Deletion of user flow for a specified url in a project
   * @param {string} projectName project name of the url
   * @param {string} urlName url to delete user flow
   */
  this.deleteUserFlow = async function (projectName, urlName) {
    return new Promise((resolve, reject) => {
      urlsprojects.updateOne({ projectName, urlName }, { $unset: { userFlow: '' } })
        .then(() => { resolve() })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  this.findUrl = async function (projectName, urlName) {
    return new Promise((resolve, reject) => {
      urlsprojects.find({ projectName, urlName }, { idKey: 1 })
        .then((result) => { resolve(result) })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }
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
      urlsprojects.find(query)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }
}

const urlsProjectRepository = new UrlsProjectRepository()
module.exports = urlsProjectRepository

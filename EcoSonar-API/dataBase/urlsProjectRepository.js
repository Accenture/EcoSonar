const uniqid = require('uniqid')
const urlsprojects = require('./models/urlsprojects')
const greenits = require('./models/greenits')
const bestpractices = require('./models/bestpractices')
const w3cs = require('./models/w3cs')
const lighthouses = require('./models/lighthouses')
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
            const systemError = new SystemError()
            reject(systemError)
          }
        })
    })
  }

  /**
     * deletion on the table urlsProject
     * @param {id url} key
     */
  this.delete = async function (projectNameReq, urlNameReq) {
    let empty = false
    let errDelete = false
    try {
      const idKey = await urlsprojects.find({ projectName: projectNameReq, urlName: urlNameReq }, { idKey: 1 })
      if (idKey.length === 0) {
        empty = true
      } else {
        await greenits.deleteMany({ idUrlGreen: idKey[0].idKey })
        await bestpractices.deleteOne({ idUrl: idKey[0].idKey })
        await w3cs.deleteMany({ idUrlW3c: idKey[0].idKey })
        await lighthouses.deleteMany({ idUrlLighthouse: idKey[0].idKey })
        await urlsprojects.deleteOne({ projectName: projectNameReq, urlName: urlNameReq })
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      errDelete = true
    }
    return new Promise((resolve, reject) => {
      if (errDelete) {
        const systemError = new SystemError()
        reject(systemError)
      } else if (empty) {
        console.log(urlNameReq + ' in ' + projectNameReq + ' not found')
        reject(new Error(urlNameReq + ' in ' + projectNameReq + ' not found'))
      } else {
        console.log('analysis linked to url ' + urlNameReq + ' from ' + projectNameReq + ' were deleted as well as url')
        resolve()
      }
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
   * @param {string} projectName name of the project
   * @param {boolean} getUrlNameOnly retrieve only parameter url from the collection
   */
  this.findAll = async function (projectNameReq, getUrlNameOnly) {
    return new Promise((resolve, reject) => {
      let res
      try {
        if (getUrlNameOnly) {
          res = urlsprojects.find({ projectName: projectNameReq })
        } else {
          res = urlsprojects.find({ projectName: projectNameReq }, { urlName: 1 })
        }
        resolve(res)
      } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', error)
        const systemError = new SystemError()
        reject(systemError)
      }
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
          const systemError = new SystemError()
          reject(systemError)
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
    let systemError = null
    let result
    try {
      result = await urlsprojects.findOne({ projectName, urlName }, { idKey: 1, projectName: 1, urlName: 1, userFlow: 1 })
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error.message)
      console.log(`Error when retrieving user flow for ${urlName}`)
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else {
        resolve(result)
      }
    })
  }

  /**
   * Deletion of user flow for a specified url
   * @param {string} urlName url to delete user flow
   */
  this.deleteUserFlow = async function (projectName, urlName) {
    let systemError = null
    try {
      await urlsprojects.updateOne({ projectName, urlName }, { $unset: { userFlow: '' } })
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error.message)
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        console.log('error during deletion of user flow for ' + urlName)
        reject(systemError)
      } else {
        resolve()
      }
    })
  }
}

const urlsProjectRepository = new UrlsProjectRepository()
module.exports = urlsProjectRepository

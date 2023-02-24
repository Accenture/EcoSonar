const uniqid = require('uniqid')
const urlsprojects = require('./models/urlsprojects')
const greenits = require('./models/greenits')
const bestpractices = require('./models/bestpractices')
const w3cs = require('./models/w3cs')
const lighthouses = require('./models/lighthouses')
const SystemError = require('../utils/SystemError')

const UrlsProjectRepository = function () {
  /**
   * insertion of one or more url on the table urlsProject : OK
   * @param {*} values
   * @returns
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
     * deletion on the table urlsProject : OK
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
   * display all urls of a project : OK
   * @param {name of the project} projectName
   */
  this.findAll = async function (projectNameReq, insert) {
    return new Promise((resolve, reject) => {
      let res
      try {
        if (insert) {
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
   * @param {urlObject} urlsProject previously registered
   * @param {userFlow} user flow to be saved
   * @returns
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
   * @param {urlName} url to find user flow
   * @returns
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
   * @param {urlName} url to delete user flow
   * @returns
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

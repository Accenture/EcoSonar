import uniqid from 'uniqid'
import tempurlsproject from './models/tempurlsproject.js'
import SystemError from '../utils/SystemError.js'

const TempUrlsProjectRepository = function () {
  /**
   * insertion of urls crawled for the project in the collection temporaryurlsProject
   * @param {string} projectName project name
   * @param {Array} urls urls crawled to be saved
   */
  this.create = async function (projectName, urls) {
    return new Promise((resolve, reject) => {
      tempurlsproject.create({
        idKey: uniqid(),
        projectName,
        urlsList: urls
      })
        .then(() => { resolve() })
        .catch((err) => {
          console.error('\x1b[31m%s\x1b[0m', err)
          reject(new SystemError())
        })
    })
  }

  /**
   * update of urls crawled for the project in the collection temporaryurlsProject
   * @param {string} projectName project name
   * @param {Array} urls urls crawled to be saved
   */
  this.updateUrls = async function (projectName, urls) {
    return new Promise((resolve, reject) => {
      tempurlsproject.updateOne({ projectName: { $eq: projectName } }, { urlsList: urls })
        .then(() => { resolve() })
        .catch((err) => {
          console.error('\x1b[31m%s\x1b[0m', err)
          reject(new SystemError())
        })
    })
  }

  /**
   * get urls crawled for the project in the collection temporaryurlsProject
   * @param {string} projectName project name
   * @returns list of urls crawled
   */
  this.findUrls = async function (name) {
    return new Promise((resolve, reject) => {
      tempurlsproject.findOne({ projectName: { $eq: name } })
        .then((result) => { resolve(result) })
        .catch((err) => {
          console.error('\x1b[31m%s\x1b[0m', err)
          reject(new SystemError())
        })
    })
  }

  /**
   * deletion of all temporary urls for the project
   * @param {string} projectName name of the project
   */
  this.deleteProject = async function (projectName) {
    return new Promise((resolve, reject) => {
      tempurlsproject.deleteOne({ projectName: { $eq: projectName } })
        .then((result) => {
          console.log(`DELETE URLS PROJECT - On tempurlsproject project ${projectName} removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }
}

const tempurlsProjectRepository = new TempUrlsProjectRepository()
export default tempurlsProjectRepository

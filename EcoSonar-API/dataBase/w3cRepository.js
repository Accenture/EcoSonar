
const SystemError = require('../utils/SystemError')
const w3cs = require('./models/w3cs')

const W3cRepository = function () {
  /**
   * Insert the w3c analysis for a project
   * @param {reportsW3c} reportW3c is a list of the report for the w3c analysis
   */
  this.insertAll = function (reportsW3c) {
    return new Promise((resolve, reject) => {
      if (reportsW3c.length > 0) {
        w3cs
          .insertMany(reportsW3c)
          .then(() => {
            resolve()
          })
          .catch((err) => {
            console.error('\x1b[31m%s\x1b[0m', err)
            reject(new SystemError())
          })
      } else {
        console.log('W3C - None of the urls analysed could be inserted')
        reject(
          new Error('W3C - None of the urls analysed could be inserted')
        )
      }
    })
  }

  /**
  * find all w3c analysis saved in EcoSonar
  * @returns list of w3c analysis
  */
  this.findAllAnalysis = async function () {
    return new Promise((resolve, reject) => {
      w3cs.find({}, {
        idUrlW3c: 1,
        dateW3cAnalysis: 1,
        score: 1
      })
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find w3c analysis for one url in a project
   * @param {string} urlIdKey id key of the url saved
   * @returns w3c analysis for the URL
   */
  this.findAnalysisUrl = async function (urlIdKey) {
    return new Promise((resolve, reject) => {
      w3cs.find({ idUrlW3c: urlIdKey },
        {
          idUrlW3c: 1,
          dateW3cAnalysis: 1,
          score: 1,
          w3cBestPractices: 1
        }
      )
        .sort({ dateW3cAnalysis: 1 })
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
   * find  w3c analysis for one Project
   * @param {array} urls list of urls id keys
   * @returns  w3c analysis for the project
   */
  this.findAnalysisProject = async function (listIdKey) {
    return new Promise((resolve, reject) => {
      w3cs
        .find(
          { idUrlW3c: listIdKey },
          {
            idUrlW3c: 1,
            dateW3cAnalysis: 1,
            score: 1,
            w3cBestPractices: 1
          }
        )
        .sort({ dateW3cAnalysis: 1 })
        .then((result) => { resolve(result) })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    }
    )
  }

  /**
   * Deletion of all w3c analysis for a url
   * @param {Object} url url to be deleted
   */
  this.deleteAnalysisFromUrl = async function (url) {
    return new Promise((resolve, reject) => {
      w3cs.deleteMany({ idUrlW3c: url[0].idKey })
        .then((result) => {
          console.log(`DELETE URL - On W3C ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Deletion of all w3c analysis for a project
   * @param {string} urlIdKeyList list of id key representing url saved
   */
  this.deleteProject = async function (urlIdKeyList) {
    return new Promise((resolve, reject) => {
      w3cs.deleteMany({ idUrlW3c: { $in: urlIdKeyList } })
        .then((result) => {
          console.log(`DELETE URLS PROJECT - On W3C ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }
}

const w3cRepository = new W3cRepository()
module.exports = w3cRepository

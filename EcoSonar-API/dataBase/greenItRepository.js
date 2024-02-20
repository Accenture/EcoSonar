const greenits = require('./models/greenits')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')

const GreenItRepository = function () {
  /**
   * insertion of one or more greenit analysis
   * @param {Array} reports reports to add
   */
  this.insertAll = async function (reports) {
    if (reports.length > 0) { reports = await checkValues(reports) }

    return new Promise((resolve, reject) => {
      if (reports.length > 0) {
        greenits
          .insertMany(reports)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            console.error('\x1b[31m%s\x1b[0m', error)
            console.log('GREENIT - error during insertion of analysis')
            const systemError = new SystemError()
            reject(systemError)
          })
      } else {
        console.log('GREENIT - None of the urls analysed could be inserted')
        reject(new Error('GREENIT - None of the urls analysed could be inserted'))
      }
    })
  }

  /**
  * find all GreenIT analysis saved in EcoSonar
  * @returns greenit reports
  */
  this.findAllAnalysis = async function () {
    return new Promise((resolve, reject) => {
      greenits.find({}, { dateGreenAnalysis: 1, ecoIndex: 1, idUrlGreen: 1 })
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
   * find last greenit analysis for one url
   * @param {string} urlIdKey id key of the url saved
   * @returns last greenit analysis of a url
   */
  this.findAnalysisUrl = async function (urlIdKey) {
    return new Promise((resolve, reject) => {
      greenits
        .find({ idUrlGreen: urlIdKey }, { domSize: 1, nbRequest: 1, responsesSize: 1, dateGreenAnalysis: 1, ecoIndex: 1, grade: 1 })
        .sort({ dateGreenAnalysis: 1 })
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
   * find  greenit analysis for one Project
   * @param {array} listIdKey list of urls id keys
   * @returns  greenit analysis of a project
   */
  this.findAnalysisProject = async function (listIdKey) {
    return new Promise((resolve, reject) => {
      greenits.find({ idUrlGreen: listIdKey }, { ecoIndex: 1, nbRequest: 1, domSize: 1, responsesSize: 1, dateGreenAnalysis: 1 })
        .sort({ dateGreenAnalysis: 1 })
        .then((result) => { resolve(result) })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find scores from  analysis for one Project
   * @param {array} listIdKey list of urls id keys
   * @returns scores of  analysis
   */
  this.findScoreProject = async function (listIdKey) {
    return new Promise((resolve, reject) => {
      greenits.find({ idUrlGreen: listIdKey }, { ecoIndex: 1, dateGreenAnalysis: 1 })
        .sort({ dateGreenAnalysis: 1 })
        .then((result) => { resolve(result) })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Deletion of all greenit analysis for a url
   * @param {Object} url url to be deleted
   */
  this.deleteAnalysisFromUrl = async function (url) {
    return new Promise((resolve, reject) => {
      greenits.deleteMany({ idUrlGreen: url[0].idKey })
        .then((result) => {
          console.log(`DELETE URL - On GreenIt ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Deletion of all greenIt analysis for a project
   * @param {string} urlIdKeyList list of id key representing url saved
   */
  this.deleteProject = async function (urlIdKeyList) {
    return new Promise((resolve, reject) => {
      greenits.deleteMany({ idUrlGreen: { $in: urlIdKeyList } })
        .then((result) => {
          console.log(`DELETE URLS PROJECT - On GreenIt ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }
}

/**
 *
 * @param {Array} arrayToInsert
 * @returns an array cleaned of analysis containing undefined and NaN to avoid mongoose rejecting every GreenIt analysis insertion
 */
async function checkValues (arrayToInsert) {
  const arrayToInsertSanitized = []
  for (const analysis of arrayToInsert) {
    if (!Object.values(analysis).includes(undefined) || !Object.values(analysis).includes(NaN)) {
      arrayToInsertSanitized.push(analysis)
    } else {
      await urlsprojects.find({ idKey: analysis.idUrlGreen })
        .then((result) => {
          console.warn(`GREENIT INSERT - Url  ${result[0].urlName} cannot be inserted due to presence of NaN or undefined values`)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
  return arrayToInsertSanitized
}

const greenItRepository = new GreenItRepository()
module.exports = greenItRepository

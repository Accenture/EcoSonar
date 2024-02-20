const bestpractices = require('./models/bestpractices')
const SystemError = require('../utils/SystemError')

const BestPracticesRepository = function () {
  /**
   * Insert best practices
   * @param {Array} reports array containing the result of greenIt analysis (including metrics and best practices)
   */
  this.insertBestPractices = async function (reports) {
    if (reports.length > 0) {
      reports = checkValues(reports)
    }
    reports = reports.map((report) => replaceDotWithUnderscoreInKeys(report))

    return new Promise((resolve, reject) => {
      if (reports.length > 0) {
        bestpractices
          .insertMany(reports)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            console.error('\x1b[31m%s\x1b[0m', error)
            reject(new SystemError())
          })
      } else {
        console.log('None of the urls analyzed could be inserted')
        reject(new Error('None of the urls analyzed could be inserted'))
      }
    })
  }

  /**
   * Deletion of all best practices recommendation for a url
   * @param {Object} url url to be deleted
   */
  this.deleteAnalysisFromUrl = async function (url) {
    return new Promise((resolve, reject) => {
      bestpractices.deleteMany({ idUrl: url[0].idKey })
        .then((result) => {
          console.log(`DELETE URL - On best practices ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find All analysis of best practices  for a project on the table bestPractices
   * @param {Array} listIdKey list of urls id keys
   * @returns {Array} best practices reports for the last analysis run on project
   */
  this.findBestPracticesForProject = async function (listIdKey) {
    return new Promise((resolve, reject) => {
      bestpractices
        .find({ idUrl: listIdKey }, { bestPractices: 1, lighthousePerformanceBestPractices: 1, lighthouseAccessibilityBestPractices: 1, dateAnalysisBestPractices: 1 })
        .sort({ dateAnalysisBestPractices: 1 })
        .then((result) => resolve(result))
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find analysis of best practices  for an URL on the table bestPractices
   * @param {string} urlIdKey id key of the url saved
   * @returns {Array} best practices report for the last analysis run on URL
   */
  this.findBestPracticesForUrl = async function (urlIdKey) {
    return new Promise((resolve, reject) => {
      bestpractices
        .find({ idUrl: urlIdKey }, { bestPractices: 1, lighthousePerformanceBestPractices: 1, lighthouseAccessibilityBestPractices: 1, dateAnalysisBestPractices: 1 })
        .sort({ dateAnalysisBestPractices: -1 })
        .limit(1)
        .then((result) => resolve(result))
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Deletion of all best practices analysis for a project
   * @param {string} urlIdKeyList list of id key representing url saved
   */
  this.deleteProject = async function (urlIdKeyList) {
    return new Promise((resolve, reject) => {
      bestpractices.deleteMany({ idUrl: { $in: urlIdKeyList } })
        .then((result) => {
          console.log(`DELETE URLS PROJECT - On best practices ${result.deletedCount} objects removed`)
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
   * @param {Array} urlIdList
   * @param {string} projectName
   * @returns an array cleaned of analysis containing undefined and NaN to avoid mongoose rejecting every GreenIt Best Practices insertion
   * This function check if best practices exists for each url of the report (arrayToInsert), if true then also update urlIdList array to match
   */
function checkValues (arrayToInsert) {
  const arrayToInsertSanitized = []
  for (const analysis of arrayToInsert) {
    if (analysis.bestPractices) {
      arrayToInsertSanitized.push(analysis)
    } else {
      console.warn(`BEST PRACTICES INSERT - Best practices for url  ${analysis.url} cannot be inserted due to presence of NaN or undefined values`)
    }
  }
  return arrayToInsertSanitized
}

function replaceDotWithUnderscoreInKeys (obj) {
  if (typeof obj === 'object' && obj !== null) {
    const newObj = Array.isArray(obj) ? [] : {}

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = key.replace(/\./g, '_')
        const value = obj[key]

        if (typeof value === 'object' && value !== null) {
          // If the value is an object, recursively call the function
          newObj[newKey] = replaceDotWithUnderscoreInKeys(value)
        } else {
          // If the value is not an object, simply assign it to the new key
          newObj[newKey] = value
        }
      }
    }

    return newObj
  } else {
    // If the input is not an object, return it as is
    return obj
  }
}

const bestPracticesRepository = new BestPracticesRepository()
module.exports = bestPracticesRepository

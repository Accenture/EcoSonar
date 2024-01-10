const bestpractices = require('./models/bestpractices')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')

const BestPracticesRepository = function () {
  /**
   * Insert best practices
   * @param {Array} reports array containing the result of greenIt analysis (including metrics and best practices)
   */
  this.insertBestPractices = async function (reports) {
    if (reports.length > 0) { reports = checkValues(reports) }

    return new Promise((resolve, reject) => {
      if (reports.length > 0) {
        bestpractices
          .insertMany(reports)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            console.error('\x1b[31m%s\x1b[0m', error)
            const systemError = new SystemError()
            reject(systemError)
          })
      } else {
        console.log('None of the urls analyzed could be inserted')
        reject(new Error('None of the urls analyzed could be inserted'))
      }
    })
  }

  /**
   * deletion of one or more analysis of best practices on the table bestPractices
   * @param {string} projectNameReq
   */
  this.delete = async function (projectNameReq) {
    let empty = false
    let errDelete = false
    let resAnalysis
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        empty = true
      } else {
        const listIdKey = resList.map((url) => url.idKey)
        resAnalysis = await bestpractices.deleteMany({ idUrl: listIdKey })
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      errDelete = true
    }
    return new Promise((resolve, reject) => {
      if (errDelete) {
        const systemError = new SystemError()
        console.log('error during deletion of best practices analysis in ' + projectNameReq)
        reject(systemError)
      } else if (empty) {
        console.log('Best practices analysis for ' + projectNameReq + ' not found')
        reject(new Error('Best practices analysis for ' + projectNameReq + ' not found'))
      } else {
        if (resAnalysis.deletedCount >= 1) {
          console.log('Best practices analysis of project ' + projectNameReq + ' where deleted')
        } else {
          console.log('no best practices analysis found in ' + projectNameReq)
        }
        resolve()
      }
    })
  }

  /**
   * find All analysis of best practices  for a project on the table bestPractices
   * @param {string} projectNameReq
   * @returns {Array} best practices reports for the last analysis run on project
   */
  this.findAll = async function (projectNameReq) {
    let hasNoUrl = false
    let systemError = null
    let results = []
    let latestBestPracticeReports = []
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        hasNoUrl = true
      } else {
        let i = 0
        const listIdKey = []
        while (i < resList.length) {
          listIdKey[i] = resList[i].idKey
          i++
        }
        results = await bestpractices
          .find({ idUrl: listIdKey }, { bestPractices: 1, lighthousePerformanceBestPractices: 1, lighthouseAccessibilityBestPractices: 1, dateAnalysisBestPractices: 1 })
          .sort({ dateAnalysisBestPractices: 1 })
        const latestBestPracticeDate = new Date(
          Math.max(...results.map(element => { return new Date(element.dateAnalysisBestPractices) }))
        )
        latestBestPracticeReports = results.filter(element => element.dateAnalysisBestPractices.getTime() === latestBestPracticeDate.getTime())
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log('error during generation of ' + projectNameReq + ' best practices analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (hasNoUrl) {
        reject(new Error('No analysis found for project' + projectNameReq))
      } else {
        resolve(latestBestPracticeReports)
      }
    })
  }

  /**
   * find analysis of best practices  for an URL on the table bestPractices
   * @param {string} projectName
   * @param {string} urlName
   * @returns {Array} best practices reports for the last analysis run on URL
   */
  this.find = async function (projectName, urlName) {
    let hasNoUrl = false
    let systemError = null
    let result
    try {
      const resList = await urlsprojects.find({ projectName, urlName }, { idKey: 1 })
      if (resList.length < 1) {
        hasNoUrl = true
      } else {
        result = await bestpractices
          .find({ idUrl: resList[0].idKey }, { bestPractices: 1, lighthousePerformanceBestPractices: 1, lighthouseAccessibilityBestPractices: 1, dateAnalysisBestPractices: 1 })
          .sort({ dateAnalysisBestPractices: -1 })
          .limit(1)
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log(`Error during generation of ${urlName} best practices analysis`)
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (hasNoUrl) {
        reject(new Error(`No analysis found for url ${urlName} into project ${projectName}`))
      } else {
        resolve(result)
      }
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
      console.log(`BEST PRACTICES INSERT - Best practices for url  ${analysis.url} cannot be inserted due to presence of NaN or undefined values`)
    }
  }
  return arrayToInsertSanitized
}

const bestPracticesRepository = new BestPracticesRepository()
module.exports = bestPracticesRepository

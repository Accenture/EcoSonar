const uniqid = require('uniqid')
const bestpractices = require('./models/bestpractices')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')

const BestPracticesRepository = function () {
  /**
   * Insert best practices
   * @param {Array} reports array containing the result of greenIt analysis (including metrics and best practices)
   * @param {Array} urlIdList array of urls ID
   * @param {String} projectName name of the project
   */
  this.insertBestPractices = async function (reports, lighthousePerformanceBestPractices, lighthouseAccessibilityBestPractices, urlIdList, projectName) {
    const arrayToInsert = []
    let i = 0
    let idAnalysisBestPractices, string
    const date = Date.now()
    if (reports.length > 0) {
      const sanitizedValues = await checkValues(reports, urlIdList, projectName)
      reports = sanitizedValues.arrayToInsertSanitized
      urlIdList = sanitizedValues.urlIdListSanitized
    }

    while (i < reports.length) {
      idAnalysisBestPractices = uniqid()
      const bestPracticesFormatted = Object.fromEntries(
        Object.entries(reports[i].bestPractices).map(([key, value]) => [key.charAt(0).toLowerCase() + key.slice(1), value])
      )
      string = {
        idAnalysisBestPractices,
        idUrl: urlIdList[i],
        dateAnalysisBestPractices: date,
        bestPractices: bestPracticesFormatted,
        lighthousePerformanceBestPractices: lighthousePerformanceBestPractices[i],
        lighthouseAccessibilityBestPractices: lighthouseAccessibilityBestPractices[i]
      }
      arrayToInsert.push(string)

      i++
    }

    return new Promise((resolve, reject) => {
      if (arrayToInsert.length > 0) {
        bestpractices.insertMany(arrayToInsert)
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
   * @param {name of the project} projectNameReq
   * @returns
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
        const listIdKey = resList.map(url => url.idKey)
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
   * @param {name of the project} projectNameReq
   * @returns
   */
  this.findAll = async function (projectNameReq) {
    let hasNoUrl = false
    let systemError = null
    let resultats
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        hasNoUrl = true
      } else {
        // create a list of idKey
        let i = 0
        const listIdKey = []
        while (i < resList.length) {
          listIdKey[i] = resList[i].idKey
          i++
        }
        resultats = await bestpractices.find({ idUrl: listIdKey }, { bestPractices: 1, lighthousePerformanceBestPractices: 1, lighthouseAccessibilityBestPractices: 1, dateAnalysisBestPractices: 1 }).sort({ dateAnalysisBestPractices: -1 })
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
        resolve(resultats)
      }
    })
  }

  /**
   * find analysis of best practices  for an URL on the table bestPractices
   * @param {name of the project} projectName
   * @param {url} urlName
   * @returns
   */
  this.find = async function (projectName, urlName) {
    const hasNoUrl = false
    let systemError = null
    let resultats
    try {
      const resList = await urlsprojects.find({ projectName, urlName }, { idKey: 1 })
      resultats = await bestpractices.find({ idUrl: resList[0].idKey }, { bestPractices: 1, lighthousePerformanceBestPractices: 1, lighthouseAccessibilityBestPractices: 1, dateAnalysisBestPractices: 1 }).sort({ dateAnalysisBestPractices: -1 }).limit(1)
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
        resolve(resultats)
      }
    })
  }

  /**
 *
 * @param {Array} arrayToInsert
 * @param {Array} urlIdList
 * @param {String} projectName
 * @returns an array cleaned of analysis containing undefined and NaN to avoid mongoose rejecting every GreenIt Best Practices insertion
 * This function check if best practices exists for each url of the report (arrayToInsert), if true then also update urlIdList array to match
 */
  async function checkValues (arrayToInsert, urlIdList, projectName) {
    const arrayToInsertSanitized = []
    const urlIdListSanitized = []
    for (const analysis of arrayToInsert) {
      if (analysis.bestPractices) {
        arrayToInsertSanitized.push(analysis)
        const urlInfos = await urlsprojects.find({ projectName, urlName: analysis.url })
        urlIdListSanitized.push(urlIdList.find(element => element === urlInfos[0].idKey))
      } else {
        console.log(`BEST PRACTICES INSERT - Best practices for url  ${analysis.url} cannot be inserted due to presence of NaN or undefined values`)
      }
    }
    return { arrayToInsertSanitized, urlIdListSanitized }
  }
}

const bestPracticesRepository = new BestPracticesRepository()
module.exports = bestPracticesRepository

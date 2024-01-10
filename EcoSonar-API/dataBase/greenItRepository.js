const greenits = require('./models/greenits')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')
const formatGreenItAnalysis = require('../services/format/formatGreenItAnalysis')

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
      greenits.find({})
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
   * @param {string} projectNameReq project name
   * @param {string} urlNameReq URL of the page analyzed
   * @returns last greenit analysis of a url
   */
  this.findAnalysisUrl = async function (projectNameReq, urlNameReq) {
    let res
    let allAnalysis
    let stringErr = null
    let systemError = null
    try {
      res = await urlsprojects.find({ projectName: projectNameReq, urlName: urlNameReq }, { idKey: 1 })
      if (res.length === 0) {
        stringErr = 'url : ' + urlNameReq + ' or project : ' + projectNameReq + ' not found'
      } else {
        allAnalysis = await greenits
          .find({ idUrlGreen: res[0].idKey }, { domSize: 1, nbRequest: 1, responsesSize: 1, dateGreenAnalysis: 1, ecoIndex: 1, grade: 1 })
          .sort({ dateGreenAnalysis: 1 })
        if (allAnalysis.length === 0) {
          stringErr = 'Greenit - no greenit analysis found for ' + urlNameReq
          console.log(stringErr)
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log('An error occured while retrieving analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (stringErr !== null) {
        reject(new Error(stringErr))
      } else {
        const lastAnalysis = {
          domSize: allAnalysis[allAnalysis.length - 1].domSize,
          nbRequest: allAnalysis[allAnalysis.length - 1].nbRequest,
          responsesSize: allAnalysis[allAnalysis.length - 1].responsesSize,
          ecoIndex: allAnalysis[allAnalysis.length - 1].ecoIndex,
          grade: allAnalysis[allAnalysis.length - 1].grade
        }
        let i = 0
        let element
        const deployments = []
        while (i < allAnalysis.length) {
          element = {
            dateGreenAnalysis: allAnalysis[i].dateGreenAnalysis,
            domSize: allAnalysis[i].domSize,
            nbRequest: allAnalysis[i].nbRequest,
            responsesSize: allAnalysis[i].responsesSize,
            ecoIndex: allAnalysis[i].ecoIndex
          }
          deployments.push(element)
          i++
        }
        const formattedDeployments = formatGreenItAnalysis.formatDeploymentsForGraphs(deployments)
        const analysis = { deployments: formattedDeployments, lastAnalysis }
        resolve(analysis)
      }
    })
  }

  /**
   * find last greenit analysis for one Project
   * @param {string} projectNameReq name of the project
   * @returns last greenit analysis of a project
   */
  this.findAnalysisProject = async function (projectNameReq) {
    let stringErr = null
    let systemError = null
    let deployments, results
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        stringErr = 'url or project :' + projectNameReq + ' not found'
      } else {
        // create a list of idKey
        let i = 0
        const listIdKey = []
        while (i < resList.length) {
          listIdKey[i] = resList[i].idKey
          i++
        }
        deployments = await greenits.find({ idUrlGreen: listIdKey }, { ecoIndex: 1, nbRequest: 1, domSize: 1, responsesSize: 1, dateGreenAnalysis: 1 }).sort({ dateGreenAnalysis: 1 })
        if (deployments.length !== 0) {
          const dateLastAnalysis = deployments[deployments.length - 1].dateGreenAnalysis
          const lastAnalysis = deployments.filter((greenitAnalysis) => greenitAnalysis.dateGreenAnalysis.getTime() === dateLastAnalysis.getTime())
          results = { deployments, lastAnalysis }
        } else {
          console.log('Greenit - no greenit analysis found for ' + projectNameReq)
          results = { deployments: [], lastAnalysis: null }
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log('error during generation of ' + projectNameReq + ' analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (stringErr !== null) {
        reject(new Error(stringErr))
      } else {
        resolve(results)
      }
    })
  }

  /**
   * find scores from last analysis for one Project
   * @param {string} projectNameReq name of the project
   * @returns scores of last analysis
   */
  this.findScoreProject = async function (projectNameReq) {
    let stringErr = null
    let systemError = null
    let analysis
    let result = {}
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        stringErr = 'url or project :' + projectNameReq + ' not found'
      } else {
        // create a list of idKey
        let i = 0
        const listIdKey = []
        while (i < resList.length) {
          listIdKey[i] = resList[i].idKey
          i++
        }
        analysis = await greenits.find({ idUrlGreen: listIdKey }, { ecoIndex: 1, dateGreenAnalysis: 1 }).sort({ dateGreenAnalysis: 1 })
        if (analysis.length !== 0) {
          const dateLastAnalysis = analysis[analysis.length - 1].dateGreenAnalysis
          const lastAnalysis = analysis.filter((greenitAnalysis) => greenitAnalysis.dateGreenAnalysis.getTime() === dateLastAnalysis.getTime())
          result = { scores: lastAnalysis }
        } else {
          console.log('Greenit - no greenit analysis found for ' + projectNameReq)
          result = { scores: null }
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log('error during generation of ' + projectNameReq + ' analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (stringErr !== null) {
        reject(new Error(stringErr))
      } else {
        resolve(result)
      }
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

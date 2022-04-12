const uniqid = require('uniqid')
const greenits = require('./models/greenits')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')
const formatGreenItAnalysis = require('../services/format/formatGreenItAnalysis')

const GreenItRepository = function () {
  /**
   * insertion of one or more analysis on the table greenit :OK
   * @param {analysis of url} reports
   * @param {list of id of urls} urlIdList
   * @param {list of urls} urlList
   * @returns
   */
  this.insertAll = async function (reports, urlIdList, urlList) {
    const tab = []
    let i = 0
    let nb
    const date = Date.now()
    let string
    let size
    let sizeUncompress
    let j = 0
    let find = false
    while (i < urlIdList.length) {
      if (urlIdList[i] !== null) {
        j = 0
        while (j < reports.length && !find) {
          if (reports[j].url === urlList[i]) {
            find = true
          } else {
            j++
          }
        }
        find = false
        nb = uniqid()
        size = Math.round(reports[j].responsesSize / 1000)
        sizeUncompress = Math.round(reports[j].responsesSizeUncompress / 1000)
        string = {
          idGreenAnalysis: nb,
          idUrlGreen: urlIdList[i],
          dateGreenAnalysis: date,
          domSize: reports[j].domSize,
          nbRequest: reports[j].nbRequest,
          responsesSize: size,
          responsesSizeUncompress: sizeUncompress,
          ecoIndex: reports[j].ecoIndex,
          grade: reports[j].grade,
          waterConsumption: reports[j].waterConsumption,
          greenhouseGasesEmission: reports[j].greenhouseGasesEmission
        }
        tab.push(string)
      }
      i++
    }
    return new Promise((resolve, reject) => {
      if (tab.length > 0) {
        greenits.insertMany(tab)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            console.log(error)
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
   * find analysis for one url : OK
   * @param {project Name} projectNameReq
   * @param {url Name} urlNameReq
   * @returns
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
        allAnalysis = await greenits.find({ idUrlGreen: res[0].idKey }, { domSize: 1, nbRequest: 1, responsesSize: 1, dateGreenAnalysis: 1, greenhouseGasesEmission: 1, waterConsumption: 1, ecoIndex: 1, grade: 1 }).sort({ dateGreenAnalysis: 1 })
        if (allAnalysis.length === 0) {
          stringErr = 'no greenit analysis found for ' + urlNameReq
        }
      }
    } catch (err) {
      console.log(err)
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
          grade: allAnalysis[allAnalysis.length - 1].grade,
          waterConsumption: allAnalysis[allAnalysis.length - 1].waterConsumption,
          greenhouseGasesEmission: allAnalysis[allAnalysis.length - 1].greenhouseGasesEmission
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
        const analysis = { deployments: formattedDeployments, lastAnalysis: lastAnalysis }
        resolve(analysis)
      }
    })
  }

  /**
   * find analysis for one Project
   * @param {project Name} projectNameReq
   * @param {all deployment = true} alldeployment
   * @returns
   */
  this.findAnalysisProject = async function (projectNameReq) {
    let stringErr = null
    let systemError = null
    let deployments, lastAnalysis, resultats
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
          lastAnalysis = await greenits.find({ idUrlGreen: listIdKey, dateGreenAnalysis: deployments[deployments.length - 1].dateGreenAnalysis })
          resultats = { deployments: deployments, lastAnalysis: lastAnalysis }
        } else {
          resultats = { deployments: [], lastAnalysis: null }
        }
      }
    } catch (err) {
      console.log(err)
      console.log('error during generation of ' + projectNameReq + ' analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (stringErr !== null) {
        reject(new Error(stringErr))
      } else {
        resolve(resultats)
      }
    })
  }
}
const greenItRepository = new GreenItRepository()
module.exports = greenItRepository

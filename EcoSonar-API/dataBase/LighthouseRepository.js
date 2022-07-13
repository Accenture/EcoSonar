const lighthouses = require('./models/lighthouses')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')
const formatLighthouseAnalysis = require('../services/format/formatLighthouseAnalysis')

const LighthouseRepository = function () {
  /**
   * insertion of one or more analysis on the table lighthouse :OK
   * @param {analysis of url} reports
   * @param {list of id of urls} urlIdList
   * @param {list of urls} urlList
   * @returns
   */
  this.insertAll = function (tab) {
    return new Promise((resolve, reject) => {
      if (tab.length > 0) {
        lighthouses
          .insertMany(tab)

          .then(() => {
            resolve()
          })
          .catch((err) => {
            console.error('\x1b[31m%s\x1b[0m', 'LIGHTHOUSE - error during insertion of analysis')
            console.error('\x1b[31m%s\x1b[0m', err.message)
            const systemError = new SystemError()
            reject(systemError)
          })
      } else {
        console.log('LIGHTHOUSE - None of the urls analysed could be inserted')
        reject(
          new Error('LIGHTHOUSE - None of the urls analysed could be inserted')
        )
      }
    })
  }

  /**
   * find analysis for one url
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
      res = await urlsprojects.find(
        { projectName: projectNameReq, urlName: urlNameReq },
        { idKey: 1 }
      )
      if (res.length === 0) {
        stringErr =
          'url : ' +
          urlNameReq +
          ' or project : ' +
          projectNameReq +
          ' not found'
      } else {
        allAnalysis = await lighthouses
          .find(
            { idUrlLighthouse: res[0].idKey },
            {
              dateLighthouseAnalysis: 1,
              performance: 1,
              accessibility: 1,
              cumulativeLayoutShift: 1,
              largestContentfulPaint: 1,
              firstContentfulPaint: 1,
              speedIndex: 1,
              totalBlockingTime: 1,
              interactive: 1
            }
          )
          .sort({ dateLighthouseAnalysis: 1 })
        if (allAnalysis.length === 0) {
          stringErr = 'no lighthouse analysis found for ' + urlNameReq
          console.log(stringErr)
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log('An error occured while retrieving lighthouse analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (stringErr !== null) {
        reject(new Error(stringErr))
      } else {
        const lastAnalysis = {
          dateLighthouseAnalysis:
            allAnalysis[allAnalysis.length - 1].dateLighthouseAnalysis,
          performance: allAnalysis[allAnalysis.length - 1].performance,
          accessibility: allAnalysis[allAnalysis.length - 1].accessibility,
          cumulativeLayoutShift: allAnalysis[allAnalysis.length - 1].cumulativeLayoutShift,
          largestContentfulPaint: allAnalysis[allAnalysis.length - 1].largestContentfulPaint,
          firstContentfulPaint: allAnalysis[allAnalysis.length - 1].firstContentfulPaint,
          speedIndex: allAnalysis[allAnalysis.length - 1].speedIndex,
          totalBlockingTime: allAnalysis[allAnalysis.length - 1].totalBlockingTime,
          interactive: allAnalysis[allAnalysis.length - 1].interactive
        }

        replaceComma(lastAnalysis)

        let i = 0
        let element
        const deployments = []
        while (i < allAnalysis.length) {
          element = {
            dateAnalysis: allAnalysis[i].dateLighthouseAnalysis,
            performanceScore: allAnalysis[i].performance.score,
            accessibilityScore: allAnalysis[i].accessibility.score,
            cumulativeLayoutShift: allAnalysis[i].cumulativeLayoutShift.score,
            largestContentfulPaint: allAnalysis[i].largestContentfulPaint.score,
            firstContentfulPaint: allAnalysis[i].firstContentfulPaint.score,
            speedIndex: allAnalysis[i].speedIndex.score,
            totalBlockingTime: allAnalysis[i].totalBlockingTime.score,
            interactive: allAnalysis[i].interactive.score
          }
          deployments.push(element)
          i++
        }

        const formattedDeployments = formatLighthouseAnalysis.formatDeploymentsForGraphs(deployments)

        const analysis = { deployments: formattedDeployments, lastAnalysis: lastAnalysis }
        resolve(analysis)
      }
    })
    function replaceComma (JSON) {
      let j = 0
      while (j < Object.values(JSON).length) {
        if (!JSON.totalBlockingTime) {
          if (Object.values(JSON)[j].displayValue) {
            Object.values(JSON)[j].displayValue = Object.values(JSON)[j].displayValue.replace(',', '.')
          }
        } else {
          if (Object.values(JSON)[j].displayValue) {
            Object.values(JSON)[j].displayValue = Object.values(JSON)[j].displayValue.replace(',', '')
          }
        }

        j++
      }
    }
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
    let deployments, resultats
    try {
      const resList = await urlsprojects.find(
        { projectName: projectNameReq },
        { idKey: 1 }
      )
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

        deployments = await lighthouses
          .find(
            { idUrlLighthouse: listIdKey },
            {
              performance: 1,
              accessibility: 1,
              largestContentfulPaint: 1,
              cumulativeLayoutShift: 1,
              firstContentfulPaint: 1,
              speedIndex: 1,
              totalBlockingTime: 1,
              interactive: 1,
              dateLighthouseAnalysis: 1
            }
          )
          .sort({ dateLighthouseAnalysis: 1 })

        if (deployments.length !== 0) {
          const dateLastAnalysis =
            deployments[deployments.length - 1].dateLighthouseAnalysis
          const lastDeployment = deployments.filter(
            (deployment) =>
              deployment.dateLighthouseAnalysis.getTime() ===
              dateLastAnalysis.getTime()
          )
          resultats = {
            deployments: deployments,
            lastAnalysis: lastDeployment
          }
        } else {
          console.log('no lighthouse analysis found for ' + projectNameReq)
          resultats = { deployments: [], lastAnalysis: null }
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log(
        'error during generation of ' + projectNameReq + ' lighthouse analysis'
      )
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

const lighthouseRepository = new LighthouseRepository()
module.exports = lighthouseRepository

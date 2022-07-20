const greenItRepository = require('../dataBase/greenItRepository')
const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const urlsProjectRepository = require('../dataBase/urlsProjectRepository')
const lighthouseRepository = require('../dataBase/lighthouseRepository')
const lighthouseAnalysis = require('./lighthouse/lighthouse')
const formatLighthouseMetrics = require('./format/formatLighthouseMetrics')
const uniqid = require('uniqid')
const greenItAnalysis = require('./greenit-analysis/analyseService')
const formatLighthouseAnalysis = require('./format/formatLighthouseAnalysis')
const SystemError = require('../utils/SystemError')
const formatGreenItAnalysis = require('./format/formatGreenItAnalysis')
const formatLighthouseBestPractices = require('./format/formatLighthouseBestPractices')

class AnalysisService {}

/**
 * Insert a new analysis into database
 * @param {string} projectName
 * @param {boolean} autoscroll is used to enable autoscrolling for each tab opened during analysis
 */
AnalysisService.prototype.insert = async function (projectName, autoscroll) {
  let urlProjectList = []
  try {
    urlProjectList = await urlsProjectRepository.findAll(projectName, true)
  } catch (error) {
    console.log('GREENIT INSERT - can not retrieved urls from project')
  }

  let urlIdList = []
  let reportsGreenit = []
  let reportsLighthouse = []
  let urlList = []
  if (urlProjectList.length !== 0) {
    urlIdList = urlProjectList.map((url) => url.idKey)
    urlList = urlProjectList.map((url) => url.urlName)
    try {
      reportsGreenit = await greenItAnalysis.analyse(urlList, autoscroll)
    } catch (error) {
      console.log(error)
    }
    try {
      reportsLighthouse = await lighthouseAnalysis.lighthouseAnalysis(urlList)
    } catch (error) {
      console.log(error)
    }
  }
  const urlIdListGreenit = Object.values(urlIdList)

  const tabLighthouse = []
  let i = 0
  const date = Date.now()
  while (i < urlIdList.length) {
    if (reportsLighthouse[i] && reportsLighthouse[i].runtimeError === undefined) {
      const nb = uniqid()
      const formattedLighthouseMetrics = formatLighthouseMetrics.formatLighthouseMetrics(reportsLighthouse[i])
      const lighthouseAudit = {
        idLighthouseAnalysis: nb,
        idUrlLighthouse: urlIdList[i],
        dateLighthouseAnalysis: date,
        performance: formattedLighthouseMetrics.performance,
        accessibility: formattedLighthouseMetrics.accessibility,
        largestContentfulPaint: formattedLighthouseMetrics.largestContentfulPaint,
        cumulativeLayoutShift: formattedLighthouseMetrics.cumulativeLayoutShift,
        firstContentfulPaint: formattedLighthouseMetrics.firstContentfulPaint,
        speedIndex: formattedLighthouseMetrics.speedIndex,
        totalBlockingTime: formattedLighthouseMetrics.totalBlockingTime,
        interactive: formattedLighthouseMetrics.interactive
      }
      tabLighthouse.push(lighthouseAudit)
    }
    i++
  }

  let j = 0
  const lighthousePerformanceBestPractices = []
  const lighthouseAccessibilityBestPractices = []
  while (j < urlIdList.length) {
    if (reportsLighthouse[j] && reportsLighthouse[j].runtimeError === undefined) {
      lighthousePerformanceBestPractices[j] = formatLighthouseBestPractices.formatPerformance(reportsLighthouse[j])
      lighthouseAccessibilityBestPractices[j] = formatLighthouseBestPractices.formatAccessibility(reportsLighthouse[j])
    }
    j++
  }

  if (urlProjectList.length !== 0) {
    greenItRepository
      .insertAll(reportsGreenit, urlIdListGreenit, urlList)
      .then(() => {
        console.log('GREENIT INSERT - analysis has been insert')
      })
      .catch(() => {
        console.log('GREENIT INSERT - greenit insertion failed')
      })
    lighthouseRepository
      .insertAll(tabLighthouse)
      .then(() => {
        console.log('LIGHTHOUSE INSERT - analysis has been insert')
      })
      .catch(() => {
        console.log('LIGHTHOUSE INSERT - lighthouse insertion failed')
      })

    bestPracticesRepository
      .insertBestPractices(reportsGreenit, lighthousePerformanceBestPractices, lighthouseAccessibilityBestPractices, urlIdListGreenit, projectName)
      .then(() => {
        console.log('BEST PRACTICES INSERT - best practices have been inserted')
      })
      .catch(() => {
        console.log('BEST PRACTICES INSERT : best practice insertion failed')
      })
  } else {
    console.log('No url found for project : ' + projectName)
  }
}

/**
 * Get an analysis (GreenIt & Lighthouse) from a given project and URL
 * @param {string} projectName
 * @param {string} urlName
 * @returns {Object} Returns a formatted analysis
 */

AnalysisService.prototype.getUrlAnalysis = async function (projectName, urlName) {
  let greenitAnalysis = null
  let lighthouseResult = null
  let errorRetrievedGreenItAnalysis = null
  let errorRetrievedLighthouseAnalysis = null
  await greenItRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      greenitAnalysis = result
    })
    .catch((err) => {
      errorRetrievedGreenItAnalysis = err
    })
  await lighthouseRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      lighthouseResult = result
    })
    .catch((err) => {
      errorRetrievedLighthouseAnalysis = err
    })
  return new Promise((resolve, reject) => {
    let date = null
    if (errorRetrievedGreenItAnalysis === null && errorRetrievedLighthouseAnalysis === null) {
      if (greenitAnalysis.deployments[greenitAnalysis.deployments.length - 1].dateAnalysis.getTime() < lighthouseResult.lastAnalysis.dateLighthouseAnalysis.getTime()) {
        date = greenitAnalysis.deployments[greenitAnalysis.deployments.length - 1].dateGreenAnalysis
      } else {
        date = lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      }
      delete lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      const analysis = {
        deployments: {
          greenit: greenitAnalysis.deployments,
          lighthouse: lighthouseResult.deployments
        },
        lastAnalysis: {
          dateAnalysis: date,
          greenit: formatGreenItAnalysis.greenItUrlAnalysisFormatted(greenitAnalysis.lastAnalysis),
          lighthouse: lighthouseResult.lastAnalysis
        }
      }
      resolve(analysis)
    } else if (errorRetrievedGreenItAnalysis === null) {
      date = greenitAnalysis.deployments[greenitAnalysis.deployments.length - 1].dateGreenAnalysis
      const analysis = {
        deployments: { greenit: greenitAnalysis.deployments, lighthouse: [] },
        lastAnalysis: {
          dateAnalysis: date,
          greenit: formatGreenItAnalysis.greenItUrlAnalysisFormatted(greenitAnalysis.lastAnalysis),
          lighthouse: null
        }
      }
      resolve(analysis)
    } else if (errorRetrievedLighthouseAnalysis === null) {
      date = lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      delete lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      const analysis = {
        deployments: {
          greenit: [],
          lighthouse: lighthouseResult.deployments
        },
        lastAnalysis: {
          dateAnalysis: date,
          greenit: null,
          lighthouse: lighthouseResult.lastAnalysis
        }
      }
      resolve(analysis)
    } else {
      if (errorRetrievedGreenItAnalysis instanceof SystemError || errorRetrievedLighthouseAnalysis instanceof SystemError) {
        reject(new SystemError())
      } else if (errorRetrievedGreenItAnalysis === errorRetrievedLighthouseAnalysis) {
        reject(errorRetrievedGreenItAnalysis)
      } else {
        reject(new Error('No lighthouse and greenit analysis found for url ' + urlName + ' in project ' + projectName))
      }
    }
  })
}

/**
 * Get an analysis (GreenIt & Lighthouse) from a given project
 * @param {string} projectName
 * @returns {Object} Returns the formatted values with average score for the given project
 */

AnalysisService.prototype.getProjectAnalysis = async function (projectName) {
  let greenitAnalysisDeployments = []
  let greenitLastAnalysis, lighthouseProjectLastAnalysis, dateLighthouseLastAnalysis, dateGreenitLastAnalysis
  let lighthouseAnalysisDeployments = []
  let catchLighthouse = null
  let catchGreenit = null
  let errRetrievedAnalysisGreenit = null
  let errRetrievedLighthouseAnalysis = null

  await greenItRepository
    .findAnalysisProject(projectName)
    .then((res) => {
      if (res.deployments.length !== 0) {
        greenitAnalysisDeployments = formatGreenItAnalysis.formatDeploymentsForGraphs(res.deployments)
        greenitLastAnalysis = formatGreenItAnalysis.greenItProjectLastAnalysisFormatted(res.lastAnalysis)
      } else {
        greenitLastAnalysis = null
        greenitAnalysisDeployments = []
        errRetrievedAnalysisGreenit = 'No greenit analysis found for project ' + projectName
      }
    })
    .catch((err) => {
      catchGreenit = err
    })
  await lighthouseRepository
    .findAnalysisProject(projectName)
    .then((res) => {
      if (res.deployments.length !== 0) {
        // deployments
        lighthouseAnalysisDeployments = formatLighthouseAnalysis.lighthouseAnalysisFormattedDeployments(res.deployments)

        // lastAnalysis
        lighthouseProjectLastAnalysis = formatLighthouseAnalysis.lighthouseProjectLastAnalysisFormatted(res.lastAnalysis)
      } else {
        errRetrievedLighthouseAnalysis = 'No lighthouse Analysis found for project ' + projectName
        lighthouseAnalysisDeployments = []
        lighthouseProjectLastAnalysis = null
      }
    })
    .catch((err) => {
      catchLighthouse = err
    })
  return new Promise((resolve, reject) => {
    if (catchGreenit instanceof SystemError || catchLighthouse instanceof SystemError) {
      reject(new SystemError())
    } else if (catchGreenit !== null || catchLighthouse !== null) {
      reject(new Error('error during generation of ' + projectName + ' analysis'))
    }

    // Setting the analysis date
    if (errRetrievedLighthouseAnalysis === null && errRetrievedAnalysisGreenit === null) {
      dateGreenitLastAnalysis = greenitLastAnalysis.dateAnalysis
      dateLighthouseLastAnalysis = lighthouseProjectLastAnalysis.dateAnalysis
    } else if (errRetrievedLighthouseAnalysis != null && errRetrievedAnalysisGreenit === null) {
      dateGreenitLastAnalysis = greenitLastAnalysis.dateAnalysis
      dateLighthouseLastAnalysis = null
    } else if (errRetrievedAnalysisGreenit != null && errRetrievedLighthouseAnalysis === null) {
      dateGreenitLastAnalysis = null
      dateLighthouseLastAnalysis = lighthouseProjectLastAnalysis.dateAnalysis
    } else {
      reject(new Error('No Analysis found for project ' + projectName))
    }

    // Creating the response content
    const allAnalysis = {
      deployments: {
        greenit: greenitAnalysisDeployments,
        lighthouse: lighthouseAnalysisDeployments
      },
      lastAnalysis: {
        dateGreenitLastAnalysis: dateGreenitLastAnalysis,
        dateLighthouseLastAnalysis: dateLighthouseLastAnalysis,
        greenit: greenitLastAnalysis,
        lighthouse: lighthouseProjectLastAnalysis
      }
    }
    resolve(allAnalysis)
  })
}

const analysisService = new AnalysisService()
module.exports = analysisService

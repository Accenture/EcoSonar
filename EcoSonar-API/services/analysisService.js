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
const w3cAnalysis = require('../services/W3C/w3cAnalysis')
const w3cRepository = require('../dataBase/w3cRepository')
const formatW3cBestPractices = require('./format/formatW3cBestPractices')
const formatW3cAnalysis = require('./format/formatW3cAnalysis')

class AnalysisService {}

/**
 * Insert a new analysis into database
 * @param {string} projectName
 * @param {boolean} autoscroll is used to enable autoscrolling for each tab opened during analysis
 */
AnalysisService.prototype.insert = async function (projectName, autoscroll) {
  const allowExternalAPI = process.env.ECOSONAR_ENV_ALLOW_EXTERNAL_API
  let urlProjectList = []
  try {
    urlProjectList = await urlsProjectRepository.findAll(projectName, true)
  } catch (error) {
    console.log('GREENIT INSERT - can not retrieved urls from project')
  }

  let urlIdList = []
  let reportsGreenit = []
  let reportsLighthouse = []
  let reportsW3c = []
  let urlList = []
  if (urlProjectList.length !== 0) {
    urlIdList = urlProjectList.map((url) => url.idKey)
    urlList = urlProjectList.map((url) => url.urlName)
    try {
      reportsGreenit = await greenItAnalysis.analyse(urlList, autoscroll, projectName)
    } catch (error) {
      console.log(error)
    }
    try {
      reportsLighthouse = await lighthouseAnalysis.lighthouseAnalysis(urlList, projectName)
    } catch (error) {
      console.log(error)
    }
    if (allowExternalAPI === 'true') {
      try {
        reportsW3c = await w3cAnalysis.w3cAnalysisWithAPI(urlList, urlIdList)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('INSERT ANALYSIS - Usage of external API is not allowed, W3C analysis skipped')
    }
  }

  const urlIdListGreenit = Object.values(urlIdList)

  // Lighthouse formatting
  const tabLighthouse = []
  let i = 0
  const date = Date.now()
  while (i < urlIdList.length) {
    if (reportsLighthouse[i] && reportsLighthouse[i].runtimeError === undefined) {
      const idLighthouseAnalysis = uniqid()
      const formattedLighthouseMetrics = formatLighthouseMetrics.formatLighthouseMetrics(reportsLighthouse[i])
      const lighthouseAudit = {
        idLighthouseAnalysis,
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

  // Analysis insertions
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

    if (allowExternalAPI === 'true') {
      reportsW3c = formatW3cBestPractices.formatW3c(reportsW3c)
      for (const report of reportsW3c) {
        report.score = formatW3cAnalysis.calculateScore(report.w3cBestPractices)
      }
      w3cRepository.insertAll(reportsW3c, urlIdList)
        .then(() => {
          console.log('W3C INSERT - analysis has been insert')
        })
        .catch(() => {
          console.log('W3C INSERT - w3c insertion failed')
        })
    }

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
  let greenitAnalysisDeployment
  let lighthouseResultDeployment
  let w3cAnalysisDeployment
  let w3cAnalysisLastAnalysis
  let lighthouseResultLastAnalysis
  let greenitAnalysisLastAnalysis
  let errorRetrievedGreenItAnalysis = null
  let errorRetrievedLighthouseAnalysis = null
  let errorRetrievedW3cAnalysis = null

  // Fetching analysis for each tool
  await w3cRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      w3cAnalysisDeployment = result.deployments
      w3cAnalysisLastAnalysis = result.w3cLastAnalysis
    })
    .catch((err) => {
      errorRetrievedW3cAnalysis = err
      w3cAnalysisDeployment = []
      w3cAnalysisLastAnalysis = null
    })

  await greenItRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      greenitAnalysisDeployment = result.deployments
      greenitAnalysisLastAnalysis = formatGreenItAnalysis.greenItUrlAnalysisFormatted(result.lastAnalysis)
    })
    .catch((err) => {
      errorRetrievedGreenItAnalysis = err
      greenitAnalysisDeployment = []
      greenitAnalysisLastAnalysis = null
    })
  await lighthouseRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      lighthouseResultDeployment = result.deployments
      lighthouseResultLastAnalysis = formatLighthouseAnalysis.lighthouseUrlAnalysisFormatted(result.lastAnalysis)
    })
    .catch((err) => {
      errorRetrievedLighthouseAnalysis = err
      lighthouseResultDeployment = []
      lighthouseResultLastAnalysis = null
    })

  // Creating the response content
  return new Promise((resolve, reject) => {
    if (errorRetrievedGreenItAnalysis instanceof SystemError || errorRetrievedLighthouseAnalysis instanceof SystemError || errorRetrievedW3cAnalysis instanceof SystemError) {
      reject(new SystemError())
    } else if (errorRetrievedGreenItAnalysis !== null && errorRetrievedLighthouseAnalysis !== null && errorRetrievedW3cAnalysis !== null) {
      reject(new Error('No analysis found for url ' + urlName + ' in project ' + projectName))
    }
    const analysis = {
      deployments: {
        greenit: greenitAnalysisDeployment,
        lighthouse: lighthouseResultDeployment,
        w3c: w3cAnalysisDeployment
      },
      lastAnalysis: {
        greenit: greenitAnalysisLastAnalysis,
        lighthouse: lighthouseResultLastAnalysis,
        w3c: w3cAnalysisLastAnalysis
      }
    }
    resolve(analysis)
  })
}

/**
 * Get an analysis (GreenIt & Lighthouse) from a given project
 * @param {string} projectName
 * @returns {Object} Returns the formatted values with average score for the given project
 */

AnalysisService.prototype.getProjectAnalysis = async function (projectName) {
  let greenitAnalysisDeployments = []
  let lighthouseAnalysisDeployments = []
  let w3cAnalysisDeployment = []
  let greenitLastAnalysis, lighthouseProjectLastAnalysis, w3cProjectLastAnalysis
  let catchLighthouse = null
  let catchGreenit = null
  let catchW3c = null
  let errRetrievedAnalysisGreenit = null
  let errRetrievedLighthouseAnalysis = null
  let errRetrievedW3cAnalysis = null

  await greenItRepository
    .findAnalysisProject(projectName)
    .then((res) => {
      if (res.deployments.length !== 0) {
        greenitAnalysisDeployments = formatGreenItAnalysis.formatDeploymentsForGraphs(res.deployments)
        greenitLastAnalysis = formatGreenItAnalysis.greenItProjectLastAnalysisFormatted(res.lastAnalysis)
      } else {
        greenitLastAnalysis = null
        greenitAnalysisDeployments = []
        errRetrievedAnalysisGreenit = 'GET ANALYSIS PROJECT - No greenit analysis found for project ' + projectName
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
        errRetrievedLighthouseAnalysis = 'GET ANALYSIS PROJECT - No lighthouse Analysis found for project ' + projectName
        lighthouseAnalysisDeployments = []
        lighthouseProjectLastAnalysis = null
      }
    })
    .catch((err) => {
      catchLighthouse = err
    })

  await w3cRepository.findAnalysisProject(projectName).then((res) => {
    if (res.deployments.length !== 0) {
      w3cAnalysisDeployment = formatW3cAnalysis.w3cAnalysisFormattedDeployments(res.deployments)

      // lastAnalysis
      w3cProjectLastAnalysis = formatW3cAnalysis.w3cLastAnalysisFormatted(res.lastAnalysis)
    } else {
      errRetrievedW3cAnalysis = 'GET ANALYSIS PROJECT - No W3C Analysis found for project ' + projectName
      w3cAnalysisDeployment = []
      w3cProjectLastAnalysis = null
    }
  })
    .catch((err) => {
      catchW3c = err
    })

  return new Promise((resolve, reject) => {
    if (catchGreenit instanceof SystemError || catchLighthouse instanceof SystemError || catchW3c instanceof SystemError) {
      reject(new SystemError())
    } else if (catchGreenit !== null || catchLighthouse !== null || catchW3c !== null) {
      reject(new Error('GET ANALYSIS PROJECT - error during generation of ' + projectName + ' analysis'))
    }

    if (errRetrievedLighthouseAnalysis && errRetrievedAnalysisGreenit && errRetrievedW3cAnalysis) reject(new Error('GET ANALYSIS PROJECT - No Analysis found for project ' + projectName))

    // Creating the response content
    const allAnalysis = {
      allowW3c: process.env.ECOSONAR_ENV_ALLOW_EXTERNAL_API,
      deployments: {
        greenit: greenitAnalysisDeployments,
        lighthouse: lighthouseAnalysisDeployments,
        w3c: w3cAnalysisDeployment
      },
      lastAnalysis: {

        greenit: greenitLastAnalysis,
        lighthouse: lighthouseProjectLastAnalysis,
        w3c: w3cProjectLastAnalysis
      }
    }
    resolve(allAnalysis)
  })
}

const analysisService = new AnalysisService()
module.exports = analysisService

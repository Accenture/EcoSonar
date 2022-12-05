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
  const date = Date.now()
  let urlProjectList = []
  let reports = []
  let systemError = false
  const analysisLighthouseFormatted = []
  const greenitAnalysisFormatted = []
  const w3cAnalysisFormatted = []
  const lighthousePerformanceBestPractices = []
  const lighthouseAccessibilityBestPractices = []
  const bestPracticesFormatted = []

  try {
    urlProjectList = await urlsProjectRepository.findAll(projectName, true)
  } catch (error) {
    console.log('GREENIT INSERT - can not retrieved urls from project')
    systemError = true
  }

  if (systemError || urlProjectList.length === 0) {
    console.log('GREENIT INSERT - project has no url to do the audit. Audit stopped')
  } else {
    reports = await launchAuditsToUrlList(urlProjectList, autoscroll, projectName, allowExternalAPI)

    // Format greenIT Analysis
    for (const greenItReport of reports.reportsGreenit) {
      if (greenItReport.success) {
        const urlProjectAudited = urlProjectList.filter((urlProject) => urlProject.urlName === greenItReport.url)
        const greenItAnalysis = {
          idGreenAnalysis: uniqid(),
          idUrlGreen: urlProjectAudited[0].idKey,
          dateGreenAnalysis: date,
          domSize: greenItReport.domSize,
          nbRequest: greenItReport.nbRequest,
          responsesSize: Math.round(greenItReport.responsesSize / 1000),
          responsesSizeUncompress: Math.round(greenItReport.responsesSizeUncompress / 1000),
          ecoIndex: greenItReport.ecoIndex,
          grade: greenItReport.grade
        }
        greenitAnalysisFormatted.push(greenItAnalysis)
      }
    }

    // Format Lighthouse Analysis
    for (const lighthouseReport of reports.reportsLighthouse) {
      if (lighthouseReport.runtimeError === undefined) {
        const formattedLighthouseMetrics = formatLighthouseMetrics.formatLighthouseMetrics(lighthouseReport)
        const urlProjectAudited = urlProjectList.filter((urlProject) => urlProject.urlName === lighthouseReport.url)
        const lighthouseAudit = {
          idLighthouseAnalysis: uniqid(),
          idUrlLighthouse: urlProjectAudited[0].idKey,
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
        analysisLighthouseFormatted.push(lighthouseAudit)
        lighthousePerformanceBestPractices.push(formatLighthouseBestPractices.formatPerformance(lighthouseReport))
        lighthouseAccessibilityBestPractices.push(formatLighthouseBestPractices.formatAccessibility(lighthouseReport))
      }
    }

    // Format W3C Analysis
    const reportsW3c = formatW3cBestPractices.formatW3c(reports.reportsW3c)
    for (const w3cReport of reportsW3c) {
      const urlProjectAudited = urlProjectList.filter((urlProject) => urlProject.urlName === w3cReport.url)
      const w3cAnalysis = {
        idW3cAnalysis: uniqid(),
        dateW3cAnalysis: date,
        idUrlW3c: urlProjectAudited[0].idKey,
        score: formatW3cAnalysis.calculateScore(w3cReport.w3cBestPractices),
        w3cBestPractices: w3cReport.w3cBestPractices
      }
      w3cAnalysisFormatted.push(w3cAnalysis)
    }

    // Format Best Practices
    for (const urlProject of urlProjectList) {
      let greenItBestPractices = reports.reportsGreenit.filter((report) => report.url === urlProject.urlName)
      greenItBestPractices = (greenItBestPractices.length > 0 && greenItBestPractices[0].bestPractices !== undefined)
        ? Object.fromEntries(Object.entries(greenItBestPractices[0].bestPractices).map(([key, value]) => [key.charAt(0).toLowerCase() + key.slice(1), value]))
        : {}
      const lighthousePerfBestPractices = lighthousePerformanceBestPractices.filter((report) => report.url === urlProject.urlName)
      const lighthouseAccessBestPractices = lighthouseAccessibilityBestPractices.filter((report) => report.url === urlProject.urlName)

      const bestPracticeFormatted = {
        idAnalysisBestPractices: uniqid(),
        idUrl: urlProject.idKey,
        dateAnalysisBestPractices: date,
        bestPractices: greenItBestPractices,
        lighthousePerformanceBestPractices: lighthousePerfBestPractices.length > 0 ? lighthousePerfBestPractices[0] : {},
        lighthouseAccessibilityBestPractices: lighthouseAccessBestPractices.length > 0 ? lighthouseAccessBestPractices[0] : {}
      }

      if (Object.keys(bestPracticeFormatted.bestPractices).length !== 0 || Object.keys(bestPracticeFormatted.lighthousePerformanceBestPractices).length !== 0 || Object.keys(bestPracticeFormatted.lighthouseAccessibilityBestPractices).length !== 0) {
        bestPracticesFormatted.push(bestPracticeFormatted)
      }
    }

    greenItRepository
      .insertAll(greenitAnalysisFormatted)
      .then(() => {
        console.log('GREENIT INSERT - analysis has been insert')
      })
      .catch(() => {
        console.log('GREENIT INSERT - greenit insertion failed')
      })

    lighthouseRepository
      .insertAll(analysisLighthouseFormatted)
      .then(() => {
        console.log('LIGHTHOUSE INSERT - analysis has been insert')
      })
      .catch(() => {
        console.log('LIGHTHOUSE INSERT - lighthouse insertion failed')
      })

    if (allowExternalAPI === 'true') {
      w3cRepository.insertAll(w3cAnalysisFormatted)
        .then(() => {
          console.log('W3C INSERT - analysis has been insert')
        })
        .catch(() => {
          console.log('W3C INSERT - w3c insertion failed')
        })
    }

    bestPracticesRepository
      .insertBestPractices(bestPracticesFormatted)
      .then(() => {
        console.log('BEST PRACTICES INSERT - best practices have been inserted')
      })
      .catch(() => {
        console.log('BEST PRACTICES INSERT : best practice insertion failed')
      })
  }
}

async function launchAuditsToUrlList (urlProjectList, autoscroll, projectName, allowExternalAPI) {
  let reportsGreenit = []
  let reportsLighthouse = []
  let reportsW3c = []

  const urlList = urlProjectList.map((url) => url.urlName)
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
      reportsW3c = await w3cAnalysis.w3cAnalysisWithAPI(urlList)
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log('INSERT ANALYSIS - Usage of external API is not allowed, W3C analysis skipped')
  }
  return {
    reportsGreenit,
    reportsLighthouse,
    reportsW3c
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

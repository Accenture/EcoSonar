import uniqid from 'uniqid'
import greenItRepository from '../dataBase/greenItRepository.js'
import bestPracticesRepository from '../dataBase/bestPracticesRepository.js'
import urlsProjectRepository from '../dataBase/urlsProjectRepository.js'
import lighthouseRepository from '../dataBase/lighthouseRepository.js'
import lighthouseAnalysis from './lighthouse/lighthouse.js'
import formatLighthouseMetrics from './format/formatLighthouseMetrics.js'
import analyse from './greenit-analysis/analyseService.js'
import formatLighthouseBestPractices from './format/formatLighthouseBestPractices.js'
import w3cAnalysis from '../services/W3C/w3cAnalysis.js'
import w3cRepository from '../dataBase/w3cRepository.js'
import formatW3cBestPractices from './format/formatW3cBestPractices.js'
import formatW3cAnalysis from './format/formatW3cAnalysis.js'

class AnalysisService {}

/**
 * Insert a new analysis into database
 * @param {string} projectName
 * @param {boolean} autoscroll is used to enable autoscrolling for each tab opened during analysis
 */
AnalysisService.prototype.insert = async function (projectName, username, password, autoscroll) {
  const allowExternalAPI = process.env.ECOSONAR_ENV_ALLOW_EXTERNAL_API || 'false'
  let urlProjectList = []
  let reports = []
  let systemError = false

  await urlsProjectRepository.findAll(projectName)
    .then((urls) => { urlProjectList = urls })
    .catch(() => {
      systemError = true
    })

  if (systemError || urlProjectList.length === 0) {
    console.warn('GREENIT INSERT - project has no url to do the audit. Audit stopped')
  } else {
    reports = await launchAuditsToUrlList(urlProjectList, projectName, allowExternalAPI, username, password, autoscroll)
    const reportsFormatted = formatAuditsToBeSaved(reports, urlProjectList)

    greenItRepository
      .insertAll(reportsFormatted.greenitAnalysisFormatted)
      .then(() => {
        console.log('GREENIT INSERT - analysis has been inserted')
      })
      .catch(() => {
        console.error('GREENIT INSERT - greenit insertion failed')
      })

    lighthouseRepository
      .insertAll(reportsFormatted.analysisLighthouseFormatted)
      .then(() => {
        console.log('LIGHTHOUSE INSERT - analysis has been inserted')
      })
      .catch(() => {
        console.error('LIGHTHOUSE INSERT - lighthouse insertion failed')
      })

    if (allowExternalAPI === 'true') {
      w3cRepository.insertAll(reportsFormatted.w3cAnalysisFormatted)
        .then(() => {
          console.log('W3C INSERT - analysis has been inserted')
        })
        .catch(() => {
          console.error('W3C INSERT - w3c insertion failed')
        })
    }

    bestPracticesRepository
      .insertBestPractices(reportsFormatted.bestPracticesFormatted)
      .then(() => {
        console.log('BEST PRACTICES INSERT - best practices have been inserted')
      })
      .catch(() => {
        console.error('BEST PRACTICES INSERT : best practices insertion failed')
      })
  }
}

async function launchAuditsToUrlList (urlProjectList, projectName, allowExternalAPI, username, password, autoscroll) {
  let reportsGreenit = []
  let reportsLighthouse = []
  let reportsW3c = []

  const urlList = urlProjectList.map((url) => url.urlName)
  try {
    reportsGreenit = await analyse(urlList, projectName, username, password, autoscroll)
  } catch (error) {
    console.error(error)
  }
  try {
    reportsLighthouse = await lighthouseAnalysis(urlList, projectName, username, password)
  } catch (error) {
    console.error(error)
  }
  if (allowExternalAPI === 'true') {
    try {
      reportsW3c = await w3cAnalysis.w3cAnalysisWithAPI(urlList)
    } catch (error) {
      console.error(error)
    }
  } else {
    console.warn('INSERT ANALYSIS - Usage of external API is not allowed, W3C analysis skipped')
  }
  return {
    reportsGreenit,
    reportsLighthouse,
    reportsW3c
  }
}

function formatAuditsToBeSaved (reports, urlProjectList) {
  const greenitAnalysisFormatted = []
  const analysisLighthouseFormatted = []
  const w3cAnalysisFormatted = []
  const lighthousePerformanceBestPractices = []
  const lighthouseAccessibilityBestPractices = []
  const bestPracticesFormatted = []
  const date = Date.now()

  // Format greenIT Analysis
  for (const greenItReport of reports.reportsGreenit) {
    if (greenItReport.success === true) {
      const urlProjectAudited = urlProjectList.filter((urlProject) => urlProject.urlName === greenItReport.url)
      const greenItAnalysisObject = {
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
      greenitAnalysisFormatted.push(greenItAnalysisObject)
    }
  }

  // Format Lighthouse Analysis
  for (const lighthouseReport of reports.reportsLighthouse) {
    if (lighthouseReport?.runtimeError === undefined) {
      const formattedLighthouseMetrics = formatLighthouseMetrics.formatLighthouseMetrics(lighthouseReport)
      const urlProjectAudited = urlProjectList.filter((urlProject) => urlProject.urlName === lighthouseReport.url)
      let urlProjectAuditedKey = 0;
      if (urlProjectAudited.length !== 0) {
       urlProjectAuditedKey = urlProjectAudited[0].idKey;
      }

      const lighthouseAudit = {
        idLighthouseAnalysis: uniqid(),
        idUrlLighthouse: urlProjectAuditedKey,
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
    const w3cAnalysisObject = {
      idW3cAnalysis: uniqid(),
      dateW3cAnalysis: date,
      idUrlW3c: urlProjectAudited[0].idKey,
      score: formatW3cAnalysis.calculateScore(w3cReport.w3cBestPractices),
      w3cBestPractices: w3cReport.w3cBestPractices
    }
    w3cAnalysisFormatted.push(w3cAnalysisObject)
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

  return {
    greenitAnalysisFormatted,
    analysisLighthouseFormatted,
    w3cAnalysisFormatted,
    lighthousePerformanceBestPractices,
    lighthouseAccessibilityBestPractices,
    bestPracticesFormatted
  }
}

const analysisService = new AnalysisService()
export default analysisService

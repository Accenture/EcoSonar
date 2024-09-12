import bestPracticesRepository from '../dataBase/bestPracticesRepository.js'
import formatGreenItReports from './format/formatGreenItReports.js'
import formatLighthouseBestPractices from './format/formatLighthouseBestPractices.js'
import w3cRepository from '../dataBase/w3cRepository.js'
import formatW3cBestPractices from './format/formatW3cBestPractices.js'
import bestPracticesSorting from './format/bestPracticesSorting.js'
import projectsRepository from '../dataBase/projectsRepository.js'
import urlsProjectRepository from '../dataBase/urlsProjectRepository.js'
import SystemError from '../utils/SystemError.js'
import loggerService from '../loggers/traces.js'

class RetrieveBestPracticesService { }

/**
   * Get best practices analysis for a project
   * @param {name of the project} projectName
   * @returns {Object} Returns the formatted best practices for the given project
   */
RetrieveBestPracticesService.prototype.getProjectAnalysis = async function (projectName) {
  let urlsIdKey = []
  let accessibility = {}
  let bestPractices = []
  let bestPracticesForProject = {}
  let systemError = false
  let procedure = ''

  await urlsProjectRepository.findAll(projectName)
    .then((result) => { urlsIdKey = result.map((el) => el.idKey) })
    .catch(() => { systemError = true })

  if (urlsIdKey.length > 0) {
    await projectsRepository.getProjectSettings(projectName)
      .then((result) => {
        if (result === null) {
          loggerService.info('Best Practices is returned with default procedure score impact')
        }
        procedure = result.procedure
      }).catch(() => {
        loggerService.info('Best Practices is returned with default procedure score impact')
      })

    await w3cRepository
      .findAnalysisProject(urlsIdKey)
      .then((result) => {
        if (result.length > 0) {
          const dateLastAnalysis = result[result.length - 1].dateW3cAnalysis
          const lastAnalysis = result.filter((deployment) => deployment.dateW3cAnalysis.getTime() === dateLastAnalysis.getTime())
          accessibility = formatW3cBestPractices.returnFormattedW3c(lastAnalysis)
          bestPracticesForProject.dateAnalysisBestPractices = dateLastAnalysis
        }
      })
      .catch(() => { systemError = true })

    await bestPracticesRepository.findBestPracticesForProject(urlsIdKey)
      .then((result) => {
        if (result.length > 0) {
          const dateLastAnalysis = result[result.length - 1].dateAnalysisBestPractices
          bestPracticesForProject.dateAnalysisBestPractices = dateLastAnalysis
          bestPractices = result.filter((deployment) => deployment.dateAnalysisBestPractices.getTime() === dateLastAnalysis.getTime())
        }
      }).catch(() => {
        systemError = true
      })

    if (bestPractices.length > 0) {
      const greenIt = formatGreenItReports.returnFormattedGreenIt(bestPractices)
      const lighthousePerformance = formatLighthouseBestPractices.returnFormattedPerformance(bestPractices)
      const ecoDesign = Object.assign(greenIt, lighthousePerformance)

      // Filtering averageScore depending of they are numeric values or string ('N.A')
      let numbersAverageScorePerf = Object.fromEntries(Object.entries(ecoDesign).filter((element) => typeof element[1].averageScore === 'number'))
      const nonNumbersAverageScorePerf = Object.fromEntries(Object.entries(ecoDesign).filter((element) => typeof element[1].averageScore !== 'number'))
      numbersAverageScorePerf = Object.fromEntries(Object.entries(numbersAverageScorePerf).sort((a, b) => a[1].averageScore - b[1].averageScore))
      bestPracticesForProject.ecodesign = Object.assign(numbersAverageScorePerf, nonNumbersAverageScorePerf)
      accessibility = Object.assign(accessibility, formatLighthouseBestPractices.returnFormattedAccessibility(bestPractices))
    }

    if (Object.keys(accessibility).length > 0) {
    // Filtering averageScore depending of they are numeric values or string ('N.A')
      let numbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore === 'number'))
      const nonNumbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore !== 'number'))
      numbersAverageScore = Object.fromEntries(Object.entries(numbersAverageScore).sort((a, b) => a[1].averageScore - b[1].averageScore))
      bestPracticesForProject.accessibility = Object.assign(numbersAverageScore, nonNumbersAverageScore)
    }

    if (procedure === 'highestImpact') {
      bestPracticesForProject = bestPracticesSorting.sortByHighestImpact(bestPracticesForProject)
    } else if (procedure === 'quickWins') {
      bestPracticesForProject = bestPracticesSorting.sortByQuickWins(bestPracticesForProject)
    }
  }

  return new Promise((resolve, reject) => {
    if (systemError) {
      reject(new SystemError())
    } else {
      resolve(bestPracticesForProject)
    }
  })
}

/**
   * Get best practices analysis for an URL
   * @param {name of the project} projectName
   * @param {url} urlName
   * @returns {Object} Returns the formatted best practices for the given url
   */
RetrieveBestPracticesService.prototype.getUrlBestPractices = async function (projectName, urlName) {
  let lastBestPracticesForUrl = {}
  let urlProjectKey
  let w3cAnalysisForUrl
  let bestPractices
  let accessibility = {}
  let systemError = false
  let procedure = ''

  await urlsProjectRepository.findUrl(projectName, urlName)
    .then((result) => {
      if (result.length > 0) {
        urlProjectKey = result[0].idKey
      }
    })
    .catch(() => {
      systemError = true
    })
  if (!urlProjectKey || systemError) {
    return Promise.reject(new SystemError())
  }
  await projectsRepository.getProjectSettings(projectName)
    .then((result) => {
      if (result === null) {
        loggerService.info('Best Practices is returned with default procedure score impact')
      }
      procedure = result.procedure
    }).catch(() => {
      loggerService.info('Best Practices is returned with default procedure score impact')
    })

  await w3cRepository
    .findAnalysisUrl(urlProjectKey)
    .then((result) => {
      if (result.length > 0) {
        const lastIndex = result.length - 1
        w3cAnalysisForUrl = [{
          idUrlW3c: result[lastIndex].idUrlW3c,
          dateW3cAnalysis: result[lastIndex].dateW3cAnalysis,
          score: result[lastIndex].score,
          w3cBestPractices: result[lastIndex].w3cBestPractices
        }]
        accessibility = formatW3cBestPractices.returnFormattedW3c(w3cAnalysisForUrl)
        lastBestPracticesForUrl.dateAnalysisBestPractices = w3cAnalysisForUrl[0].dateW3cAnalysis
      }
    })
    .catch(() => {
      systemError = true
    })

  await bestPracticesRepository.findBestPracticesForUrl(urlProjectKey)
    .then((reports) => {
      bestPractices = reports
    }).catch(() => {
      systemError = true
    })

  if (bestPractices.length > 0) {
    const greenIt = formatGreenItReports.returnFormattedGreenIt(bestPractices)
    const lighthousePerformance = formatLighthouseBestPractices.returnFormattedPerformance(bestPractices)
    const ecoDesign = Object.assign(greenIt, lighthousePerformance)

    // Filtering averageScore depending of they are numeric values or string ('N.A')
    let numbersAverageScorePerf = Object.fromEntries(Object.entries(ecoDesign).filter((element) => typeof element[1].averageScore === 'number'))
    const nonNumbersAverageScorePerf = Object.fromEntries(Object.entries(ecoDesign).filter((element) => typeof element[1].averageScore !== 'number'))
    numbersAverageScorePerf = Object.fromEntries(Object.entries(numbersAverageScorePerf).sort((a, b) => a[1].averageScore - b[1].averageScore))
    lastBestPracticesForUrl.ecodesign = Object.assign(numbersAverageScorePerf, nonNumbersAverageScorePerf)

    accessibility = Object.assign(accessibility, formatLighthouseBestPractices.returnFormattedAccessibility(bestPractices))
    lastBestPracticesForUrl.dateAnalysisBestPractices = bestPractices[0].dateAnalysisBestPractices
  }

  if (Object.keys(accessibility).length > 0) {
  // Filtering averageScore depeding of they are numeric values or string ('N.A')
    let numbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore === 'number'))
    const nonNumbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore !== 'number'))
    numbersAverageScore = Object.fromEntries(Object.entries(numbersAverageScore).sort((a, b) => a[1].averageScore - b[1].averageScore))
    lastBestPracticesForUrl.accessibility = Object.assign(numbersAverageScore, nonNumbersAverageScore)
  }

  if (procedure === 'highestImpact') {
    lastBestPracticesForUrl = bestPracticesSorting.sortByHighestImpact(lastBestPracticesForUrl)
  } else if (procedure === 'quickWins') {
    lastBestPracticesForUrl = bestPracticesSorting.sortByQuickWins(lastBestPracticesForUrl)
  }

  return new Promise((resolve, reject) => {
    if (systemError) {
      reject(new SystemError())
    } else {
      resolve(lastBestPracticesForUrl)
    }
  })
}

const retrieveBestPracticesService = new RetrieveBestPracticesService()
export default retrieveBestPracticesService

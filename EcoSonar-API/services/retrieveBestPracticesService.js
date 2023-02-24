const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const formatGreenItReports = require('./format/formatGreenItReports')
const formatLighthouseBestPractices = require('./format/formatLighthouseBestPractices')
const w3cRepository = require('../dataBase/w3cRepository')
const formatW3cBestPractices = require('./format/formatW3cBestPractices')
const bestPracticesSorting = require('./format/bestPracticesSorting')
const projectsRepository = require('../dataBase/projectsRepository')
class RetrieveBestPracticesService { }

/**
   * Get best practices analysis for a project
   * @param {name of the project} projectName
   * @returns {Object} Returns the formatted best practices for the given project
   */
RetrieveBestPracticesService.prototype.getProjectAnalysis = async function (projectName) {
  // Fetching W3C analysis in W3CS collection
  let w3cAnalysis
  await w3cRepository
    .findAnalysisProject(projectName)
    .then((result) => {
      if (result.length === 0) {
        console.log('GET BEST PRACTICES PROJECT - no W3C analysis found for project ' + projectName)
      } else {
        w3cAnalysis = result
      }
    })
    .catch((err) => {
      console.log(err)
    })
  let procedure = ''
  await projectsRepository.getProjectSettings(projectName).then((result) => {
    procedure = result.procedure
  }).catch(() => {
    console.log('Best Practices is returned with default procedure score impact')
  })
  return new Promise((resolve, reject) => {
    bestPracticesRepository.findAll(projectName)
      .then((reports) => {
        if (reports.length === 0) {
          console.log('GET BEST PRACTICES PROJECT- no best practices analysis found for project ' + projectName)
          reject(new Error('No best practices analysis has been launched for project ' + projectName))
        } else {
          let res = {}
          const greenIt = formatGreenItReports.returnFormattedGreenIt(reports)
          const lighthousePerformance = formatLighthouseBestPractices.returnFormattedPerformance(reports)
          const ecoDesign = Object.assign(greenIt, lighthousePerformance)

          // Filtering averageScore depending of they are numeric values or string ('N.A')
          let numbersAverageScorePerf = Object.fromEntries(Object.entries(ecoDesign).filter((element) => typeof element[1].averageScore === 'number'))
          const nonNumbersAverageScorePerf = Object.fromEntries(Object.entries(ecoDesign).filter((element) => typeof element[1].averageScore !== 'number'))
          numbersAverageScorePerf = Object.fromEntries(Object.entries(numbersAverageScorePerf).sort((a, b) => a[1].averageScore - b[1].averageScore))
          res.ecodesign = Object.assign(numbersAverageScorePerf, nonNumbersAverageScorePerf)
          res.dateAnalysisBestPractices = reports[0].dateAnalysisBestPractices
          let accessibility = formatLighthouseBestPractices.returnFormattedAccessibility(reports)

          // Check if there is a W3C Analysis as user can disable this analysis with environment variable
          if (w3cAnalysis.deployments.length > 0) {
            accessibility = Object.assign(accessibility, formatW3cBestPractices.returnFormattedW3c(w3cAnalysis.lastAnalysis))
          }

          // Filtering averageScore depending of they are numeric values or string ('N.A')
          let numbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore === 'number'))
          const nonNumbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore !== 'number'))
          numbersAverageScore = Object.fromEntries(Object.entries(numbersAverageScore).sort((a, b) => a[1].averageScore - b[1].averageScore))
          res.accessibility = Object.assign(numbersAverageScore, nonNumbersAverageScore)

          // sorting
          if (procedure === 'highestImpact') {
            res = bestPracticesSorting.sortByHighestImpact(res)
          } else if (procedure === 'smartImpact') {
            res = bestPracticesSorting.sortBySmartImpact(res)
          } else if (procedure === 'quickWins') {
            res = bestPracticesSorting.sortByQuickWins(res)
          }

          resolve(res)
        }
      }).catch((err) => {
        reject(err)
      })
  })
}

/**
   * Get best practices analysis for an URL
   * @param {name of the project} projectName
   * @param {url} urlName
   * @returns {Object} Returns the formatted best practices for the given url
   */
RetrieveBestPracticesService.prototype.getUrlBestPractices = function (projectName, urlName) {
  return new Promise((resolve, reject) => {
    // Fetching W3C analysis in W3CS collection
    let w3cAnalysisForUrl
    w3cRepository
      .find(projectName, urlName)
      .then((result) => {
        if (result.length === 0) {
          console.log(`GET BEST PRACTICES URL - no W3C analysis found for url ${urlName} into ${projectName}`)
        } else {
          w3cAnalysisForUrl = result
        }
      })
      .catch((err) => {
        console.log(err.message)
      })

    bestPracticesRepository.find(projectName, urlName)
      .then((reports) => {
        if (reports.length === 0) {
          console.log(`GET BEST PRACTICES URL - no best practices analysis found for url ${urlName} into ${projectName}`)
          reject(new Error(`No best practices analysis has been launched for url ${urlName} into ${projectName}`))
        } else {
          const res = {}
          const greenIt = formatGreenItReports.returnFormattedGreenIt(reports)
          const lighthousePerformance = formatLighthouseBestPractices.returnFormattedPerformance(reports)
          const ecoDesign = Object.assign(greenIt, lighthousePerformance)
          res.ecodesign = Object.fromEntries(Object.entries(ecoDesign).sort((a, b) => a[1].averageScore - b[1].averageScore))
          let accessibility = formatLighthouseBestPractices.returnFormattedAccessibility(reports)
          res.dateAnalysisBestPractices = reports[0].dateAnalysisBestPractices

          // Check if there is a W3C Analysis as user can disable this analysis with environment variable
          if (w3cAnalysisForUrl) {
            accessibility = Object.assign(accessibility, formatW3cBestPractices.returnFormattedW3c(w3cAnalysisForUrl))
          }

          // Filtering averageScore depeding of they are numeric values or string ('N.A')
          let numbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore === 'number'))
          const nonNumbersAverageScore = Object.fromEntries(Object.entries(accessibility).filter((element) => typeof element[1].averageScore !== 'number'))
          numbersAverageScore = Object.fromEntries(Object.entries(numbersAverageScore).sort((a, b) => a[1].averageScore - b[1].averageScore))
          res.accessibility = Object.assign(numbersAverageScore, nonNumbersAverageScore)
          res.accessibility = Object.fromEntries(Object.entries(res.accessibility).sort((a, b) => a[1].averageScore - b[1].averageScore))

          resolve(res)
        }
      }).catch((err) => {
        reject(err)
      })
  })
}

const retrieveBestPracticesService = new RetrieveBestPracticesService()
module.exports = retrieveBestPracticesService

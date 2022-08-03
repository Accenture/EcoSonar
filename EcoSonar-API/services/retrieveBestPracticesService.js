const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const formatGreenItReports = require('./format/formatGreenItReports')
const formatLighthouseBestPractices = require('./format/formatLighthouseBestPractices')

class RetrieveBestPracticesService {}

/**
   * Get best practices analysis for a project
   * @param {name of the project} projectName
   * @returns {Object} Returns the formatted best practices for the given project
   */
RetrieveBestPracticesService.prototype.getProjectAnalysis = function (projectName) {
  return new Promise((resolve, reject) => {
    bestPracticesRepository.findAll(projectName)
      .then((reports) => {
        if (reports.length === 0) {
          console.log('GET PROJECT BEST PRACTICES - no best practices analysis found for project ' + projectName)
          reject(new Error('No best practices analysis has been launched for project ' + projectName))
        } else {
          const res = { }

          const latestDate = new Date(
            Math.max(...reports.map(element => { return new Date(element.dateAnalysisBestPractices) }))
          )

          const latestReport = reports.filter(element => element.dateAnalysisBestPractices.getTime() === latestDate.getTime())
          res.greenItBestPractices = formatGreenItReports.returnFormattedGreenIt(latestReport)
          res.lighthousePerformanceBestPractices = formatLighthouseBestPractices.returnFormattedPerformance(latestReport)
          res.lighthouseAccessibilityBestPractices = formatLighthouseBestPractices.returnFormattedAccessibility(latestReport)
          res.dateAnalysisBestPractices = latestDate
          resolve(res)
        }
      }).catch((err) => {
        reject(err)
      })
  })
}

const retrieveBestPracticesService = new RetrieveBestPracticesService()
module.exports = retrieveBestPracticesService

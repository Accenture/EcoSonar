const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const formatGreenItBestPractices = require('./format/formatGreenItBestPractices')

class RetrieveBestPracticesService {}

// GET - get best practices analysis for a project
RetrieveBestPracticesService.prototype.getProjectAnalysis = function (projectName) {
  return new Promise((resolve, reject) => {
    bestPracticesRepository.findAll(projectName)
      .then((reports) => {
        if (reports.length === 0) {
          console.log('GETPROJECT - no best practices analysis found for project ' + projectName)
          reject(new Error('No best practices analysis has been launched for project ' + projectName))
        } else {
          const res = formatGreenItBestPractices.formatReports(reports)
          resolve(res)
        }
      }).catch((err) => {
        reject(err)
      })
  })
}

const retrieveBestPracticesService = new RetrieveBestPracticesService()
module.exports = retrieveBestPracticesService

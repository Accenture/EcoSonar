const greenItData = require('../utils/bestPractices/greenItData.json')
const lighthouseAccessibilityData = require('../utils/bestPractices/lighthouseAccessibilityData.json')
const lighthousePerformanceData = require('../utils/bestPractices/lighthousePerformanceData.json')

class BestPracticesServices { }

BestPracticesServices.prototype.getAllBestPracticesRules = async function () {
  const allBestPracticesRules = {
    greenitDocs: {},
    lighthousePerformanceDocs: {},
    lighthouseAccessbilityDocs: {}
  }
  try {
    allBestPracticesRules.greenitDocs = greenItData
    allBestPracticesRules.lighthousePerformanceDocs = lighthousePerformanceData
    allBestPracticesRules.lighthouseAccessbilityDocs = lighthouseAccessibilityData
    return allBestPracticesRules
  } catch (error) {
    return error
  }
}

const bestPracticesServices = new BestPracticesServices()
module.exports = bestPracticesServices

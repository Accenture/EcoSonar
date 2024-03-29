import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const greenItData = require('../utils/bestPractices/greenItData.json')
const lighthouseAccessibilityData = require('../utils/bestPractices/lighthouseAccessibilityData.json')
const lighthousePerformanceData = require('../utils/bestPractices/lighthousePerformanceData.json')

class BestPracticesServices { }

BestPracticesServices.prototype.getAllBestPracticesRules = function () {
  return {
    greenitDocs: greenItData,
    lighthousePerformanceDocs: lighthousePerformanceData,
    lighthouseAccessbilityDocs: lighthouseAccessibilityData
  }
}

const bestPracticesServices = new BestPracticesServices()
export default bestPracticesServices

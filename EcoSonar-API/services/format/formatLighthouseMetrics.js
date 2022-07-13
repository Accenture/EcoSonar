const enumAudits = require('../../utils/enumAudits')
const formatCompliance = require('./formatCompliance')

class FormatLighthouseMetrics {}

FormatLighthouseMetrics.prototype.formatLighthouseMetrics = function (reports) {
  const lighthouseMetrics = enumAudits.lighthouseMetrics()
  const formattedReports = {}
  for (const element in lighthouseMetrics) {
    let score, complianceLevel, displayValue
    if (element === 'performance' || element === 'accessibility') {
      score = Math.trunc(reports.categories[lighthouseMetrics[element]].score * 100)
      complianceLevel = formatCompliance.complianceLevel(Math.trunc(reports.categories[lighthouseMetrics[element]].score * 100))
      formattedReports[element] = { score: score, complianceLevel: complianceLevel }
    } else {
      score = Math.trunc(reports.audits[lighthouseMetrics[element]].score * 100)
      displayValue = reports.audits[lighthouseMetrics[element]].displayValue
      complianceLevel = formatCompliance.complianceLevel(Math.trunc(reports.audits[lighthouseMetrics[element]].score * 100))
      formattedReports[element] = { score: score, displayValue: displayValue, complianceLevel: complianceLevel }
    }
  }
  return formattedReports
}

const formatLighthouseMetrics = new FormatLighthouseMetrics()
module.exports = formatLighthouseMetrics

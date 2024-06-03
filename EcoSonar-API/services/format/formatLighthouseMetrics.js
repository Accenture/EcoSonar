import enumAudits from '../../utils/enumAudits.js'
import formatCompliance from './formatCompliance.js'

class FormatLighthouseMetrics {}

FormatLighthouseMetrics.prototype.formatLighthouseMetrics = function (reports) {
  const lighthouseMetrics = enumAudits.lighthouseMetrics()
  const reg = /\d+\.*\d*/g
  const formattedReports = {}
  for (const element in lighthouseMetrics) {
    try {
      let score, complianceLevel, displayValue
          if (element === 'performance' || element === 'accessibility') {
            score = Math.trunc(reports.categories[lighthouseMetrics[element]].score * 100)
            complianceLevel = element === 'performance' ? formatCompliance.getEcodesignGrade(Math.trunc(reports.categories[lighthouseMetrics[element]].score * 100)) : formatCompliance.getAccessibilityGrade(Math.trunc(reports.categories[lighthouseMetrics[element]].score * 100))
            formattedReports[element] = { score, complianceLevel }
          } else {
            score = Math.trunc(reports.audits[lighthouseMetrics[element]].score * 100)
            displayValue = reports.audits[lighthouseMetrics[element]].displayValue
            displayValue = displayValue ? Number(displayValue.replace(',', '').match(reg)[0]) : 0
            complianceLevel = formatCompliance.getEcodesignGrade(Math.trunc(reports.audits[lighthouseMetrics[element]].score * 100))
            formattedReports[element] = { score, displayValue, complianceLevel }
          }
    } catch (error) {
      console.error(error)
    }
  }
  return formattedReports
}

const formatLighthouseMetrics = new FormatLighthouseMetrics()
export default formatLighthouseMetrics

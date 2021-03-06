const enumAudits = require('../../utils/enumAudits')
const formatBestPracticesForProject = require('../format/formatBestPracticesForProject')
const metricsCalculate = require('../../utils/metricsCalculate')

class FormatLighthouseBestPractices { }

/**
 *
 * THE FOLLOWING FUNCTION ARE USED TO FORMAT LIGHTHOUSES BESTPRACTICES BEFORE INSERTION INTO THE MONGODB DATABASE
 *
 */

/**
 *
 * @param {*} reports
 * @returns Formatted lighthouse best practices for accessibility
 *  * Accessibility Scores are on a range of 0 to 1, function transform it to a 0 to 100
 * Score may be null for some practices even if it has items. It is a wanted behavior of lighthouse : if the scoreDisplayMode is set on "informative", then the score is automatically setted to null before return
 */
FormatLighthouseBestPractices.prototype.formatAccessibility = function (reports) {
  const accessibilityBestPractices = enumAudits.accessibilityNames()
  const formattedReports = {}

  for (const element in accessibilityBestPractices) {
    const score = reports.audits[accessibilityBestPractices[element]].score
    const scoreDisplayMode = reports.audits[accessibilityBestPractices[element]].scoreDisplayMode
    let displayValue = reports.audits[accessibilityBestPractices[element]].displayValue
    const items = (reports.audits[accessibilityBestPractices[element]].details !== undefined) ? reports.audits[accessibilityBestPractices[element]].details.items : []
    if (scoreDisplayMode === 'binary' && (displayValue === 0 || displayValue === undefined)) {
      displayValue = items.length
    } else if (displayValue === undefined) {
      displayValue = 0
    }
    formattedReports[element] = { score: score * 100, scoreDisplayMode, description: items, auditedMetric: displayValue }
  }
  return formattedReports
}

/**
 *
 * @param {*} reports
 * @returns Formatted lighthouse best practices for performance
 * Score may be null for some practices even if it has items. It is a wanted behavior of lighthouse : if the scoreDisplayMode is set on "informative", then the score is automatically setted to null before return
 */
FormatLighthouseBestPractices.prototype.formatPerformance = function (reports) {
  const reg = /\d+\.*\d*/g
  const performanceBestPractices = enumAudits.performanceNamesToSave()
  const formattedReports = {}
  for (const element in performanceBestPractices) {
    let items
    const score = reports.audits[performanceBestPractices[element]].score
    const scoreDisplayMode = reports.audits[performanceBestPractices[element]].scoreDisplayMode
    if (element === 'criticalRequestChains') {
      items = (reports.audits[performanceBestPractices[element]].details !== undefined) ? [reports.audits[performanceBestPractices[element]].details] : []
    } else {
      items = (reports.audits[performanceBestPractices[element]].details !== undefined) ? reports.audits[performanceBestPractices[element]].details.items : []
    }
    let displayValue = reports.audits[performanceBestPractices[element]].displayValue
    if (displayValue) {
      displayValue = Number(displayValue.replace(',', '').match(reg)[0])
    } else {
      displayValue = 0
    }
    formattedReports[element] = { score: score * 100, scoreDisplayMode, description: items, auditedMetric: displayValue }
  }
  return formattedReports
}

/**
 *
 * THE FOLLOWING FUNCTION ARE USED TO FORMAT LIGHTHOUSES BESTPRACTICES BEFORE RETURNING RESPONSE TO AN API REQUEST
 *
 */

/**
 *
 * @param {*} reports is the latest report of best practices
 * @returns a formatted JSON with average scores for each Lighthouse Performance Best Practice
 */
FormatLighthouseBestPractices.prototype.returnFormattedPerformance = function (reports) {
  const performanceBestPractices = enumAudits.performanceNamesToReturn()
  const formattedLighthousePerformanceBestPractices = {}
  const metricsReturnedAsAverage = metricsCalculate.averageForPerformanceMetrics()
  const metricsReturnedAssum = metricsCalculate.sumForPerformanceMetrics()

  for (const element in performanceBestPractices) {
    const description = []
    let totalScore = 0
    let numberOfValues = 0
    let totalAuditedMetric = null
    let numberOfAuditedMetrics = 0
    let i = 0
    let numberOfNotApplicableOrInformative = 0

    while (i < reports.length) {
      if (reports[i].lighthousePerformanceBestPractices[element].scoreDisplayMode === 'notApplicable' || reports[i].lighthousePerformanceBestPractices[element].scoreDisplayMode === 'informative') {
        numberOfNotApplicableOrInformative = numberOfNotApplicableOrInformative + 1
      }
      if (reports[i].lighthousePerformanceBestPractices[element].scoreDisplayMode !== 'notApplicable') {
        // Audited metrics averaging
        if (reports[i].lighthousePerformanceBestPractices[element].auditedMetric !== undefined) {
          if (totalAuditedMetric === null) {
            totalAuditedMetric = 0
          }
          const auditedMetric = reports[i].lighthousePerformanceBestPractices[element].auditedMetric
          totalAuditedMetric = formatBestPracticesForProject.addDisplayValues(totalAuditedMetric, auditedMetric, numberOfAuditedMetrics).totalDisplayValue
          numberOfAuditedMetrics = formatBestPracticesForProject.addDisplayValues(totalAuditedMetric, auditedMetric, numberOfAuditedMetrics).numberOfDisplayValues
        }
        // Score averaging
        totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].lighthousePerformanceBestPractices[element].score, numberOfValues).totalScore
        numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].lighthousePerformanceBestPractices[element].score, numberOfValues).numberOfValues

        if (reports[i].lighthousePerformanceBestPractices[element].description && reports[i].lighthousePerformanceBestPractices[element].description.length > 0) {
          description.push(reports[i].lighthousePerformanceBestPractices[element].description)
        }
      }
      i++
    }
    // Formatting best practices before return
    const isApplicableOrInformative = formatBestPracticesForProject.isApplicableOrInformative(numberOfNotApplicableOrInformative, reports.length)
    let formattedResponse = {}
    if (totalAuditedMetric === null) {
      totalAuditedMetric = 'N.A'
    }
    if (Object.keys(metricsReturnedAsAverage).includes(element)) {
      formattedResponse = formatBestPracticesForProject.formatResponse(formatBestPracticesForProject.calculateAverageScore(totalAuditedMetric, numberOfAuditedMetrics), formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), description, isApplicableOrInformative)
    } else if (Object.keys(metricsReturnedAssum).includes(element)) {
      formattedResponse = formatBestPracticesForProject.formatResponse(totalAuditedMetric, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), description, isApplicableOrInformative)
    } else {
      formattedResponse = formatBestPracticesForProject.formatResponse('N.A', formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), description, isApplicableOrInformative)
    }
    formattedLighthousePerformanceBestPractices[element] = {
      auditedMetric: formattedResponse.auditedMetric,
      averageScore: formattedResponse.averageScore,
      description: formattedResponse.description,
      compliance: formattedResponse.compliance,
      isApplicableOrInformative
    }
  }

  // For each BP, we merge the description [] of every URL analyzed in a single array
  for (const element in formattedLighthousePerformanceBestPractices) {
    formattedLighthousePerformanceBestPractices[element].description = formatBestPracticesForProject.mergeArrays(formattedLighthousePerformanceBestPractices, element)
    if (!formattedLighthousePerformanceBestPractices[element].description) {
      formattedLighthousePerformanceBestPractices[element].description = []
    }
  }
  return formatBestPracticesForProject.sortByScore(formattedLighthousePerformanceBestPractices)
}

/**
 *
 * @param {*} reports is the latest report of best practices
 * @returns a formatted JSON with average scores for each Lighthouse Accessibility Best Practice and also a list of the elements (into description[]) causing a score downgrade
 */
FormatLighthouseBestPractices.prototype.returnFormattedAccessibility = function (reports) {
  const accessibilityBestPractices = enumAudits.accessibilityNames()
  const formattedLighthouseAccessibilityBestPractices = {}
  const metricsReturnedAsSum = metricsCalculate.sumForAccessiblityMetrics()

  for (const element in accessibilityBestPractices) {
    let totalScore = 0
    let numberOfValues = 0
    let totalAuditedMetric = null
    let numberOfAuditedMetrics = 0
    const description = []
    let i = 0
    let numberOfNotApplicableOrInformative = 0

    while (i < reports.length) {
      if (reports[i].lighthouseAccessibilityBestPractices[element].scoreDisplayMode === 'notApplicable' || reports[i].lighthouseAccessibilityBestPractices[element].scoreDisplayMode === 'informative') {
        numberOfNotApplicableOrInformative = numberOfNotApplicableOrInformative + 1
      }
      if (reports[i].lighthouseAccessibilityBestPractices[element].scoreDisplayMode !== 'notApplicable') {
        // Audited metrics averaging
        if (reports[i].lighthouseAccessibilityBestPractices[element].auditedMetric !== undefined) {
          if (totalAuditedMetric === null) {
            totalAuditedMetric = 0
          }
          const auditedMetric = reports[i].lighthouseAccessibilityBestPractices[element].auditedMetric
          totalAuditedMetric = formatBestPracticesForProject.addDisplayValues(totalAuditedMetric, auditedMetric, numberOfAuditedMetrics).totalDisplayValue
          numberOfAuditedMetrics = formatBestPracticesForProject.addDisplayValues(totalAuditedMetric, auditedMetric, numberOfAuditedMetrics).numberOfDisplayValues
        }
        // Score averaging
        totalScore = formatBestPracticesForProject.addScores(totalScore, reports[i].lighthouseAccessibilityBestPractices[element].score, numberOfValues).totalScore
        numberOfValues = formatBestPracticesForProject.addScores(totalScore, reports[i].lighthouseAccessibilityBestPractices[element].score, numberOfValues).numberOfValues

        if (reports[i].lighthouseAccessibilityBestPractices[element].description && reports[i].lighthouseAccessibilityBestPractices[element].description.length > 0) {
          description.push(reports[i].lighthouseAccessibilityBestPractices[element].description)
        }
      }
      i++
    }

    // Formatting best practices before return
    const isApplicableOrInformative = formatBestPracticesForProject.isApplicableOrInformative(numberOfNotApplicableOrInformative, reports.length)

    // Setting auditedMetricfor accessibility
    let formattedResponse = {}
    if (totalAuditedMetric === null) {
      totalAuditedMetric = 'N.A'
    }
    if (Object.keys(metricsReturnedAsSum).includes(element)) {
      formattedResponse = formatBestPracticesForProject.formatResponse(totalAuditedMetric, formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), description, isApplicableOrInformative)
    } else {
      formattedResponse = formatBestPracticesForProject.formatResponse('N.A', formatBestPracticesForProject.calculateAverageScore(totalScore, numberOfValues), description, isApplicableOrInformative)
    }

    formattedLighthouseAccessibilityBestPractices[element] = {
      auditedMetric: formattedResponse.auditedMetric,
      averageScore: formattedResponse.averageScore,
      description: formattedResponse.description,
      compliance: formattedResponse.compliance,
      isApplicableOrInformative
    }
  }
  // For each BP, we merge the description [] of every URL analyzed in a single array
  for (const element in formattedLighthouseAccessibilityBestPractices) {
    formattedLighthouseAccessibilityBestPractices[element].description = formatBestPracticesForProject.mergeArrays(formattedLighthouseAccessibilityBestPractices, element)
    if (!formattedLighthouseAccessibilityBestPractices[element].description) {
      formattedLighthouseAccessibilityBestPractices[element].description = []
    }
  }
  return formatBestPracticesForProject.sortByScore(formattedLighthouseAccessibilityBestPractices)
}

const formatLighthouseBestPractices = new FormatLighthouseBestPractices()
module.exports = formatLighthouseBestPractices

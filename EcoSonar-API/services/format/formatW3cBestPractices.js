const formatCompliance = require('./formatCompliance')

class FormatW3cBestPractices {}

/**
 *
 * THE FOLLOWING FUNCTION ARE USED TO FORMAT W3C BESTPRACTICES BEFORE INSERTION INTO THE MONGODB DATABASE
 *
 */

/**
 *
 * @param {*} w3cAnalysis the analysis returned by W3C API
 * @returns  a formatted analysis to match with the best practices format
 */
FormatW3cBestPractices.prototype.formatW3c = function (w3cAnalysis) {
  // For each URL we assemble siblings best practices to avoid duplicate and create an array of extracts
  for (const element of w3cAnalysis) {
    try {
      element.w3cBestPractices = []
      for (const item of element.messages) {
        if (!element.w3cBestPractices.filter(e => e.auditName === item.message).length > 0) {
          if (item.type === 'info' && item.subType === 'warning') {
            item.type = 'warning'
          }
          if (item.type === 'error' && item.subType === 'fatal') {
            item.type = 'fatal error'
          }
          element.w3cBestPractices.push({ auditName: item.message, type: item.type, description: [{ extract: item.extract, lineToCorrect: item.lastLine }] })
        } else {
          const indexToPushOn = element.w3cBestPractices.indexOf(element.w3cBestPractices.find(e => e.auditName === item.message))
          element.w3cBestPractices[indexToPushOn].description.push({ extract: item.extract, lineToCorrect: item.lastLine })
        }
      }
    } catch (err) {
      console.log('W3C - Error during the formatting of w3c analysis for url ' + w3cAnalysis.url)
    }
  }
  return w3cAnalysis
}

/**
 *
 * THE FOLLOWING FUNCTION ARE USED TO FORMAT W3C BESTPRACTICES BEFORE RETURNING RESPONSE TO AN API REQUEST
 *
 */

/**
 *
 * @param {*} latestW3cAnalysis the latest W3C analysis stored in the collection
 * @returns a formatted analysis to be merged in accessibility item
 */
FormatW3cBestPractices.prototype.returnFormattedW3c = function (latestW3cAnalysis) {
  function setAverageScore (compliance) {
    if (compliance === 'G') return 0
    if (compliance === 'E') return 30
    if (compliance === 'C') return 60
  }
  const formattedW3cAnalysis = {

  }
  try {
    for (const analysis of latestW3cAnalysis) {
      for (const bestPractice of analysis.w3cBestPractices) {
        const auditName = bestPractice.auditName
        const compliance = formatCompliance.complianceLevelW3c(bestPractice.type)
        const averageScore = setAverageScore(compliance)

        if (!Object.keys(formattedW3cAnalysis).includes(auditName)) {
          formattedW3cAnalysis[auditName] = {
            auditedMetric: 'N.A',
            averageScore,
            description: bestPractice.description,
            compliance,
            isApplicableOrInformative: true,
            tool: 'W3C validator'

          }
        } else {
          formattedW3cAnalysis[auditName].description = [...formattedW3cAnalysis[auditName].description, ...bestPractice.description]
        }
      }
    }
  } catch (error) {
    console.log(error.message)
    console.log('W3C - Error during the formatting of w3c analysis')
  }
  return formattedW3cAnalysis
}

const formatW3cBestPractices = new FormatW3cBestPractices()
module.exports = formatW3cBestPractices

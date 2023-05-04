
const formatCompliance = require('../../services/format/formatCompliance')
class FormatBestPracticesForProject { }

FormatBestPracticesForProject.prototype.addScores = function (totalScore, score, numberOfValues) {
  if (score || score === 0) {
    totalScore += score
    return { totalScore, numberOfValues: numberOfValues + 1 }
  }
  // If score is undefined we don't count it as a value for the averaging
  return { totalScore, numberOfValues }
}

FormatBestPracticesForProject.prototype.addDisplayValues = function (totalDisplayValue, displayValue, numberOfDisplayValues) {
  if (displayValue || displayValue === 0) {
    totalDisplayValue += displayValue
    return { totalDisplayValue, numberOfDisplayValues: numberOfDisplayValues + 1 }
  }
  // If score is undefined we don't count it as a value for the averaging
  return { totalDisplayValue, numberOfDisplayValues }
}

FormatBestPracticesForProject.prototype.calculateAverageScore = function (totalScore, numberOfValues) {
  if (numberOfValues !== 0) { return (totalScore / numberOfValues) } else { return totalScore }
}

FormatBestPracticesForProject.prototype.isApplicableOrInformative = function (numberOfNonApplicable, reportLength) {
  return numberOfNonApplicable !== reportLength
}

FormatBestPracticesForProject.prototype.mergeArrays = function (formattedReport, element) {
  if (formattedReport[element].description.length > 0) {
    const totalLength = formattedReport[element].description.length
    let combinedArray = []
    let j = 0
    while (j < totalLength) {
      combinedArray = [...combinedArray, ...formattedReport[element].description[j]]
      j++
    }
    return combinedArray
  }
}

FormatBestPracticesForProject.prototype.sortByScore = function (formattedReport) {
  const naValues = []
  const withScoreValues = []
  for (const value of Object.entries(formattedReport)) {
    if (value[1].averageScore === 'N.A') {
      naValues.push(value)
    } else {
      withScoreValues.push(value)
    }
  }
  const sortedWithScoreValues = [...withScoreValues].sort((a, b) => a[1].averageScore - b[1].averageScore)
  const sortedReport = {}
  for (const value of sortedWithScoreValues) {
    sortedReport[value[0]] = value[1]
  }
  for (const value of naValues) {
    sortedReport[value[0]] = value[1]
  }

  return sortedReport
}

FormatBestPracticesForProject.prototype.getPercentage = function (value, count, multiplicator) {
  if (multiplicator) {
    return Math.round((value / count * 100) * 100) / 100
  }
  return Math.round((value / count) * 100) / 100
}

FormatBestPracticesForProject.prototype.formatResponse = function (auditedMetric, averageScore, description, isApplicable) {
  const response = {}
  if (auditedMetric !== undefined && (auditedMetric === 0 || auditedMetric !== 'N.A')) {
    if (Number.isInteger(auditedMetric)) {
      response.auditedMetric = auditedMetric.toString()
    } else {
      response.auditedMetric = auditedMetric.toFixed(2).toString()
    }
  } else if (auditedMetric === 'N.A') {
    response.auditedMetric = 'N.A'
  }
  if (averageScore === 0 && isApplicable === false) {
    response.compliance = 'N.A'
    response.averageScore = 'N.A'
  } else {
    response.compliance = formatCompliance.getEcodesignGrade(averageScore)
    response.averageScore = Number(averageScore.toFixed(2))
  }

  response.description = description

  return response
}

const formatBestPracticesForProject = new FormatBestPracticesForProject()
module.exports = formatBestPracticesForProject

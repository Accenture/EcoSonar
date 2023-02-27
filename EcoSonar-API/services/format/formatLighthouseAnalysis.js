const formatCompliance = require('./formatCompliance')
class FormatLighthouseAnalysis {}

FormatLighthouseAnalysis.prototype.lighthouseUrlAnalysisFormatted = function (analysis) {
  let formattedAnalysis
  try {
    formattedAnalysis = {
      performance: { displayValue: analysis.performance.score, complianceLevel: setComplianceLevel(analysis.performance.score) },
      accessibility: { displayValue: analysis.accessibility.score, complianceLevel: setComplianceLevel(analysis.accessibility.score) },
      dateAnalysis: analysis.dateLighthouseAnalysis,
      largestContentfulPaint: {
        displayValue: analysis.largestContentfulPaint.displayValue.toFixed(1) + ' s',
        score: analysis.largestContentfulPaint.score,
        complianceLevel: setComplianceLevel(analysis.largestContentfulPaint.score)
      },
      cumulativeLayoutShift: {
        displayValue: analysis.cumulativeLayoutShift.displayValue.toFixed(3),
        score: analysis.cumulativeLayoutShift.score,
        complianceLevel: setComplianceLevel(analysis.cumulativeLayoutShift.score)
      },
      firstContentfulPaint: {
        displayValue: analysis.firstContentfulPaint.displayValue.toFixed(1) + ' s',
        score: analysis.firstContentfulPaint.score,
        complianceLevel: setComplianceLevel(analysis.firstContentfulPaint.score)
      },
      speedIndex: {
        displayValue: analysis.speedIndex.displayValue.toFixed(1) + ' s',
        score: analysis.speedIndex.score,
        complianceLevel: setComplianceLevel(analysis.speedIndex.score)
      },
      totalBlockingTime: {
        displayValue: analysis.totalBlockingTime.displayValue.toFixed(0) + ' ms',
        score: analysis.totalBlockingTime.score,
        complianceLevel: setComplianceLevel(analysis.totalBlockingTime.score)
      },
      interactive: {
        displayValue: analysis.interactive.displayValue.toFixed(1) + ' s',
        score: analysis.interactive.score,
        complianceLevel: setComplianceLevel(analysis.interactive.score)
      }
    }
  } catch (err) {
    console.log(err)
    console.log('LIGHTHOUSE - error during the formatting of project analysis')
  }
  return formattedAnalysis
}

FormatLighthouseAnalysis.prototype.lighthouseProjectLastAnalysisFormatted = function (res) {
  let analysis
  let j = 0
  let count, performance, dateAnalysis, accessibility, largestContentfulPaint, cumulativeLayoutShift, firstContentfulPaint, speedIndex, totalBlockingTime, interactive

  try {
    while (j < res.length) {
      count = 0
      dateAnalysis = res[j].dateLighthouseAnalysis

      // Creating clones
      performance = JSON.parse(JSON.stringify(res[j].performance))
      accessibility = JSON.parse(JSON.stringify(res[j].accessibility))
      largestContentfulPaint = JSON.parse(JSON.stringify(res[j].largestContentfulPaint))
      cumulativeLayoutShift = JSON.parse(JSON.stringify(res[j].cumulativeLayoutShift))
      firstContentfulPaint = JSON.parse(JSON.stringify(res[j].firstContentfulPaint))
      speedIndex = JSON.parse(JSON.stringify(res[j].speedIndex))
      totalBlockingTime = JSON.parse(JSON.stringify(res[j].totalBlockingTime))
      interactive = JSON.parse(JSON.stringify(res[j].interactive))

      performance.score = 0
      accessibility.score = 0
      largestContentfulPaint.displayValue = 0
      largestContentfulPaint.score = 0
      cumulativeLayoutShift.displayValue = 0
      cumulativeLayoutShift.score = 0
      firstContentfulPaint.displayValue = 0
      firstContentfulPaint.score = 0
      speedIndex.displayValue = 0
      speedIndex.score = 0
      totalBlockingTime.displayValue = 0
      totalBlockingTime.score = 0
      interactive.displayValue = 0
      interactive.score = 0

      while (j < res.length && dateAnalysis.getTime() === res[j].dateLighthouseAnalysis.getTime()) {
        performance.score += res[j].performance.score
        accessibility.score += res[j].accessibility.score
        largestContentfulPaint.displayValue += res[j].largestContentfulPaint.displayValue
        largestContentfulPaint.score += res[j].largestContentfulPaint.score
        cumulativeLayoutShift.displayValue += res[j].cumulativeLayoutShift.displayValue
        cumulativeLayoutShift.score += res[j].cumulativeLayoutShift.score
        firstContentfulPaint.displayValue += res[j].firstContentfulPaint.displayValue
        firstContentfulPaint.score += res[j].firstContentfulPaint.score
        speedIndex.displayValue += res[j].speedIndex.displayValue
        speedIndex.score += res[j].speedIndex.score
        totalBlockingTime.displayValue += res[j].totalBlockingTime.displayValue
        totalBlockingTime.score += res[j].totalBlockingTime.score
        interactive.displayValue += res[j].interactive.displayValue
        interactive.score += res[j].interactive.score
        count++
        j++
      }

      largestContentfulPaint.score = calculateAverageScore(largestContentfulPaint.score)
      cumulativeLayoutShift.score = calculateAverageScore(cumulativeLayoutShift.score)
      firstContentfulPaint.score = calculateAverageScore(firstContentfulPaint.score)
      speedIndex.score = calculateAverageScore(speedIndex.score)
      totalBlockingTime.score = calculateAverageScore(totalBlockingTime.score)
      interactive.score = calculateAverageScore(interactive.score)

      analysis = {
        performance: { displayValue: Math.trunc(parseFloat(calculateAverageScore(performance.score))), complianceLevel: setComplianceLevel(calculateAverageScore(performance.score)) },
        accessibility: { displayValue: Math.trunc(parseFloat(calculateAverageScore(accessibility.score))), complianceLevel: setComplianceLevel(calculateAverageScore(accessibility.score)) },
        dateAnalysis,
        largestContentfulPaint: {
          displayValue: calculateAverageScore(largestContentfulPaint.displayValue, 1) + ' s',
          score: largestContentfulPaint.score,
          complianceLevel: setComplianceLevel(largestContentfulPaint.score)
        },
        cumulativeLayoutShift: {
          displayValue: calculateAverageScore(cumulativeLayoutShift.displayValue, 3),
          score: cumulativeLayoutShift.score,
          complianceLevel: setComplianceLevel(cumulativeLayoutShift.score)
        },
        firstContentfulPaint: {
          displayValue: calculateAverageScore(firstContentfulPaint.displayValue, 1) + ' s',
          score: firstContentfulPaint.score,
          complianceLevel: setComplianceLevel(firstContentfulPaint.score)
        },
        speedIndex: {
          displayValue: calculateAverageScore(speedIndex.displayValue, 1) + ' s',
          score: speedIndex.score,
          complianceLevel: setComplianceLevel(speedIndex.score)
        },
        totalBlockingTime: {
          displayValue: calculateAverageScore(totalBlockingTime.displayValue, 0) + ' ms',
          score: totalBlockingTime.score,
          complianceLevel: setComplianceLevel(totalBlockingTime.score)
        },
        interactive: {
          displayValue: calculateAverageScore(interactive.displayValue, 1) + ' s',
          score: interactive.score,
          complianceLevel: setComplianceLevel(interactive.score)
        }
      }
    }
    return analysis
  } catch (err) {
    console.log(err)
    console.log('LIGHTHOUSE - error during the formatting of project analysis')
  }
  function calculateAverageScore (score, toFixParam) {
    return (score / count).toFixed(toFixParam)
  }
}

function setComplianceLevel (score) {
  return formatCompliance.getGrade(score)
}

FormatLighthouseAnalysis.prototype.lighthouseAnalysisFormattedDeployments = function (res) {
  let j = 0
  const deployments = []

  let formattedMetrics

  try {
    while (j < res.length) {
      formattedMetrics = {
        performanceScore: res[j].performance.score,
        accessibilityScore: res[j].accessibility.score,
        dateAnalysis: res[j].dateLighthouseAnalysis,
        largestContentfulPaint: res[j].largestContentfulPaint.score,
        cumulativeLayoutShift: res[j].cumulativeLayoutShift.score,
        firstContentfulPaint: res[j].firstContentfulPaint.score,
        speedIndex: res[j].speedIndex.score,
        totalBlockingTime: res[j].totalBlockingTime.score,
        interactive: res[j].interactive.score
      }

      deployments[j] = formattedMetrics

      j++
    }
    return this.formatDeploymentsForGraphs(deployments)
  } catch (err) {
    console.log(err)
    console.log('LIGHTHOUSE - error during the formatting of project analysis')
  }
}

FormatLighthouseAnalysis.prototype.formatDeploymentsForGraphs = function (deployments) {
  const duplicatedDeployments = []

  for (const i of deployments) {
    // We filter deployments to find the values with the same date
    const duplicatedValuesArray = deployments.filter((element) => compareFullDate(element.dateAnalysis, i.dateAnalysis))
    const sumElement = {
      performanceScore: 0,
      accessibilityScore: 0,
      dateAnalysis: duplicatedValuesArray[0].dateAnalysis,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstContentfulPaint: 0,
      speedIndex: 0,
      totalBlockingTime: 0,
      interactive: 0,
      numberOfValues: 0
    }

    // We add up every element with the same date (only DD/MM/YYYY) in one (sumElement)
    duplicatedValuesArray.forEach((element) => {
      sumElement.performanceScore += element.performanceScore
      sumElement.accessibilityScore += element.accessibilityScore
      sumElement.largestContentfulPaint += element.largestContentfulPaint
      sumElement.cumulativeLayoutShift += element.cumulativeLayoutShift
      sumElement.firstContentfulPaint += element.firstContentfulPaint
      sumElement.speedIndex += element.speedIndex
      sumElement.totalBlockingTime += element.totalBlockingTime
      sumElement.interactive += element.interactive
      sumElement.numberOfValues++
    })

    duplicatedDeployments.push(sumElement)
  }

  // Sanitizing duplicatedDeployments
  const finalDeployment = getUniqueListByDate(duplicatedDeployments, 'dateAnalysis')

  function getUniqueListByDate (arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  // Finally we calculate the average for each date
  for (const i of finalDeployment) {
    i.performanceScore = Math.round(i.performanceScore / i.numberOfValues)
    i.accessibilityScore = Math.round(i.accessibilityScore / i.numberOfValues)
    i.largestContentfulPaint = Math.round(i.largestContentfulPaint / i.numberOfValues)
    i.cumulativeLayoutShift = Math.round(i.cumulativeLayoutShift / i.numberOfValues)
    i.firstContentfulPaint = Math.round(i.firstContentfulPaint / i.numberOfValues)
    i.speedIndex = Math.round(i.speedIndex / i.numberOfValues)
    i.totalBlockingTime = Math.round(i.totalBlockingTime / i.numberOfValues)
    i.interactive = Math.round(i.interactive / i.numberOfValues)
    delete i.numberOfValues
  }

  function compareFullDate (firstDate, secondDate) {
    return (firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear())
  }
  return finalDeployment
}

const formatLighthouseAnalysis = new FormatLighthouseAnalysis()
module.exports = formatLighthouseAnalysis

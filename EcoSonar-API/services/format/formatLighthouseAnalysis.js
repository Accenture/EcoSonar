const formatCompliance = require('./formatCompliance')

class FormatLighthouseAnalysis {}

FormatLighthouseAnalysis.prototype.lighthouseUrlAnalysisFormatted = function (analysis) {
  let formattedAnalysis = null
  try {
    formattedAnalysis = {
      performance: { displayValue: analysis.performance.score, complianceLevel: formatCompliance.getEcodesignGrade(analysis.performance.score) },
      accessibility: { displayValue: analysis.accessibility.score, complianceLevel: formatCompliance.getAccessibilityGrade(analysis.accessibility.score) },
      dateAnalysis: analysis.dateLighthouseAnalysis,
      largestContentfulPaint: {
        displayValue: analysis.largestContentfulPaint.displayValue.toFixed(1) + ' s',
        score: analysis.largestContentfulPaint.score,
        complianceLevel: formatCompliance.getEcodesignGrade(analysis.largestContentfulPaint.score)
      },
      cumulativeLayoutShift: {
        displayValue: analysis.cumulativeLayoutShift.displayValue.toFixed(3),
        score: analysis.cumulativeLayoutShift.score,
        complianceLevel: formatCompliance.getEcodesignGrade(analysis.cumulativeLayoutShift.score)
      },
      firstContentfulPaint: {
        displayValue: analysis.firstContentfulPaint.displayValue.toFixed(1) + ' s',
        score: analysis.firstContentfulPaint.score,
        complianceLevel: formatCompliance.getEcodesignGrade(analysis.firstContentfulPaint.score)
      },
      speedIndex: {
        displayValue: analysis.speedIndex.displayValue.toFixed(1) + ' s',
        score: analysis.speedIndex.score,
        complianceLevel: formatCompliance.getEcodesignGrade(analysis.speedIndex.score)
      },
      totalBlockingTime: {
        displayValue: analysis.totalBlockingTime.displayValue.toFixed(0) + ' ms',
        score: analysis.totalBlockingTime.score,
        complianceLevel: formatCompliance.getEcodesignGrade(analysis.totalBlockingTime.score)
      },
      interactive: {
        displayValue: analysis.interactive.displayValue.toFixed(1) + ' s',
        score: analysis.interactive.score,
        complianceLevel: formatCompliance.getEcodesignGrade(analysis.interactive.score)
      }
    }
  } catch (err) {
    console.error(err)
    console.error('LIGHTHOUSE - error during the formatting of project analysis')
  }
  return formattedAnalysis
}

FormatLighthouseAnalysis.prototype.lighthouseProjectLastAnalysisFormatted = function (res) {
  let analysis = null
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
      performance.score = calculateAverageScore(performance.score)
      accessibility.score = calculateAverageScore(accessibility.score)

      analysis = {
        performance: { displayValue: Math.trunc(parseFloat(performance.score)), complianceLevel: formatCompliance.getEcodesignGrade(performance.score) },
        accessibility: { displayValue: Math.trunc(parseFloat(accessibility.score)), complianceLevel: formatCompliance.getAccessibilityGrade(accessibility.score) },
        dateAnalysis,
        largestContentfulPaint: {
          displayValue: calculateAverageScore(largestContentfulPaint.displayValue, 1) + ' s',
          score: largestContentfulPaint.score,
          complianceLevel: formatCompliance.getEcodesignGrade(largestContentfulPaint.score)
        },
        cumulativeLayoutShift: {
          displayValue: calculateAverageScore(cumulativeLayoutShift.displayValue, 3),
          score: cumulativeLayoutShift.score,
          complianceLevel: formatCompliance.getEcodesignGrade(cumulativeLayoutShift.score)
        },
        firstContentfulPaint: {
          displayValue: calculateAverageScore(firstContentfulPaint.displayValue, 1) + ' s',
          score: firstContentfulPaint.score,
          complianceLevel: formatCompliance.getEcodesignGrade(firstContentfulPaint.score)
        },
        speedIndex: {
          displayValue: calculateAverageScore(speedIndex.displayValue, 1) + ' s',
          score: speedIndex.score,
          complianceLevel: formatCompliance.getEcodesignGrade(speedIndex.score)
        },
        totalBlockingTime: {
          displayValue: calculateAverageScore(totalBlockingTime.displayValue, 0) + ' ms',
          score: totalBlockingTime.score,
          complianceLevel: formatCompliance.getEcodesignGrade(totalBlockingTime.score)
        },
        interactive: {
          displayValue: calculateAverageScore(interactive.displayValue, 1) + ' s',
          score: interactive.score,
          complianceLevel: formatCompliance.getEcodesignGrade(interactive.score)
        }
      }
    }
  } catch (err) {
    console.error(err)
    console.error('LIGHTHOUSE - error during the formatting of project analysis')
  }
  return analysis

  function calculateAverageScore (score, toFixParam) {
    return (score / count).toFixed(toFixParam)
  }
}

FormatLighthouseAnalysis.prototype.lighthouseAnalysisFormattedDeployments = function (res) {
  let deployments = []

  try {
    deployments = res.map((el) => {
      return {
        performanceScore: el.performance.score,
        accessibilityScore: el.accessibility.score,
        dateAnalysis: el.dateLighthouseAnalysis,
        largestContentfulPaint: el.largestContentfulPaint.score,
        cumulativeLayoutShift: el.cumulativeLayoutShift.score,
        firstContentfulPaint: el.firstContentfulPaint.score,
        speedIndex: el.speedIndex.score,
        totalBlockingTime: el.totalBlockingTime.score,
        interactive: el.interactive.score
      }
    })
    deployments = this.formatDeploymentsForGraphs(deployments)
  } catch (err) {
    console.error(err)
    console.error('LIGHTHOUSE - error during the formatting of project analysis')
  }
  return deployments
}

FormatLighthouseAnalysis.prototype.formatDeploymentsForGraphs = function (deployments) {
  const duplicatedDeployments = []
  let finalDeployment = []

  try {
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
    finalDeployment = getUniqueListByDate(duplicatedDeployments, 'dateAnalysis')

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
  } catch (err) {
    console.error(err)
    console.error('LIGHTHOUSE - error during the formatting of project analysis')
  }

  return finalDeployment
}

function getUniqueListByDate (arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

function compareFullDate (firstDate, secondDate) {
  return (firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear())
}

const formatLighthouseAnalysis = new FormatLighthouseAnalysis()
module.exports = formatLighthouseAnalysis

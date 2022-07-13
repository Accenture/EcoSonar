const formatCompliance = require('./formatCompliance')
class FormatLighthouseAnalysis {}

FormatLighthouseAnalysis.prototype.lighthouseProjectLastAnalysisFormatted = function (res) {
  let analysis
  let indexAnalysis = 0
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
        largestContentfulPaint.displayValue += parseFloat(res[j].largestContentfulPaint.displayValue.replace(',', '.'))
        largestContentfulPaint.score += res[j].largestContentfulPaint.score
        cumulativeLayoutShift.displayValue += parseFloat(res[j].cumulativeLayoutShift.displayValue.replace(',', '.'))
        cumulativeLayoutShift.score += res[j].cumulativeLayoutShift.score
        firstContentfulPaint.displayValue += parseFloat(res[j].firstContentfulPaint.displayValue.replace(',', '.'))
        firstContentfulPaint.score += res[j].firstContentfulPaint.score
        speedIndex.displayValue += parseFloat(res[j].speedIndex.displayValue.replace(',', '.'))
        speedIndex.score += res[j].speedIndex.score
        totalBlockingTime.displayValue += parseFloat(res[j].totalBlockingTime.displayValue.replace(',', ''))
        totalBlockingTime.score += res[j].totalBlockingTime.score
        interactive.displayValue += parseFloat(res[j].interactive.displayValue.replace(',', '.'))
        interactive.score += res[j].interactive.score
        count++
        j++
      }

      analysis = {
        performance: { displayValue: Math.trunc(calculateAverageScore(performance.score)), complianceLevel: setComplianceLevel(calculateAverageScore(performance.score)) },
        accessibility: { displayValue: Math.trunc(calculateAverageScore(accessibility.score)), complianceLevel: setComplianceLevel(calculateAverageScore(accessibility.score)) },
        dateAnalysis: dateAnalysis,
        largestContentfulPaint: {
          displayValue: calculateAverageScore(largestContentfulPaint.displayValue, 1) + ' s',
          complianceLevel: setComplianceLevel(calculateAverageScore(largestContentfulPaint.score))
        },
        cumulativeLayoutShift: {
          displayValue: calculateAverageScore(cumulativeLayoutShift.displayValue, 3) + ' s',
          complianceLevel: setComplianceLevel(calculateAverageScore(cumulativeLayoutShift.score))
        },
        firstContentfulPaint: {
          displayValue: calculateAverageScore(firstContentfulPaint.displayValue, 1) + ' s',
          complianceLevel: setComplianceLevel(calculateAverageScore(firstContentfulPaint.score))
        },
        speedIndex: { displayValue: calculateAverageScore(speedIndex.displayValue, 1) + ' s', complianceLevel: setComplianceLevel(calculateAverageScore(speedIndex.score)) },
        totalBlockingTime: { displayValue: calculateAverageScore(totalBlockingTime.displayValue, 0) + ' ms', complianceLevel: setComplianceLevel(calculateAverageScore(totalBlockingTime.score)) },
        interactive: { displayValue: calculateAverageScore(interactive.displayValue, 1) + ' s', complianceLevel: setComplianceLevel(calculateAverageScore(interactive.score)) }
      }
      indexAnalysis = indexAnalysis + 1
    }
    return analysis
  } catch (err) {
    console.log(err)
    console.log('LIGHTHOUSE - error during the formatting of project analysis')
  }
  function calculateAverageScore (score, toFixParam) {
    return (score / count).toFixed(toFixParam)
  }

  function setComplianceLevel (score) {
    return formatCompliance.getGrade(score)
  }
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

    // On doit créer un nouveau tableau que l'on renverra
    duplicatedDeployments.push(sumElement)
  }

  // Sanitizing duplicatedDeployments
  const finalDeployment = getUniqueListByDate(duplicatedDeployments, 'dateAnalysis')

  function getUniqueListByDate (arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  // Finally we calculate the average for each date
  for (const i of finalDeployment) {
    i.performanceScore = Math.ceil(i.performanceScore / i.numberOfValues)
    i.accessibilityScore = Math.ceil(i.accessibilityScore / i.numberOfValues)
    i.largestContentfulPaint = Math.ceil(i.largestContentfulPaint / i.numberOfValues)
    i.cumulativeLayoutShift = Math.ceil(i.cumulativeLayoutShift / i.numberOfValues)
    i.firstContentfulPaint = Math.ceil(i.firstContentfulPaint / i.numberOfValues)
    i.speedIndex = Math.ceil(i.speedIndex / i.numberOfValues)
    i.totalBlockingTime = Math.ceil(i.totalBlockingTime / i.numberOfValues)
    i.interactive = Math.ceil(i.interactive / i.numberOfValues)
    delete i.numberOfValues
  }

  function compareFullDate (firstDate, secondDate) {
    return (firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear())
  }
  return finalDeployment
}

const formatLighthouseAnalysis = new FormatLighthouseAnalysis()
module.exports = formatLighthouseAnalysis

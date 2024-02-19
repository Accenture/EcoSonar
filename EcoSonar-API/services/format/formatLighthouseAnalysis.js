const formatCompliance = require('./formatCompliance')
class FormatLighthouseAnalysis {

  lighthouseAnalysisFormattedDeployments(res) {
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
          interactive: res[j].interactive.score,
          mobile: {
            performanceScore: res[j].mobile.performance.score,
            accessibilityScore: res[j].mobile.accessibility.score,
            dateAnalysis: res[j].mobile.dateLighthouseAnalysis,
            largestContentfulPaint: res[j].mobile.largestContentfulPaint.score,
            cumulativeLayoutShift: res[j].mobile.cumulativeLayoutShift.score,
            firstContentfulPaint: res[j].mobile.firstContentfulPaint.score,
            speedIndex: res[j].mobile.speedIndex.score,
            totalBlockingTime: res[j].mobile.totalBlockingTime.score,
            interactive: res[j].mobile.interactive.score
          }
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

  lighthouseProjectLastAnalysisFormatted(res) {
    let analysisDesktop, analysisMobile
    let j = 0
    let count, dateAnalysis, desktop, mobile

    try {
      while (j < res.length) {
        count = 0
        dateAnalysis = res[j].dateLighthouseAnalysis

        // Creating clones
        desktop = createClone(res[j])
        mobile = createClone(res[j].mobile)

        while (j < res.length && dateAnalysis.getTime() === res[j].dateLighthouseAnalysis.getTime()) {
          desktop.performance.score += res[j].performance.score
          desktop.accessibility.score += res[j].accessibility.score
          desktop.largestContentfulPaint.displayValue += res[j].largestContentfulPaint.displayValue
          desktop.largestContentfulPaint.score += res[j].largestContentfulPaint.score
          desktop.cumulativeLayoutShift.displayValue += res[j].cumulativeLayoutShift.displayValue
          desktop.cumulativeLayoutShift.score += res[j].cumulativeLayoutShift.score
          desktop.firstContentfulPaint.displayValue += res[j].firstContentfulPaint.displayValue
          desktop.firstContentfulPaint.score += res[j].firstContentfulPaint.score
          desktop.speedIndex.displayValue += res[j].speedIndex.displayValue
          desktop.speedIndex.score += res[j].speedIndex.score
          desktop.totalBlockingTime.displayValue += res[j].totalBlockingTime.displayValue
          desktop.totalBlockingTime.score += res[j].totalBlockingTime.score
          desktop.interactive.displayValue += res[j].interactive.displayValue
          desktop.interactive.score += res[j].interactive.score

          mobile.performance.score += res[j].mobile.performance.score
          mobile.accessibility.score += res[j].mobile.accessibility.score
          mobile.largestContentfulPaint.displayValue += res[j].mobile.largestContentfulPaint.displayValue
          mobile.largestContentfulPaint.score += res[j].mobile.largestContentfulPaint.score
          mobile.cumulativeLayoutShift.displayValue += res[j].mobile.cumulativeLayoutShift.displayValue
          mobile.cumulativeLayoutShift.score += res[j].mobile.cumulativeLayoutShift.score
          mobile.firstContentfulPaint.displayValue += res[j].mobile.firstContentfulPaint.displayValue
          mobile.firstContentfulPaint.score += res[j].mobile.firstContentfulPaint.score
          mobile.speedIndex.displayValue += res[j].mobile.speedIndex.displayValue
          mobile.speedIndex.score += res[j].mobile.speedIndex.score
          mobile.totalBlockingTime.displayValue += res[j].mobile.totalBlockingTime.displayValue
          mobile.totalBlockingTime.score += res[j].mobile.totalBlockingTime.score
          mobile.interactive.displayValue += res[j].mobile.interactive.displayValue
          mobile.interactive.score += res[j].mobile.interactive.score

          count++
          j++
        }

        desktop.largestContentfulPaint.score = calculateAverageScore(desktop.largestContentfulPaint.score)
        desktop.cumulativeLayoutShift.score = calculateAverageScore(desktop.cumulativeLayoutShift.score)
        desktop.firstContentfulPaint.score = calculateAverageScore(desktop.firstContentfulPaint.score)
        desktop.speedIndex.score = calculateAverageScore(desktop.speedIndex.score)
        desktop.totalBlockingTime.score = calculateAverageScore(desktop.totalBlockingTime.score)
        desktop.interactive.score = calculateAverageScore(desktop.interactive.score)
        desktop.performance.score = calculateAverageScore(desktop.performance.score)
        desktop.accessibility.score = calculateAverageScore(desktop.accessibility.score)

        mobile.largestContentfulPaint.score = calculateAverageScore(mobile.largestContentfulPaint.score)
        mobile.cumulativeLayoutShift.score = calculateAverageScore(mobile.cumulativeLayoutShift.score)
        mobile.firstContentfulPaint.score = calculateAverageScore(mobile.firstContentfulPaint.score)
        mobile.speedIndex.score = calculateAverageScore(mobile.speedIndex.score)
        mobile.totalBlockingTime.score = calculateAverageScore(mobile.totalBlockingTime.score)
        mobile.interactive.score = calculateAverageScore(mobile.interactive.score)
        mobile.performance.score = calculateAverageScore(mobile.performance.score)
        mobile.accessibility.score = calculateAverageScore(mobile.accessibility.score)

        analysisDesktop = createAnalysis(desktop)
        analysisMobile = createAnalysis(mobile)

      }
      return { ...analysisDesktop, mobile: analysisMobile }
    } catch (err) {
      console.log(err)
      console.log('LIGHTHOUSE - error during the formatting of project analysis')
    }

    function createClone(report) {
      return {
        performance: { ...report.performance, score: 0 },
        accessibility: { ...report.accessibility, score: 0 },
        largestContentfulPaint: { ...report.largestContentfulPaint, score: 0, displayValue: 0 },
        cumulativeLayoutShift: { ...report.cumulativeLayoutShift, score: 0, displayValue: 0 },
        firstContentfulPaint: { ...report.firstContentfulPaint, score: 0, displayValue: 0 },
        speedIndex: { ...report.speedIndex, score: 0, displayValue: 0 },
        totalBlockingTime: { ...report.totalBlockingTime, score: 0, displayValue: 0 },
        interactive: { ...report.interactive, score: 0, displayValue: 0 },
      }
    }

    function createAnalysis(rawReport) {
      return {
        performance: {
          displayValue: Math.trunc(parseFloat(rawReport.performance.score)),
          complianceLevel: formatCompliance.getEcodesignGrade(rawReport.performance.score)
        },
        accessibility: {
          displayValue: Math.trunc(parseFloat(rawReport.accessibility.score)),
          complianceLevel: formatCompliance.getAccessibilityGrade(rawReport.accessibility.score)
        },
        dateAnalysis,
        largestContentfulPaint: {
          displayValue: calculateAverageScore(rawReport.largestContentfulPaint.displayValue, 1) + ' s',
          score: rawReport.largestContentfulPaint.score,
          complianceLevel: formatCompliance.getEcodesignGrade(rawReport.largestContentfulPaint.score)
        },
        cumulativeLayoutShift: {
          displayValue: calculateAverageScore(rawReport.cumulativeLayoutShift.displayValue, 3),
          score: rawReport.cumulativeLayoutShift.score,
          complianceLevel: formatCompliance.getEcodesignGrade(rawReport.cumulativeLayoutShift.score)
        },
        firstContentfulPaint: {
          displayValue: calculateAverageScore(rawReport.firstContentfulPaint.displayValue, 1) + ' s',
          score: rawReport.firstContentfulPaint.score,
          complianceLevel: formatCompliance.getEcodesignGrade(rawReport.firstContentfulPaint.score)
        },
        speedIndex: {
          displayValue: calculateAverageScore(rawReport.speedIndex.displayValue, 1) + ' s',
          score: rawReport.speedIndex.score,
          complianceLevel: formatCompliance.getEcodesignGrade(rawReport.speedIndex.score)
        },
        totalBlockingTime: {
          displayValue: calculateAverageScore(rawReport.totalBlockingTime.displayValue, 0) + ' ms',
          score: rawReport.totalBlockingTime.score,
          complianceLevel: formatCompliance.getEcodesignGrade(rawReport.totalBlockingTime.score)
        },
        interactive: {
          displayValue: calculateAverageScore(rawReport.interactive.displayValue, 1) + ' s',
          score: rawReport.interactive.score,
          complianceLevel: formatCompliance.getEcodesignGrade(rawReport.interactive.score)
        }
      }
    }

    function calculateAverageScore (score, toFixParam) {
      return (score / count).toFixed(toFixParam)
    }
  }

}

FormatLighthouseAnalysis.prototype.lighthouseUrlAnalysisFormatted = function (analysis) {
  let formattedAnalysis
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
    console.log(err)
    console.log('LIGHTHOUSE - error during the formatting of project analysis')
  }
  return formattedAnalysis
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
      numberOfValues: 0,
      mobile: {
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
      sumElement.mobile.performanceScore += element.mobile.performanceScore
      sumElement.mobile.accessibilityScore += element.mobile.accessibilityScore
      sumElement.mobile.largestContentfulPaint += element.mobile.largestContentfulPaint
      sumElement.mobile.cumulativeLayoutShift += element.mobile.cumulativeLayoutShift
      sumElement.mobile.firstContentfulPaint += element.mobile.firstContentfulPaint
      sumElement.mobile.speedIndex += element.mobile.speedIndex
      sumElement.mobile.totalBlockingTime += element.mobile.totalBlockingTime
      sumElement.mobile.interactive += element.mobile.interactive
      sumElement.mobile.numberOfValues++
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
    i.mobile.performanceScore = Math.round(i.mobile.performanceScore / i.mobile.numberOfValues)
    i.mobile.accessibilityScore = Math.round(i.mobile.accessibilityScore / i.mobile.numberOfValues)
    i.mobile.largestContentfulPaint = Math.round(i.mobile.largestContentfulPaint / i.mobile.numberOfValues)
    i.mobile.cumulativeLayoutShift = Math.round(i.mobile.cumulativeLayoutShift / i.mobile.numberOfValues)
    i.mobile.firstContentfulPaint = Math.round(i.mobile.firstContentfulPaint / i.mobile.numberOfValues)
    i.mobile.speedIndex = Math.round(i.mobile.speedIndex / i.mobile.numberOfValues)
    i.mobile.totalBlockingTime = Math.round(i.mobile.totalBlockingTime / i.mobile.numberOfValues)
    i.mobile.interactive = Math.round(i.mobile.interactive / i.mobile.numberOfValues)
    delete i.numberOfValues
    delete i.mobile.numberOfValues
  }

  function compareFullDate (firstDate, secondDate) {
    return (firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear())
  }
  return finalDeployment
}

const formatLighthouseAnalysis = new FormatLighthouseAnalysis()
module.exports = formatLighthouseAnalysis

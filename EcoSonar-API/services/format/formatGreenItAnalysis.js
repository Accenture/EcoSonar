const ecoIndexCalculationService = require('../ecoIndexCalculationService')
const formatCompliance = require('./formatCompliance')

class FormatGreenItAnalysis {}

FormatGreenItAnalysis.prototype.greenItUrlAnalysisFormatted = function (analysis) {
  let formattedAnalysis = null
  try {
    formattedAnalysis = {
      domSize: { displayValue: analysis.domSize, complianceLevel: ecoIndexCalculationService.setScoreLetter('domSize', analysis.domSize) },
      nbRequest: { displayValue: analysis.nbRequest, complianceLevel: ecoIndexCalculationService.setScoreLetter('nbRequest', analysis.nbRequest) },
      responsesSize: { displayValue: analysis.responsesSize, complianceLevel: ecoIndexCalculationService.setScoreLetter('responseSize', analysis.responsesSize) },
      ecoIndex: analysis.ecoIndex,
      grade: analysis.grade
    }
  } catch (err) {
    console.error(err)
    console.error('GREENIT - error during the formatting of project analysis')
  }
  return formattedAnalysis
}

FormatGreenItAnalysis.prototype.greenItProjectLastAnalysisFormatted = function (res) {
  let analysis = null
  let j = 0
  let count, domSize, nbRequest, responsesSize, responsesSizeUncompress, ecoIndex

  try {
    domSize = 0
    nbRequest = 0
    responsesSize = 0
    responsesSizeUncompress = 0
    ecoIndex = 0
    count = 0
    let dateAnalysis

    while (j < res.length) {
      dateAnalysis = res[j].dateGreenAnalysis
      domSize += res[j].domSize
      nbRequest += res[j].nbRequest
      responsesSize += res[j].responsesSize
      responsesSizeUncompress += res[j].responsesSizeUncompress
      ecoIndex += res[j].ecoIndex
      count++
      j++
    }
    analysis = {
      domSize: { displayValue: Math.round(domSize / count), complianceLevel: ecoIndexCalculationService.setScoreLetter('domSize', Math.round(domSize / count)) },
      nbRequest: { displayValue: Math.round(nbRequest / count), complianceLevel: ecoIndexCalculationService.setScoreLetter('nbRequest', nbRequest / count) },
      dateAnalysis,
      responsesSize: { displayValue: Math.round(responsesSize / count), complianceLevel: ecoIndexCalculationService.setScoreLetter('responseSize', Math.round(responsesSize / count)) },
      responsesSizeUncompress: Math.round(responsesSizeUncompress / count),
      ecoIndex: Math.round(ecoIndex / count),
      grade: formatCompliance.getEcodesignGrade(ecoIndex / count)
    }
  } catch (err) {
    console.error(err)
    console.error('GREENIT - error during the formatting of project analysis')
  }
  return analysis
}

FormatGreenItAnalysis.prototype.formatDeploymentsForGraphs = function (deployments) {
  const duplicatedDeployments = []
  let finalDeployment = []
  try {
    for (const i of deployments) {
      // We filter deployments to find the values with the same date
      const duplicatedValuesArray = deployments.filter((element) => compareFullDate(element.dateGreenAnalysis, i.dateGreenAnalysis))
      const sumElement = {
        dateAnalysis: duplicatedValuesArray[0].dateGreenAnalysis,
        domSize: 0,
        nbRequest: 0,
        responsesSize: 0,
        ecoIndex: 0,
        numberOfValues: 0
      }

      // We add up every element with the same date (only DD/MM/YYYY) in one (sumElement)
      duplicatedValuesArray.forEach((element) => {
        sumElement.domSize += element.domSize
        sumElement.nbRequest += element.nbRequest
        sumElement.responsesSize += element.responsesSize
        sumElement.ecoIndex += element.ecoIndex
        sumElement.numberOfValues++
      })
      duplicatedDeployments.push(sumElement)
    }

    // Sanitizing duplicatedDeployments by removing twins
    finalDeployment = getUniqueListByDate(duplicatedDeployments, 'dateAnalysis')

    // Finally we calculate the average for each date
    for (const i of finalDeployment) {
      i.domSize = Math.round(i.domSize / i.numberOfValues)
      i.nbRequest = Math.round(i.nbRequest / i.numberOfValues)
      i.responsesSize = Math.round(i.responsesSize / i.numberOfValues)
      i.ecoIndex = Math.round(i.ecoIndex / i.numberOfValues)
      delete i.numberOfValues
    }
  } catch (error) {
    console.error(error)
    console.error('GREENIT - error during the formatting of project analysis')
  }

  return finalDeployment
}

function getUniqueListByDate (arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

function compareFullDate (firstDate, secondDate) {
  return (firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear())
}

const formatGreenItAnalysis = new FormatGreenItAnalysis()
module.exports = formatGreenItAnalysis

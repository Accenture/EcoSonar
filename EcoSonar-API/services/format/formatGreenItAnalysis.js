const ecoIndexCalculationService = require('../ecoIndexCalculationService')

class FormatGreenItAnalysis {}

FormatGreenItAnalysis.prototype.greenItProjectLastAnalysisFormatted = function (res) {
  let analysis
  let j = 0
  let count, domSize, nbRequest, responsesSize, responsesSizeUncompress, ecoIndex, waterConsumption, greenhouseGasesEmission

  try {
    domSize = 0
    nbRequest = 0
    responsesSize = 0
    responsesSizeUncompress = 0
    ecoIndex = 0
    waterConsumption = 0
    greenhouseGasesEmission = 0
    count = 0
    let dateAnalysis

    while (j < res.length) {
      dateAnalysis = res[j].dateGreenAnalysis
      domSize += res[j].domSize
      nbRequest += res[j].nbRequest
      responsesSize += res[j].responsesSize
      responsesSizeUncompress += res[j].responsesSizeUncompress
      ecoIndex += res[j].ecoIndex
      waterConsumption += res[j].waterConsumption
      greenhouseGasesEmission += res[j].greenhouseGasesEmission
      count++
      j++
    }
    analysis = {
      domSize: Math.ceil(domSize / count),
      nbRequest: nbRequest,
      dateAnalysis: dateAnalysis,
      responsesSize: Math.ceil(responsesSize / count),
      responsesSizeUncompress: Math.ceil(responsesSizeUncompress / count),
      ecoIndex: Math.ceil(ecoIndex / count),
      grade: ecoIndexCalculationService.getEcoIndexGrade(ecoIndex / count),
      waterConsumption: (waterConsumption / count).toFixed(2),
      greenhouseGasesEmission: (greenhouseGasesEmission / count).toFixed(2)
    }
    return analysis
  } catch (err) {
    console.log(err)
    console.log('LIGHTHOUSE - error during the formatting of project analysis')
  }
}
FormatGreenItAnalysis.prototype.formatDeploymentsForGraphs = function (deployments) {
  const duplicatedDeployments = []
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
  const finalDeployment = getUniqueListByDate(duplicatedDeployments, 'dateAnalysis')

  function getUniqueListByDate (arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  // Finally we calculate the average for each date
  for (const i of finalDeployment) {
    i.domSize = Math.ceil(i.domSize / i.numberOfValues)
    i.nbRequest = Math.ceil(i.nbRequest / i.numberOfValues)
    i.responsesSize = Math.ceil(i.responsesSize / i.numberOfValues)
    i.ecoIndex = Math.ceil(i.ecoIndex / i.numberOfValues)
    delete i.numberOfValues
  }

  function compareFullDate (firstDate, secondDate) {
    if (firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear()) {
      return true
    } else return false
  }
  return finalDeployment
}

const formatGreenItAnalysis = new FormatGreenItAnalysis()
module.exports = formatGreenItAnalysis

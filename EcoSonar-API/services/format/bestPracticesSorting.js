const ecodesignMetric = require('../../utils/feature_importance_model.json')
const quickWinsConfig = require('../../utils/quick_wins_configuration.json')
const smartImpactModel = require('../../utils/smart_impact_model.json')
class BestPracticesSorting { }

BestPracticesSorting.prototype.sortByHighestImpact = function (list) {
  const newList = {
    ecodesign: {},
    dateAnalysisBestPractices: list.dateAnalysisBestPractices,
    accessibility: list.accessibility
  }
  const complianceA = {}
  const complianceNA = {}
  for (const practice in ecodesignMetric) {
    for (const metric in ecodesignMetric[practice]) {
      if (list.ecodesign[metric] !== undefined) {
        if (list.ecodesign[metric].compliance === 'A') {
          complianceA[metric] = list.ecodesign[metric]
          list.ecodesign[metric] = undefined
        } else if (list.ecodesign[metric].compliance === 'N.A') {
          complianceNA[metric] = list.ecodesign[metric]
          list.ecodesign[metric] = undefined
        } else {
          newList.ecodesign[metric] = list.ecodesign[metric]
          list.ecodesign[metric] = undefined
        }
      }
    }
  }
  const sizeComplianceNA = Object.keys(complianceNA).length
  const sizeComplianceA = Object.keys(complianceA).length

  if (sizeComplianceA !== 0) {
    newList.ecodesign = jsonConcat(newList.ecodesign, complianceA)
  }
  if (sizeComplianceNA !== 0) {
    newList.ecodesign = jsonConcat(newList.ecodesign, complianceNA)
  }

  addBestPracticesMissing(list, newList)
  return newList
}

BestPracticesSorting.prototype.sortBySmartImpact = function (list) {
  list = this.sortByQuickWins(list)
  const newList = {
    ecodesign: {},
    dateAnalysisBestPractices: list.dateAnalysisBestPractices,
    accessibility: list.accessibility
  }
  for (const metric in smartImpactModel) {
    for (const practice in smartImpactModel[metric]) {
      newList.ecodesign[practice] = list.ecodesign[practice]
    }
  }
  for (const practice in list.ecodesign) {
    if (newList.ecodesign[practice] === undefined) {
      newList.ecodesign[practice] = list.ecodesign[practice]
    }
  }

  return newList
}

BestPracticesSorting.prototype.sortByQuickWins = function (list) {
  const bestPracticesSortedByQuickWins = sortUsingQuickWinsModel()

  // convert arrays to object
  const bestPracticesWithDifficulty1 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty1)
  const bestPracticesWithDifficulty2 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty2)
  const bestPracticesWithDifficulty3 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty3)
  const bestPracticesWithDifficulty4 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty4)
  const bestPracticesWithDifficulty5 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty5)
  const bestPracticesWithDifficulty6 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty6)
  const bestPracticesWithDifficulty7 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty7)
  const bestPracticesWithDifficulty8 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty8)
  const bestPracticesWithDifficulty9 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty9)
  const bestPracticesWithDifficulty10 = convertArrayToObject(bestPracticesSortedByQuickWins.bpWithDifficulty10)
  const bestPracticesNA = convertArrayToObject(bestPracticesSortedByQuickWins.bpNA)
  const bestPracticesA = convertArrayToObject(bestPracticesSortedByQuickWins.bpA)

  const bestPracticesWithDifficultySorted = Object.assign(bestPracticesWithDifficulty1,
    bestPracticesWithDifficulty2,
    bestPracticesWithDifficulty3,
    bestPracticesWithDifficulty4,
    bestPracticesWithDifficulty5,
    bestPracticesWithDifficulty6,
    bestPracticesWithDifficulty7,
    bestPracticesWithDifficulty8,
    bestPracticesWithDifficulty9,
    bestPracticesWithDifficulty10)

  addBestPracticesMissing(list, bestPracticesWithDifficultySorted)
  const bestPracticesSorted = Object.assign(bestPracticesWithDifficultySorted, bestPracticesA, bestPracticesNA)

  return {
    ecodesign: bestPracticesSorted,
    dateAnalysisBestPractices: list.dateAnalysisBestPractices,
    accessibility: list.accessibility
  }

  function sortUsingQuickWinsModel () {
    const bpWithDifficulty10 = []
    const bpWithDifficulty9 = []
    const bpWithDifficulty8 = []
    const bpWithDifficulty7 = []
    const bpWithDifficulty6 = []
    const bpWithDifficulty5 = []
    const bpWithDifficulty4 = []
    const bpWithDifficulty3 = []
    const bpWithDifficulty2 = []
    const bpWithDifficulty1 = []
    const bpNA = []
    const bpA = []
    for (const practice in quickWinsConfig) {
      if (list.ecodesign[practice] !== undefined && list.ecodesign[practice].compliance !== 'N.A' && list.ecodesign[practice].compliance !== 'A') {
        if (quickWinsConfig[practice].difficulty === 10) {
          sortingByIncreasingScore(bpWithDifficulty10, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 9) {
          sortingByIncreasingScore(bpWithDifficulty9, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 8) {
          sortingByIncreasingScore(bpWithDifficulty8, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 7) {
          sortingByIncreasingScore(bpWithDifficulty7, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 6) {
          sortingByIncreasingScore(bpWithDifficulty6, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 5) {
          sortingByIncreasingScore(bpWithDifficulty5, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 4) {
          sortingByIncreasingScore(bpWithDifficulty4, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 3) {
          sortingByIncreasingScore(bpWithDifficulty3, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 2) {
          sortingByIncreasingScore(bpWithDifficulty2, list.ecodesign, practice)
        } else if (quickWinsConfig[practice].difficulty === 1) {
          sortingByIncreasingScore(bpWithDifficulty1, list.ecodesign, practice)
        }
        list.ecodesign[practice] = undefined
      } else if (list.ecodesign[practice] !== undefined && list.ecodesign[practice].compliance === 'N.A') {
        sortingByIncreasingScore(bpNA, list.ecodesign, practice)
        list.ecodesign[practice] = undefined
      } else if (list.ecodesign[practice] !== undefined) {
        sortingByIncreasingScore(bpA, list.ecodesign, practice)
        list.ecodesign[practice] = undefined
      }
    }
    return {
      bpWithDifficulty10,
      bpWithDifficulty9,
      bpWithDifficulty8,
      bpWithDifficulty7,
      bpWithDifficulty6,
      bpWithDifficulty5,
      bpWithDifficulty4,
      bpWithDifficulty3,
      bpWithDifficulty2,
      bpWithDifficulty1,
      bpNA,
      bpA
    }
  }
}

function jsonConcat (json1, json2) {
  for (const key in json2) {
    json1[key] = json2[key]
  }
  return json1
}

function sortingByIncreasingScore (bestPracticeWithDifficultyX, listEcoDesign, practice) {
  let i = 0
  let namePractice = practice
  if (bestPracticeWithDifficultyX.length > 0) {
    namePractice = Object.keys(bestPracticeWithDifficultyX[i])[0]
  }
  while (i < bestPracticeWithDifficultyX.length && bestPracticeWithDifficultyX[i][namePractice].averageScore < listEcoDesign[practice].averageScore) {
    i++
    if (i < bestPracticeWithDifficultyX.length) {
      namePractice = Object.keys(bestPracticeWithDifficultyX[i])[0]
    }
  }
  bestPracticeWithDifficultyX.splice(i, 0, { [practice]: listEcoDesign[practice] })
}

function convertArrayToObject (bestPracticeWithDifficultyX) {
  let i = 0
  let practiceName
  const newList = {}
  while (i < bestPracticeWithDifficultyX.length) {
    practiceName = Object.keys(bestPracticeWithDifficultyX[i])[0]
    newList[practiceName] = bestPracticeWithDifficultyX[i][practiceName]
    i++
  }
  return newList
}

function addBestPracticesMissing (list, newList) {
  for (const practice in list) {
    for (const metric in list[practice]) {
      if (list.ecodesign[metric] !== undefined) {
        newList[metric] = list.ecodesign[metric]
        list.ecodesign[metric] = undefined
      }
    }
  }
}

const bestPracticesSorting = new BestPracticesSorting()
module.exports = bestPracticesSorting

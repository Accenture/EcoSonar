const SystemError = require('../utils/SystemError')
const retrieveAnalysisService = require('../services/retrieveAnalysisService')
const projectsRepository = require('../dataBase/projectsRepository')
const w3cRepository = require('../dataBase/w3cRepository')
const lighthouseRepository = require('../dataBase/lighthouseRepository')
const greenItRepository = require('../dataBase/greenItRepository')
const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const urlsProjectRepository = require('../dataBase/urlsProjectRepository')
const tempurlsProjectRepository = require('../dataBase/tempurlsProjectRepository')

class ProjectService { }

/**
 * get an average of all score for all projects of the database of last analysis
 * @param {string} date limit date of analysis
 * @returns nbr of projects and an average for each score  on the database at each date
 */
ProjectService.prototype.getAllInformationsAverage = async function (date) {
  return new Promise((resolve, reject) => {
    this.getAllProjectInformations(date, null, null, null)
      .then((result) => {
        const resultformatted = { nbProjects: result.nbProjects, ecoIndex: null, perfScore: null, accessScore: null, w3cScore: null }
        const scoreNbProject = { ecoIndex: null, perfScore: null, accessScore: null, w3cScore: null }
        const scores = ['ecoIndex', 'perfScore', 'accessScore', 'w3cScore']
        Object.keys(result.projects).forEach(project => {
          for (const scoreType of scores) {
            if (resultformatted[scoreType] !== null) {
              if (result.projects[project][scoreType] !== null) {
                resultformatted[scoreType] += result.projects[project][scoreType]
                scoreNbProject[scoreType] += 1
              }
            } else if (result.projects[project][scoreType] !== null) {
              resultformatted[scoreType] = result.projects[project][scoreType]
              scoreNbProject[scoreType] = 1
            }
          }
        })
        scores.forEach(score => {
          resultformatted[score] = Math.round(resultformatted[score] / scoreNbProject[score])
        })
        resolve(resultformatted)
      }).catch((err) => {
        reject(err)
      })
  })
}

/**
 * get informations about all project of the database on last analysis
 * @param {string} date limit date of analysis
 * @param {Object} sortBy content to sort projects: {"type": "", "order": "" }
 * @param {string} filterName filter on a string
 * @param {Object} filterScore filter content on a score: {"cat": "", "score": , "select": "" }
 * @returns all the informations for each project on the database at the defined date
 */
ProjectService.prototype.getAllProjectInformations = async function (date, sortBy, filterName, filterScore) {
  let analysisPerProject = {}
  let resultWithFilters = { nbProjects: null, projects: {} }

  try {
    date = validateAndConvertDate(date)
  } catch (err) {
    return Promise.reject(err)
  }

  try {
    analysisPerProject = await retrieveAnalysisService.getAllProjectScoresAverage(filterName)
  } catch (err) {
    return Promise.reject(err)
  }

  return new Promise((resolve, reject) => {
    try {
      for (const analysis of analysisPerProject) {
        if (analysis.lighthouse.length > 0 || analysis.greenIt.length > 0 || analysis.w3c > 0) {
          const lighthouseAnalysis = selectRightAnalysisByDateAndUrl(date, analysis.lighthouse, 'idUrlLighthouse', 'dateLighthouseAnalysis')
          const greenItAnalysis = selectRightAnalysisByDateAndUrl(date, analysis.greenIt, 'idUrlGreen', 'dateGreenAnalysis')
          const w3cAnalysis = selectRightAnalysisByDateAndUrl(date, analysis.w3c, 'idUrlW3c', 'dateW3cAnalysis')

          if (Object.keys(greenItAnalysis).length !== 0 || Object.keys(lighthouseAnalysis).length !== 0 || Object.keys(w3cAnalysis).length !== 0) {
            let allUrls = [...(Object.keys(greenItAnalysis).length !== 0 ? Object.keys(greenItAnalysis) : []), ...(Object.keys(lighthouseAnalysis).length !== 0 ? Object.keys(lighthouseAnalysis) : []), ...(Object.keys(w3cAnalysis).length ? Object.keys(w3cAnalysis) : [])]
            allUrls = Array.from(new Set(allUrls.map(JSON.stringify)))

            const projectInfos = {
              ecoIndex: getFieldScore(greenItAnalysis, 'ecoIndex'),
              perfScore: getFieldScore2(lighthouseAnalysis, 'performance', 'score'),
              accessScore: getFieldScore2(lighthouseAnalysis, 'accessibility', 'score'),
              w3cScore: getFieldScore(w3cAnalysis, 'score'),
              nbUrl: allUrls.length,
              dateAnalysis: getDateAnalysis(lighthouseAnalysis, greenItAnalysis, w3cAnalysis)
            }
            resultWithFilters.projects[analysis.name] = projectInfos
          }
        }
      }
      if (filterScore !== null) {
        resultWithFilters = filterByScore(resultWithFilters, filterScore.cat, filterScore.score, filterScore.select)
      }
      resultWithFilters.nbProjects = Object.keys(resultWithFilters.projects).length ?? 0
      resolve(sortProjects(resultWithFilters, sortBy))
    } catch (err) {
      console.error(err)
      reject(new Error(err.message))
    }
  })
}

function selectRightAnalysisByDateAndUrl (searchDate, projectsAnalysis, urlFieldName, dateFieldName) {
  const allAnalysisPerUrl = {}
  const groupedAnalysisByIdKeys = projectsAnalysis.reduce((acc, obj) => {
    if (!acc[obj[urlFieldName]]) {
      acc[obj[urlFieldName]] = []
    }
    acc[obj[urlFieldName]].push(obj)
    return acc
  }, {})
  Object.keys(groupedAnalysisByIdKeys).forEach(id => {
    const retainedAnalysis = filterPerDate(searchDate, groupedAnalysisByIdKeys[id], dateFieldName)
    allAnalysisPerUrl[id] = retainedAnalysis
  })
  return allAnalysisPerUrl
}

function filterPerDate (searchDate, projectsAnalysis, dateFieldName) {
  const allDates = projectsAnalysis.map(analysis => analysis[dateFieldName])
  const allDatesInRange = searchDate === null ? allDates : allDates.filter(date => new Date(date) <= searchDate)

  if (allDatesInRange.length === 0) return null

  const selectedDate = allDatesInRange.reduce((a, b) => new Date(a) > new Date(b) ? a : b)
  return projectsAnalysis.find(analysis => analysis[dateFieldName].getTime() === selectedDate.getTime())
}

function filterByScore (projectsList, filterCategory, filterLevel, filterDirection) {
  const projectListFiltered = {}
  Object.keys(projectsList.projects).forEach(projectName => {
    if ((filterDirection === 'upper' && projectsList.projects[projectName][filterCategory] >= filterLevel) || (filterDirection === 'lower' && projectsList.projects[projectName][filterCategory] <= filterLevel)) {
      projectListFiltered[projectName] = projectsList.projects[projectName]
    }
  })
  projectsList.projects = projectListFiltered
  return projectsList
}

function sortProjects (resultList, sortParams) {
  if (!sortParams) return resultList

  const { type, order } = sortParams
  const scores = ['ecoIndex', 'perfScore', 'accessScore', 'w3cScore']
  let sortedProjects = {}

  if (type === 'name') {
    sortedProjects = sortByName(resultList.projects, order)
  } else if (scores.includes(type)) {
    sortedProjects = sortByScore(resultList.projects, type, order)
  } else {
    console.error('Sort type does not exist, no sorting applied')
    return resultList
  }

  resultList.projects = sortedProjects
  return resultList
}

function sortByName (projects, order) {
  const sortedKeys = Object.keys(projects).sort(Intl.Collator().compare)
  if (order === 'desc') sortedKeys.reverse()

  return sortedKeys.reduce((result, key) => {
    result[key] = projects[key]
    return result
  }, {})
}

function sortByScore (projects, type, order) {
  const arr = Object.entries(projects)
  arr.sort((a, b) => b[1][type] - a[1][type])
  if (order === 'desc') arr.reverse()

  return Object.fromEntries(arr)
}

function validateAndConvertDate (dateToValidate) {
  if (dateToValidate !== null) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (regex.test(dateToValidate)) {
      return new Date(dateToValidate)
    } else {
      throw new Error('Bad date format: YYYY-MM-DD')
    }
  } else {
    return null
  }
}

function getFieldScore (analysis, fieldToSum) {
  let sumScore = 0
  if (!analysis) {
    return null
  }
  let countUrls = Object.keys(analysis).length ?? 0
  if (countUrls === 0) {
    return null
  }
  for (const url in analysis) {
    if (analysis[url] !== null) {
      sumScore += analysis[url][fieldToSum]
    } else {
      countUrls--
    }
  }
  if (countUrls === 0) {
    return null // all analysis were empty
  }
  return parseFloat((sumScore / countUrls).toFixed(2))
}

function getFieldScore2 (analysis, fieldToSum1, fieldToSum2) {
  if (!analysis) {
    return null
  }
  let countUrls = Object.keys(analysis).length
  if (countUrls === 0) {
    return null
  }
  let sumScore = 0
  for (const url in analysis) {
    if (analysis[url] !== null) {
      sumScore += analysis[url][fieldToSum1][fieldToSum2]
    } else {
      countUrls--
    }
  }
  if (countUrls === 0) {
    return null // all analysis were empty
  }
  return parseFloat((sumScore / countUrls).toFixed(2))
}

function getDateAnalysis (lighthouseAnalysis, greenItAnalysis, w3cAnalysis) {
  if (!lighthouseAnalysis && !greenItAnalysis && !w3cAnalysis) {
    return null
  }
  try {
    return greenItAnalysis[Object.keys(greenItAnalysis)[0]].dateGreenAnalysis
  } catch (e) {
    // Ignored
  }
  try {
    return lighthouseAnalysis[Object.keys(lighthouseAnalysis)[0]].dateLighthouseAnalysis
  } catch (e) {
    // Ignored
  }
  try {
    return w3cAnalysis[Object.keys(w3cAnalysis)[0]].dateW3cAnalysis
  } catch (e) {
    // Ignored
  }
  return null
}

/**
 * Delete all part the project (project, urls and analysis)
 * @param {string} projectName name of the project to delete
 */
ProjectService.prototype.deleteProject = async function (projectName) {
  let urlsProjects = []
  let systemError = false

  await urlsProjectRepository.findAll(projectName)
    .then((result) => {
      urlsProjects = result.map((e) => e.idKey)
    }).catch(() => {
      systemError = true
    })

  if (systemError) {
    return Promise.reject(new SystemError())
  }
  try {
    await lighthouseRepository.deleteProject(urlsProjects)
    await greenItRepository.deleteProject(urlsProjects)
    await w3cRepository.deleteProject(urlsProjects)
    await bestPracticesRepository.deleteProject(urlsProjects)
    await urlsProjectRepository.deleteProject(urlsProjects)
    await tempurlsProjectRepository.deleteProject(projectName)
    await projectsRepository.deleteProjectPerProjectName(projectName)
  } catch (error) {
    console.error(error)
    systemError = true
  }
  return new Promise((resolve, reject) => {
    if (systemError) {
      reject(new SystemError())
    } else {
      resolve()
    }
  })
}

const projectService = new ProjectService()
module.exports = projectService

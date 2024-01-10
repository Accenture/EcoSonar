const SystemError = require('../utils/SystemError')
const retrieveAnalysisService = require('../services/retrieveAnalysisService')
const projectsRepository = require('../dataBase/projectsRepository')
const w3cRepository = require('../dataBase/w3cRepository')
const lighthouseRepository = require('../dataBase/lighthouseRepository')
const greenItRepository = require('../dataBase/greenItRepository')
const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const urlsProjectRepository = require('../dataBase/urlsProjectRepository')
const tempurlsProjectRepository = require('../dataBase/tempurlsProjectRepository')
const scores = ['ecoIndex', 'perfScore', 'accessScore', 'w3cScore']

class ProjectService { }

/**
 * get an average of all score for all projects of the database of last analysis
 * @param {date} Date limit date of analysis
 * @returns nbr of projects and an average for each score  on the database at each date
 */
ProjectService.prototype.getAllInformationsAverage = async function (date) {
  return new Promise((resolve, reject) => {
    this.getAllProjectInformations(date, null, null, null)
      .then((result) => {
        const resultformatted = { nbProjects: result.nbProjects, ecoIndex: null, perfScore: null, accessScore: null, w3cScore: null }
        const scoreNbProject = { ecoIndex: null, perfScore: null, accessScore: null, w3cScore: null }
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
        reject(new Error(err))
      })
  })
}

function selectRightAnalysisByDateAndUrl (searchDate, projectsAnalysis, urlFieldName) {
  const allAnalysisPerUrl = []
  const groupedAnalysisByIdKeys = projectsAnalysis.reduce((acc, obj) => {
    if (!acc[obj[urlFieldName]]) {
      acc[obj[urlFieldName]] = []
    }
    acc[obj[urlFieldName]].push(obj)
    return acc
  }, {})
  Object.keys(groupedAnalysisByIdKeys).forEach(id => {
    const retainedAnalysis = filterPerDate(searchDate, groupedAnalysisByIdKeys[id])
    allAnalysisPerUrl[id] = retainedAnalysis
  })
  return allAnalysisPerUrl
}

function filterPerDate (searchDate, projectsAnalysis) {
  const allDates = Object.keys(projectsAnalysis)
  const allDatesInRange = searchDate === null ? allDates : allDates.filter(date => new Date(date) <= searchDate)

  if (allDatesInRange.length === 0) return null

  const selectedDate = allDatesInRange.reduce((a, b) => new Date(a) > new Date(b) ? a : b)
  return projectsAnalysis[selectedDate]
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
  let sortedProjects = {}

  if (type === 'name') {
    sortedProjects = sortByName(resultList.projects, order)
  } else if (scores.includes(type)) {
    sortedProjects = sortByScore(resultList.projects, type, order)
  } else {
    console.error('sort type does not exist')
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
  return new Promise((resolve, reject) => {
    if (dateToValidate !== null) {
      const regex = /^\d{4}-\d{2}-\d{2}$/
      if (regex.test(dateToValidate)) {
        resolve(new Date(dateToValidate))
      } else {
        reject(new Error('Bad date format: YYYY-MM-DD'))
      }
    } else {
      resolve(null)
    }
  })
}

function getFieldScore (analysis, fieldToSum) {
  if (!analysis) {
    return null
  }
  const countUrls = Object.keys(analysis).length
  if (countUrls === 0) {
    return null
  }
  let sumScore = 0
  for (const url in analysis) {
    sumScore += analysis[url][fieldToSum]
  }
  return Math.round(sumScore / countUrls)
}

function getFieldScore2 (analysis, fieldToSum1, fieldToSum2) {
  if (!analysis) {
    return null
  }
  const countUrls = Object.keys(analysis).length
  if (countUrls === 0) {
    return null
  }
  let sumScore = 0
  for (const url in analysis) {
    sumScore += analysis[url][fieldToSum1][fieldToSum2]
  }
  return Math.round(sumScore / countUrls)
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
 * get informations about all project of the database on last analysis
 * @param {date} date limit date of analysis
 * @param {sortBy} object content to sort projects: {"type": "", "order": "" }
 * @param {filterName} string filter on a string
 * @param {filterScore} object filter content on a score: {"cat": "", "score": , "select": "" }
 * @returns all the informations for each project on the database at each date
 */
ProjectService.prototype.getAllProjectInformations = async function (date, sortBy, filterName, filterScore) {
  let error = null
  try {
    date = await validateAndConvertDate(date)
  } catch (err) {
    error = err
  }
  let AnalysisPerProject = {}
  if (error === null) {
    try {
      AnalysisPerProject = await retrieveAnalysisService.getProjectScoresAverageAll(filterName, date)
    } catch (err) {
      error = err
    }
    if (error === null) {
      return new Promise((resolve, reject) => {
        let resultwithfilter = { nbProjects: null, projects: {} }
        try {
          for (const analysis of AnalysisPerProject) {
            if (analysis.lighthouse.length > 0 || analysis.greenIt.length > 0 || analysis.w3c > 0) {
              const lighthouseAnalysis = selectRightAnalysisByDateAndUrl(date, analysis.lighthouse, 'idUrlLighthouse')
              const greenItAnalysis = selectRightAnalysisByDateAndUrl(date, analysis.greenIt, 'idUrlGreen')
              const w3cAnalysis = selectRightAnalysisByDateAndUrl(date, analysis.w3c, 'idUrlW3c')

              let projectInfos = {}

              if (greenItAnalysis !== null || lighthouseAnalysis !== null || w3cAnalysis !== null) {
                let allUrls = [...(greenItAnalysis !== null ? Object.keys(greenItAnalysis) : []), ...(lighthouseAnalysis !== null ? Object.keys(lighthouseAnalysis) : []), ...(w3cAnalysis !== null ? Object.keys(w3cAnalysis) : [])]
                allUrls = Array.from(new Set(allUrls.map(JSON.stringify)))

                projectInfos = {
                  ecoIndex: getFieldScore(greenItAnalysis, 'ecoIndex'),
                  perfScore: getFieldScore2(lighthouseAnalysis, 'performance', 'score'),
                  accessScore: getFieldScore2(lighthouseAnalysis, 'accessibility', 'score'),
                  w3cScore: getFieldScore(w3cAnalysis, 'score'),
                  nbUrl: allUrls.length,
                  dateAnalysis: getDateAnalysis(lighthouseAnalysis, greenItAnalysis, w3cAnalysis)
                }
                resultwithfilter.projects[analysis.name] = projectInfos
              }
            }
          }
        } catch (err) {
          console.error(err)
          reject(new SystemError(err))
        }
        if (error !== null) {
          reject(new SystemError())
        } else {
          if (filterScore !== null) {
            resultwithfilter = filterByScore(resultwithfilter, filterScore.cat, filterScore.score, filterScore.select)
          }
          resultwithfilter.nbProjects = Object.keys(resultwithfilter.projects).length
          resolve(sortProjects(resultwithfilter, sortBy))
        }
      })
    } else {
      return Promise.reject(new Error(error))
    }
  } else {
    return Promise.reject(new Error(error))
  }
}

/**
 * Delete all part the project (project, urls and analysis)
 * @param {string} projectName name of the project to delete
 */
ProjectService.prototype.deleteProject = async function (projectName) {
  let urlsProjects = []
  let systemError = false
  try {
    await urlsProjectRepository.findAll(projectName, true)
      .then((result) => {
        urlsProjects = result.map((e) => e.idKey)
      })
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error.message)
    systemError = true
  }
  if (systemError) {
    Promise.reject(new SystemError())
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
    console.error('\x1b[31m%s\x1b[0m', error.message)
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

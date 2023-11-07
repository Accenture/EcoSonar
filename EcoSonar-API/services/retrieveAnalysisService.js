const greenItRepository = require('../dataBase/greenItRepository')
const lighthouseRepository = require('../dataBase/lighthouseRepository')
const w3cRepository = require('../dataBase/w3cRepository')
const projectsRepository = require('../dataBase/projectsRepository')
const formatLighthouseAnalysis = require('./format/formatLighthouseAnalysis')
const SystemError = require('../utils/SystemError')
const formatGreenItAnalysis = require('./format/formatGreenItAnalysis')
const formatW3cAnalysis = require('./format/formatW3cAnalysis')

class RetrieveAnalysisService { }

/**
 * Get an analysis (GreenIt & Lighthouse) from a given project and URL
 * @param {string} projectName
 * @param {string} urlName
 * @returns {Object} Returns a formatted analysis
 */

RetrieveAnalysisService.prototype.getUrlAnalysis = async function (projectName, urlName) {
  let greenitAnalysisDeployment
  let lighthouseResultDeployment
  let w3cAnalysisDeployment
  let w3cAnalysisLastAnalysis
  let lighthouseResultLastAnalysis
  let greenitAnalysisLastAnalysis
  let errorRetrievedGreenItAnalysis = null
  let errorRetrievedLighthouseAnalysis = null
  let errorRetrievedW3cAnalysis = null

  // Fetching analysis for each tool
  await w3cRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      w3cAnalysisDeployment = result.deployments
      w3cAnalysisLastAnalysis = result.w3cLastAnalysis
    })
    .catch((err) => {
      errorRetrievedW3cAnalysis = err
      w3cAnalysisDeployment = []
      w3cAnalysisLastAnalysis = null
    })

  await greenItRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      greenitAnalysisDeployment = result.deployments
      greenitAnalysisLastAnalysis = formatGreenItAnalysis.greenItUrlAnalysisFormatted(result.lastAnalysis)
    })
    .catch((err) => {
      errorRetrievedGreenItAnalysis = err
      greenitAnalysisDeployment = []
      greenitAnalysisLastAnalysis = null
    })
  await lighthouseRepository
    .findAnalysisUrl(projectName, urlName)
    .then((result) => {
      lighthouseResultDeployment = result.deployments
      lighthouseResultLastAnalysis = formatLighthouseAnalysis.lighthouseUrlAnalysisFormatted(result.lastAnalysis)
    })
    .catch((err) => {
      errorRetrievedLighthouseAnalysis = err
      lighthouseResultDeployment = []
      lighthouseResultLastAnalysis = null
    })

  // Creating the response content
  return new Promise((resolve, reject) => {
    if (errorRetrievedGreenItAnalysis instanceof SystemError || errorRetrievedLighthouseAnalysis instanceof SystemError || errorRetrievedW3cAnalysis instanceof SystemError) {
      reject(new SystemError())
    } else if (errorRetrievedGreenItAnalysis !== null && errorRetrievedLighthouseAnalysis !== null && errorRetrievedW3cAnalysis !== null) {
      reject(new Error('No analysis found for url ' + urlName + ' in project ' + projectName))
    }
    const analysis = {
      deployments: {
        greenit: greenitAnalysisDeployment,
        lighthouse: lighthouseResultDeployment,
        w3c: w3cAnalysisDeployment
      },
      lastAnalysis: {
        greenit: greenitAnalysisLastAnalysis,
        lighthouse: lighthouseResultLastAnalysis,
        w3c: w3cAnalysisLastAnalysis
      }
    }
    resolve(analysis)
  })
}

/**
   * Get an analysis (GreenIt & Lighthouse) from a given project
   * @param {string} projectName
   * @returns {Object} Returns the formatted values with average score for the given project
   */

RetrieveAnalysisService.prototype.getProjectAnalysis = async function (projectName) {
  let greenitAnalysisDeployments = []
  let lighthouseAnalysisDeployments = []
  let w3cAnalysisDeployment = []
  let greenitLastAnalysis, lighthouseProjectLastAnalysis, w3cProjectLastAnalysis
  let catchLighthouse = null
  let catchGreenit = null
  let catchW3c = null
  let errRetrievedAnalysisGreenit = null
  let errRetrievedLighthouseAnalysis = null
  let errRetrievedW3cAnalysis = null

  await greenItRepository
    .findAnalysisProject(projectName)
    .then((res) => {
      if (res.deployments.length !== 0) {
        greenitAnalysisDeployments = formatGreenItAnalysis.formatDeploymentsForGraphs(res.deployments)
        greenitLastAnalysis = formatGreenItAnalysis.greenItProjectLastAnalysisFormatted(res.lastAnalysis)
      } else {
        greenitLastAnalysis = null
        greenitAnalysisDeployments = []
        errRetrievedAnalysisGreenit = 'GET ANALYSIS PROJECT - No greenit analysis found for project ' + projectName
      }
    })
    .catch((err) => {
      catchGreenit = err
    })
  await lighthouseRepository
    .findAnalysisProject(projectName)
    .then((res) => {
      if (res.deployments.length !== 0) {
        // deployments
        lighthouseAnalysisDeployments = formatLighthouseAnalysis.lighthouseAnalysisFormattedDeployments(res.deployments)

        // lastAnalysis
        lighthouseProjectLastAnalysis = formatLighthouseAnalysis.lighthouseProjectLastAnalysisFormatted(res.lastAnalysis)
      } else {
        errRetrievedLighthouseAnalysis = 'GET ANALYSIS PROJECT - No lighthouse Analysis found for project ' + projectName
        lighthouseAnalysisDeployments = []
        lighthouseProjectLastAnalysis = null
      }
    })
    .catch((err) => {
      catchLighthouse = err
    })

  await w3cRepository.findAnalysisProject(projectName).then((res) => {
    if (res.deployments.length !== 0) {
      w3cAnalysisDeployment = formatW3cAnalysis.w3cAnalysisFormattedDeployments(res.deployments)

      // lastAnalysis
      w3cProjectLastAnalysis = formatW3cAnalysis.w3cLastAnalysisFormatted(res.lastAnalysis)
    } else {
      errRetrievedW3cAnalysis = 'GET ANALYSIS PROJECT - No W3C Analysis found for project ' + projectName
      w3cAnalysisDeployment = []
      w3cProjectLastAnalysis = null
    }
  })
    .catch((err) => {
      catchW3c = err
    })

  return new Promise((resolve, reject) => {
    if (catchGreenit instanceof SystemError || catchLighthouse instanceof SystemError || catchW3c instanceof SystemError) {
      reject(new SystemError())
    } else if (catchGreenit !== null || catchLighthouse !== null || catchW3c !== null) {
      reject(new Error('GET ANALYSIS PROJECT - error during generation of ' + projectName + ' analysis'))
    }

    if (errRetrievedLighthouseAnalysis && errRetrievedAnalysisGreenit && errRetrievedW3cAnalysis) reject(new Error('GET ANALYSIS PROJECT - No Analysis found for project ' + projectName))

    // Creating the response content
    const allAnalysis = {
      allowW3c: process.env.ECOSONAR_ENV_ALLOW_EXTERNAL_API,
      deployments: {
        greenit: greenitAnalysisDeployments,
        lighthouse: lighthouseAnalysisDeployments,
        w3c: w3cAnalysisDeployment
      },
      lastAnalysis: {
        greenit: greenitLastAnalysis,
        lighthouse: lighthouseProjectLastAnalysis,
        w3c: w3cProjectLastAnalysis
      }
    }
    resolve(allAnalysis)
  })
}

function groupByProject (idKeys, fieldName, allAnalysis) {
  return allAnalysis.filter(obj => idKeys.includes(obj[fieldName]))
}

function regroupUrlIdKeyByProjectName (projects) {
  return projects.reduce((acc, obj) => {
    const existingObj = acc.find(o => o.projectName === obj.projectName)
    if (existingObj) {
      existingObj.IdKeys.push(obj.idKey)
    } else {
      acc.push({ projectName: obj.projectName, IdKeys: [obj.idKey] })
    }
    return acc
  }, [])
}

/**
   * Get the average of scores (EcoIndex & Performance & Accessibility) from all projects at a range of date
   * @param {string} filterName by default equal to null, if stirng is not null allow to filter project by their name
   * @returns {Object} Returns the formatted average scores
   */
RetrieveAnalysisService.prototype.getProjectScoresAverageAll = async function (filterName = null) {
  const result = []
  let error = null
  try {
    const allLighthouseAnalysis = await lighthouseRepository.findAllAnalysis()
    const allgreenITAnalysis = await greenItRepository.findAllAnalysis()
    const allW3CAnalysis = await w3cRepository.findAllAnalysis()

    let projects = await projectsRepository.findAllProjectsNames(filterName)
    projects = regroupUrlIdKeyByProjectName(projects)
    for (const project of projects) {
      const analysisOfProjectLighthouse = groupByProject(project.IdKeys, 'idUrlLighthouse', allLighthouseAnalysis)
      const analysisOfProjectGreenIt = groupByProject(project.IdKeys, 'idUrlGreen', allgreenITAnalysis)
      const analysisOfProjectW3C = groupByProject(project.IdKeys, 'idUrlW3c', allW3CAnalysis)
      result.push({
        name: project.projectName,
        lighthouse: analysisOfProjectLighthouse,
        greenIt: analysisOfProjectGreenIt,
        w3c: analysisOfProjectW3C
      })
    }
  } catch (err) {
    error = err
  }
  return new Promise((resolve, reject) => {
    if (error !== null) {
      reject(new SystemError())
    } else {
      resolve(result)
    }
  })
}

/**
   * Get the EcoSonar scores (GreenIt & Lighthouse & W3C Validator) from a given project
   * @param {string} projectName
   * @returns {Object} Returns the formatted scores for the given project
   */
RetrieveAnalysisService.prototype.getProjectScores = async function (projectName) {
  let ecoIndex = 0
  let accessScore = 0
  let perfScore = 0
  let w3cScore = 0
  let catchLighthouse = null
  let catchGreenit = null
  let catchW3c = null
  let errRetrievedAnalysisGreenit = null
  let errRetrievedLighthouseAnalysis = null
  let errRetrievedW3cAnalysis = null

  await greenItRepository
    .findScoreProject(projectName)
    .then((res) => {
      if (res.scores !== null) {
        for (const score of res.scores) {
          ecoIndex += score.ecoIndex
        }
        ecoIndex = ecoIndex / res.scores.length
      } else {
        ecoIndex = null
        console.log('GET ECOSONAR PROJECT SCORES - No greenit analysis found for project ' + projectName)
        errRetrievedAnalysisGreenit = 'No greenit analysis found for project ' + projectName
      }
    })
    .catch((err) => {
      ecoIndex = null
      catchGreenit = err
    })
  await lighthouseRepository
    .findScoreProject(projectName)
    .then((res) => {
      if (res.scores !== null) {
        for (const score of res.scores) {
          accessScore += score.accessibility.score
          perfScore += score.performance.score
        }
        accessScore = accessScore / res.scores.length
        perfScore = perfScore / res.scores.length
      } else {
        accessScore = null
        perfScore = null
        console.log('GET ECOSONAR PROJECT SCORES - No lighthouse Analysis found for project ' + projectName)
        errRetrievedLighthouseAnalysis = 'No lighthouse Analysis found for project ' + projectName
      }
    })
    .catch((err) => {
      accessScore = null
      perfScore = null
      catchLighthouse = err
    })

  await w3cRepository.findAnalysisProject(projectName).then((res) => {
    if (res.deployments.length !== 0) {
      const w3cProjectLastAnalysis = formatW3cAnalysis.w3cLastAnalysisFormatted(res.lastAnalysis)
      w3cScore = w3cProjectLastAnalysis.score
    } else {
      w3cScore = null
      console.log('GET ECOSONAR PROJECT SCORES - No W3C Analysis found for project ' + projectName)
      errRetrievedW3cAnalysis = 'No W3C Analysis found for project ' + projectName
    }
  })
    .catch((err) => {
      w3cScore = null
      catchW3c = err
    })

  return new Promise((resolve, reject) => {
    if (catchGreenit instanceof SystemError || catchLighthouse instanceof SystemError || catchW3c instanceof SystemError) {
      reject(new SystemError())
    } else if (errRetrievedLighthouseAnalysis !== null && errRetrievedAnalysisGreenit !== null && errRetrievedW3cAnalysis !== null) reject(new Error('No Analysis found for project ' + projectName))
    resolve({
      ecoIndex: ecoIndex !== null ? Math.round(ecoIndex) : null,
      perfScore: perfScore !== null ? Math.round(perfScore) : null,
      accessibilityScore: accessScore !== null ? Math.round(accessScore) : null,
      w3cScore: w3cScore !== null ? Math.round(w3cScore) : null
    })
  })
}

const retrieveAnalysisService = new RetrieveAnalysisService()
module.exports = retrieveAnalysisService

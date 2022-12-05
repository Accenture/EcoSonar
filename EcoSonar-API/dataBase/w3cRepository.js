
const SystemError = require('../utils/SystemError')
const w3cs = require('./models/w3cs')
const urlsprojects = require('./models/urlsprojects')
const formatW3cAnalysis = require('../services/format/formatW3cAnalysis')

const W3cRepository = function () {
  /**
   * Insert the w3c analysis for a project
   * @param {reportsW3c} reportW3c is a list a the report for the w3c analysis
   * @returns
   */
  this.insertAll = function (reportsW3c) {
    return new Promise((resolve, reject) => {
      if (reportsW3c.length > 0) {
        w3cs
          .insertMany(reportsW3c)
          .then(() => {
            resolve()
          })
          .catch((err) => {
            console.error('\x1b[31m%s\x1b[0m', 'W3C - error during insertion of analysis')
            console.error('\x1b[31m%s\x1b[0m', err.message)
            const systemError = new SystemError()
            reject(systemError)
          })
      } else {
        console.log('W3C - None of the urls analysed could be inserted')
        reject(
          new Error('W3C - None of the urls analysed could be inserted')
        )
      }
    })
  }
  /**
   * find analysis for one url in a project
   * @param {project Name} projectNameReq
   * @param {url Name} urlNameReq
   * @returns
   */
  this.findAnalysisUrl = async function (projectNameReq, urlNameReq) {
    let urlMatching
    let allAnalysis
    let stringErr = null
    let systemError = null
    try {
      urlMatching = await urlsprojects.find(
        { projectName: projectNameReq, urlName: urlNameReq },
        { idKey: 1 }
      )
      if (urlMatching.length === 0) {
        stringErr =
        'url : ' +
        urlNameReq +
        ' or project : ' +
        projectNameReq +
        ' not found'
      } else {
        allAnalysis = await w3cs
          .find(
            { idUrlW3c: urlMatching[0].idKey },
            {
              idUrlW3c: 1,
              dateW3cAnalysis: 1,
              score: 1,
              w3cBestPractices: 1
            }
          )
          .sort({ dateW3cAnalysis: 1 })
        if (allAnalysis.length === 0) {
          stringErr = 'no w3c analysis found for ' + urlNameReq
          console.log(stringErr)
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log('An error occured while retrieving W3C analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (stringErr !== null) {
        reject(new Error(stringErr))
      } else {
        const lastAnalysis = [{
          idUrlW3c: allAnalysis[allAnalysis.length - 1].idUrlW3c,
          dateW3cAnalysis: allAnalysis[allAnalysis.length - 1].dateW3cAnalysis,
          score: allAnalysis[allAnalysis.length - 1].score,
          w3cBestPractices: allAnalysis[allAnalysis.length - 1].w3cBestPractices
        }]
        const w3cLastAnalysis = formatW3cAnalysis.w3cLastAnalysisFormatted(lastAnalysis)

        let i = 0
        let element
        const deployments = []
        while (i < allAnalysis.length) {
          element = {
            idUrlW3c: allAnalysis[i].idUrlW3c,
            dateW3cAnalysis: allAnalysis[i].dateW3cAnalysis,
            score: allAnalysis[i].score,
            w3cBestPractices: allAnalysis[i].w3cBestPractices
          }
          deployments.push(element)
          i++
        }
        const formattedDeployments = formatW3cAnalysis.w3cAnalysisFormattedDeployments(deployments)
        const analysis = { deployments: formattedDeployments, w3cLastAnalysis }
        resolve(analysis)
      }
    })
  }

  /**
   * find analysis for one url in a project
   * @param {project Name} projectNameReq
   * @param {url Name} urlNameReq
   * @returns
   */
  this.findAnalysisUrl = async function (projectNameReq, urlNameReq) {
    let urlMatching
    let allAnalysis
    let stringErr = null
    let systemError = null
    try {
      urlMatching = await urlsprojects.find(
        { projectName: projectNameReq, urlName: urlNameReq },
        { idKey: 1 }
      )
      if (urlMatching.length === 0) {
        stringErr =
        'url : ' +
        urlNameReq +
        ' or project : ' +
        projectNameReq +
        ' not found'
      } else {
        allAnalysis = await w3cs
          .find(
            { idUrlW3c: urlMatching[0].idKey },
            {
              idUrlW3c: 1,
              dateW3cAnalysis: 1,
              score: 1,
              w3cBestPractices: 1
            }
          )
          .sort({ dateW3cAnalysis: 1 })
        if (allAnalysis.length === 0) {
          stringErr = 'no W3C analysis found for ' + urlNameReq
          console.log(stringErr)
        }
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log('An error occured while retrieving W3C analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (stringErr !== null) {
        reject(new Error(stringErr))
      } else {
        const lastAnalysis = [{
          idUrlW3c: allAnalysis[allAnalysis.length - 1].idUrlW3c,
          dateW3cAnalysis: allAnalysis[allAnalysis.length - 1].dateW3cAnalysis,
          score: allAnalysis[allAnalysis.length - 1].score,
          w3cBestPractices: allAnalysis[allAnalysis.length - 1].w3cBestPractices
        }]
        const w3cLastAnalysis = formatW3cAnalysis.w3cLastAnalysisFormatted(lastAnalysis)

        let i = 0
        let element
        const deployments = []
        while (i < allAnalysis.length) {
          element = {
            idUrlW3c: allAnalysis[i].idUrlW3c,
            dateW3cAnalysis: allAnalysis[i].dateW3cAnalysis,
            score: allAnalysis[i].score,
            w3cBestPractices: allAnalysis[i].w3cBestPractices
          }
          deployments.push(element)
          i++
        }
        const formattedDeployments = formatW3cAnalysis.w3cAnalysisFormattedDeployments(deployments)
        const analysis = { deployments: formattedDeployments, w3cLastAnalysis }
        resolve(analysis)
      }
    })
  }

  /**
   * find w3c analysis for one Project
   * @param {project Name} projectName
   * @returns
   */
  this.findAnalysisProject = async function (projectName) {
    let error = null
    let systemError = null

    let deployments, result
    try {
      // Retrieving URLs for the project
      const resList = await urlsprojects.find(
        { projectName },
        { idKey: 1 }
      )

      if (resList.length === 0) {
        error = 'url or project :' + projectName + ' not found'
      } else {
        // Create a list of idKey
        let i = 0
        const listIdKey = []
        while (i < resList.length) {
          listIdKey[i] = resList[i].idKey
          i++
        }
        deployments = await w3cs
          .find(
            { idUrlW3c: listIdKey },
            {
              idUrlW3c: 1,
              dateW3cAnalysis: 1,
              score: 1,
              w3cBestPractices: 1
            }
          )
          .sort({ dateW3cAnalysis: 1 })
        if (deployments.length !== 0) {
          const dateLastAnalysis =
              deployments[deployments.length - 1].dateW3cAnalysis
          const lastDeployment = deployments.filter(
            (deployment) =>
              deployment.dateW3cAnalysis.getTime() ===
                dateLastAnalysis.getTime()
          )
          result = {
            deployments,
            lastAnalysis: lastDeployment
          }
        } else {
          console.log('W3C - No W3C analysis found for ' + projectName)
          result = { deployments: [], lastAnalysis: null }
        }
      }
    } catch (err) {
      console.error('\x1b[31m%s\x1b[0m', err)
      console.log(
        'error during generation of ' + projectName + ' W3C analysis'
      )
      systemError = new SystemError()
    }

    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (error !== null) {
        reject(new Error(error))
      } else {
        resolve(result)
      }
    })
  }

  /**
   * find analysis of w3c best practices  for an URL on the table w3cs
   * @param {name of the project} projectName
   * @param {url} urlName
   * @returns
   */
  this.find = async function (projectName, urlName) {
    let hasNoUrl = false
    let systemError = null
    let resultats
    try {
      const resList = await urlsprojects.find({ projectName, urlName }, { idKey: 1 })
      if (resList.length < 1) {
        hasNoUrl = true
      } else {
        resultats = await w3cs.find({ idUrlW3c: resList[0].idKey },
          {
            idUrlW3c: 1,
            dateW3cAnalysis: 1,
            score: 1,
            w3cBestPractices: 1
          }
        )
          .sort({ dateW3cAnalysis: -1 }).limit(1)
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      console.log(`Error during generation of ${urlName} w3c best practices analysis`)
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (hasNoUrl) {
        reject(new Error(`W3C BEST PRACTICES PROJECT - No analysis found for url ${urlName} into project ${projectName}`))
      } else {
        resolve(resultats)
      }
    })
  }

  /**
   * Deletion of one or more w3c analysis on the w3cs collection
   * @param {name of the project} projectNameReq
   * @returns
   */
  this.delete = async function (projectNameReq) {
    let empty = false
    let errDelete = false
    let resAnalysis
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        empty = true
      } else {
        const listIdKey = resList.map(url => url.idKey)
        resAnalysis = await w3cs.deleteMany({ idUrlW3c: listIdKey })
      }
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', error)
      errDelete = true
    }
    return new Promise((resolve, reject) => {
      if (errDelete) {
        const systemError = new SystemError()
        console.log('error during deletion of w3c analysis in ' + projectNameReq)
        reject(systemError)
      } else if (empty) {
        console.log('w3c analysis for ' + projectNameReq + ' not found')
        reject(new Error('w3c analysis for ' + projectNameReq + ' not found'))
      } else {
        if (resAnalysis.deletedCount >= 1) {
          console.log('w3c of project ' + projectNameReq + ' where deleted')
        } else {
          console.log('no w3c found in ' + projectNameReq)
        }
        resolve()
      }
    })
  }
}

const w3cRepository = new W3cRepository()
module.exports = w3cRepository

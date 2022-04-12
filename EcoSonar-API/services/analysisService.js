const greenItRepository = require('../dataBase/GreenItRepository')
const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const urlsProjectRepository = require('../dataBase/UrlsProjectRepository')
const lighthouseRepository = require('../dataBase/LighthouseRepository')
const lighthouseAnalysis = require('./lighthouse/lighthouse')
const formatLighthouseMetrics = require('./format/formatLighthouseMetrics')
const uniqid = require('uniqid')
const greenItAnalysis = require('./greenit-analysis/analyseService')
const formatLighthouseAnalysis = require('./format/formatLighthouseAnalysis')
const SystemError = require('../utils/SystemError')
const formatGreenItAnalysis = require('./format/formatGreenItAnalysis')

class AnalysisService {}

AnalysisService.prototype.insert = async function (projectName) {
  let urlProjectList = []
  try {
    urlProjectList = await urlsProjectRepository.findAll(projectName, true)
  } catch (error) {
    console.log('GREENIT INSERT - can not retrieved urls from project')
  }

  let urlIdList = []
  let reportsGreenit = []
  let reportsLighthouse = []
  let urlList = []
  if (urlProjectList.length !== 0) {
    urlIdList = urlProjectList.map((url) => url.idKey)
    urlList = urlProjectList.map((url) => url.urlName)
    try {
      reportsGreenit = await greenItAnalysis.analyse(urlList)
    } catch (error) {
      console.log(error)
    }
    try {
      reportsLighthouse = await lighthouseAnalysis.lighthouseAnalysis(urlList)
    } catch (error) {
      console.log(error)
    }
  }
  const urlIdListGreenit = Object.values(urlIdList)
  const urlIdListBestPracticesEchec = []
  let i = 0
  let j
  let find = false
  while (i < urlIdListGreenit.length) {
    j = 0
    while (!reportsGreenit[i].success && !find) {
      if (reportsGreenit[i].url === urlList[j]) {
        find = true
        urlIdListBestPracticesEchec.push(urlIdListGreenit[j])
        urlList[j] = null
        urlIdListGreenit[j] = null
      } else {
        j++
      }
    }
    find = false
    i++
  }

  const tabLighthouse = []
  i = 0
  let nb,
    perf,
    access,
    string,
    largestContentfulPaint,
    cumulativeLayoutShift,
    firstContentfulPaint,
    speedIndex,
    totalBlockingTime,
    interactive
  const date = Date.now()
  while (i < urlIdList.length) {
    if (
      reportsLighthouse[i] &&
      reportsLighthouse[i].runtimeError === undefined
    ) {
      nb = uniqid()
      perf = formatLighthouseMetrics.formatPerf(reportsLighthouse[i])
      access = formatLighthouseMetrics.formatAccess(reportsLighthouse[i])
      largestContentfulPaint =
        formatLighthouseMetrics.formatLargestContentfulPaint(
          reportsLighthouse[i]
        )
      cumulativeLayoutShift =
        formatLighthouseMetrics.formatCumulativeLayoutShift(
          reportsLighthouse[i]
        )
      firstContentfulPaint = formatLighthouseMetrics.formatFirstContentfulPaint(
        reportsLighthouse[i]
      )
      speedIndex = formatLighthouseMetrics.formatSpeedIndex(
        reportsLighthouse[i]
      )
      totalBlockingTime = formatLighthouseMetrics.formatTotalBlockingTime(
        reportsLighthouse[i]
      )
      interactive = formatLighthouseMetrics.formatInteractive(
        reportsLighthouse[i]
      )

      string = {
        idLighthouseAnalysis: nb,
        idUrlLighthouse: urlIdList[i],
        dateLighthouseAnalysis: date,
        performance: perf,
        accessibility: access,
        largestContentfulPaint: largestContentfulPaint,
        cumulativeLayoutShift: cumulativeLayoutShift,
        firstContentfulPaint: firstContentfulPaint,
        speedIndex: speedIndex,
        totalBlockingTime: totalBlockingTime,
        interactive: interactive
      }
      tabLighthouse.push(string)
    }
    i++
  }
  if (urlProjectList.length !== 0) {
    greenItRepository
      .insertAll(reportsGreenit, urlIdListGreenit, urlList)
      .then(() => {
        console.log('GREENIT INSERT - analysis has been insert')
      })
      .catch(() => {
        console.log('GREENIT INSERT - greenit insertion failed')
      })
    lighthouseRepository
      .insertAll(tabLighthouse)
      .then(() => {
        console.log('LIGHTHOUSE INSERT - analysis has been insert')
      })
      .catch(() => {
        console.log('LIGHTHOUSE INSERT - lighthouse insertion failed')
      })

    let bestPracticesList = []
    try {
      bestPracticesList = await bestPracticesRepository.findAll(projectName)
    } catch (error) {
      console.log(
        'BEST PRACTICES UDPATE - can not retrieved existing best practices'
      )
    }
    let update = false
    if (bestPracticesList.length > 0) {
      update = true
      await bestPracticesRepository
        .delete(projectName, urlIdListBestPracticesEchec)
        .catch(() => {
          console.log('BEST PRACTICES UDPATE - delete failed')
        })
    }
    bestPracticesRepository
      .insertAll(reportsGreenit, urlIdListGreenit, urlList)
      .then(() => {
        if (update) {
          console.log(
            'BEST PRACTICES UPDATE - Best practices have been updated'
          )
        } else {
          console.log(
            'BEST PRACTICES INSERT - Best practices have been inserted'
          )
        }
      })
      .catch(() => {
        console.log('BEST PRACTICES UPDATE : update failed')
      })
  } else {
    console.log('No url found for project : ' + projectName)
  }
}

AnalysisService.prototype.getUrlAnalysis = async function (
  projectName,
  urlName
) {
  let greenitAnalysis = null
  let lighthouseResult = null
  let errorRetrievedGreenItAnalysis = null
  let errorRetrievedLighthouseAnalysis = null
  await greenItRepository
    .findAnalysisUrl(projectName, urlName)
    .then((resultat) => {
      greenitAnalysis = resultat
    })
    .catch((err) => {
      errorRetrievedGreenItAnalysis = err
    })
  await lighthouseRepository
    .findAnalysisUrl(projectName, urlName)
    .then((resultat) => {
      lighthouseResult = resultat
    })
    .catch((err) => {
      errorRetrievedLighthouseAnalysis = err
    })
  return new Promise((resolve, reject) => {
    let date = null
    if (
      errorRetrievedGreenItAnalysis === null &&
      errorRetrievedLighthouseAnalysis === null
    ) {
      if (
        greenitAnalysis.deployments[
          greenitAnalysis.deployments.length - 1
        ].dateAnalysis.getTime() <
        lighthouseResult.lastAnalysis.dateLighthouseAnalysis.getTime()
      ) {
        date =
          greenitAnalysis.deployments[greenitAnalysis.deployments.length - 1]
            .dateGreenAnalysis
      } else {
        date = lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      }
      delete lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      const analysis = {
        deployments: {
          greenit: greenitAnalysis.deployments,
          lighthouse: lighthouseResult.deployments
        },
        lastAnalysis: {
          dateAnalysis: date,
          greenit: greenitAnalysis.lastAnalysis,
          lighthouse: lighthouseResult.lastAnalysis
        }
      }
      resolve(analysis)
    } else if (errorRetrievedGreenItAnalysis === null) {
      date =
        greenitAnalysis.deployments[greenitAnalysis.deployments.length - 1]
          .dateGreenAnalysis
      const analysis = {
        deployments: { greenit: greenitAnalysis.deployments, lighthouse: [] },
        lastAnalysis: {
          dateAnalysis: date,
          greenit: greenitAnalysis.lastAnalysis,
          lighthouse: null
        }
      }
      resolve(analysis)
    } else if (errorRetrievedLighthouseAnalysis === null) {
      date = lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      delete lighthouseResult.lastAnalysis.dateLighthouseAnalysis
      const analysis = {
        deployments: {
          greenit: [],
          lighthouse: lighthouseResult.deployments
        },
        lastAnalysis: {
          dateAnalysis: date,
          greenit: null,
          lighthouse: lighthouseResult.lastAnalysis
        }
      }
      resolve(analysis)
    } else {
      if (
        errorRetrievedGreenItAnalysis instanceof SystemError ||
        errorRetrievedLighthouseAnalysis instanceof SystemError
      ) {
        reject(new SystemError())
      } else if (
        errorRetrievedGreenItAnalysis === errorRetrievedLighthouseAnalysis
      ) {
        reject(errorRetrievedGreenItAnalysis)
      } else {
        reject(
          new Error(
            'No lighthouse and greenit analysis found for url ' +
              urlName +
              ' in project ' +
              projectName
          )
        )
      }
    }
  })
}

AnalysisService.prototype.getProjectAnalysis = async function (projectName) {
  let greenitAnalysisDeployments = []
  let greenitLastAnalysis
  let lighthouseAnalysisDeployments = []
  let lighthouseProjectLastAnalysis
  let catchLighthouse = null
  let catchGreenit = null
  let errRetrievedAnalysisGreenit = null
  let errRetrievedLighthouseAnalysis = null
  await greenItRepository
    .findAnalysisProject(projectName)
    .then((res) => {
      if (res.deployments.length !== 0) {
        greenitAnalysisDeployments = formatGreenItAnalysis.formatDeploymentsForGraphs(res.deployments)
        greenitLastAnalysis = formatGreenItAnalysis.greenItProjectLastAnalysisFormatted(res.lastAnalysis)
      } else {
        greenitLastAnalysis = null
        greenitAnalysisDeployments = []
        errRetrievedAnalysisGreenit =
          'No greenit analysis found for project ' + projectName
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
        lighthouseAnalysisDeployments =
          formatLighthouseAnalysis.lighthouseAnalysisFormattedDeployments(
            res.deployments
          )

        // lastAnalysis
        lighthouseProjectLastAnalysis =
          formatLighthouseAnalysis.lighthouseProjectLastAnalysisFormatted(
            res.lastAnalysis
          )
      } else {
        errRetrievedLighthouseAnalysis =
          'No lighthouse Analysis found for project ' + projectName
        lighthouseAnalysisDeployments = []
        lighthouseProjectLastAnalysis = null
      }
    })
    .catch((err) => {
      catchLighthouse = err
    })

  return new Promise((resolve, reject) => {
    if (
      catchGreenit instanceof SystemError ||
      catchLighthouse instanceof SystemError
    ) {
      reject(new SystemError())
    } else if (catchGreenit !== null || catchLighthouse !== null) {
      reject(
        new Error('error during generation of ' + projectName + ' analysis')
      )
    }

    let dateLastAnalysis
    if (
      errRetrievedLighthouseAnalysis === null &&
      errRetrievedAnalysisGreenit === null
    ) {
      if (
        greenitAnalysisDeployments[
          greenitAnalysisDeployments.length - 1
        ].dateAnalysis.getTime() < lighthouseProjectLastAnalysis.dateAnalysis.getTime()
      ) {
        dateLastAnalysis =
          greenitAnalysisDeployments[greenitAnalysisDeployments.length - 1]
            .dateAnalysis
      } else {
        dateLastAnalysis = lighthouseProjectLastAnalysis.dateAnalysis
      }
      delete lighthouseProjectLastAnalysis.dateAnalysis
    } else if (errRetrievedLighthouseAnalysis === null) {
      dateLastAnalysis = lighthouseProjectLastAnalysis.dateAnalysis
      delete lighthouseProjectLastAnalysis.dateAnalysis
    } else if (errRetrievedAnalysisGreenit === null) {
      dateLastAnalysis =
        greenitAnalysisDeployments[greenitAnalysisDeployments.length - 1]
          .dateAnalysis
    } else {
      reject(new Error('No Analysis found for project ' + projectName))
    }

    const allAnalysis = {
      deployments: {
        greenit: greenitAnalysisDeployments,
        lighthouse: lighthouseAnalysisDeployments
      },
      lastAnalysis: {
        dateAnalysis: dateLastAnalysis,
        greenit: greenitLastAnalysis,
        lighthouse: lighthouseProjectLastAnalysis
      }
    }
    resolve(allAnalysis)
  })
}

const analysisService = new AnalysisService()
module.exports = analysisService

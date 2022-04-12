const uniqid = require('uniqid')
const bestpractices = require('./models/bestpractices')
const urlsprojects = require('./models/urlsprojects')
const SystemError = require('../utils/SystemError')

const BestPracticesRepository = function () {
  /**
   * insertion of one or more analysis of best practices on the table bestPractices
   * @param {analysis of url} reports
   * @param {list of id of urls} urlIdList
   * @param {list of urls} urlList
   * @returns
   */
  this.insertAll = async function (reports, urlIdList, urlList) {
    const tab = []
    let i = 0
    let nb
    const date = Date.now()
    let string
    let j = 0
    let find = false
    while (i < urlIdList.length) {
      if (urlIdList[i] !== null) {
        j = 0
        while (j < reports.length && !find) {
          if (reports[j].url === urlList[i]) {
            find = true
          } else {
            j++
          }
        }
        find = false
        nb = uniqid()
        string = {
          idAnalysisBestPractices: nb,
          idUrl: urlIdList[i],
          dateAnalysisBestPractices: date,
          bestPractices: reports[j].bestPractices
        }
        tab.push(string)
      }
      i++
    }
    return new Promise((resolve, reject) => {
      if (tab.length > 0) {
        bestpractices.insertMany(tab)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            console.log(error)
            const systemError = new SystemError()
            reject(systemError)
          })
      } else {
        console.log('None of the urls analyzed could be inserted')
        reject(new Error('None of the urls analyzed could be inserted'))
      }
    })
  }

  /**
   * deletion of one or more analysis of best practices on the table bestPractices
   * @param {name of the project} projectNameReq
   * @returns
   */
  this.delete = async function (projectNameReq, urlIdListBestPracticesEchec) {
    let empty = false
    let errDelete = false
    let resAnalysis
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        empty = true
      } else {
        const listIdKey = resList.map(url => url.idKey)
        resAnalysis = await bestpractices.deleteMany({ idUrl: listIdKey })
      }
    } catch (err) {
      console.log(err)
      errDelete = true
    }
    return new Promise((resolve, reject) => {
      if (errDelete) {
        const systemError = new SystemError()
        console.log('error during deletion of best practices analysis in ' + projectNameReq)
        reject(systemError)
      } else if (empty) {
        console.log('Best practices analysis for ' + projectNameReq + ' not found')
        reject(new Error('Best practices analysis for ' + projectNameReq + ' not found'))
      } else {
        if (resAnalysis.deletedCount >= 1) {
          console.log('Best practices analysis of project ' + projectNameReq + ' where deleted')
        } else {
          console.log('no best practices analysis found in ' + projectNameReq)
        }
        resolve()
      }
    })
  }

  /**
   * find All analysis of best practices  for a project on the table bestPractices
   * @param {name of the project} projectNameReq
   * @returns
   */
  this.findAll = async function (projectNameReq) {
    let hasNoUrl = false
    let systemError = null
    let resultats
    try {
      const resList = await urlsprojects.find({ projectName: projectNameReq }, { idKey: 1 })
      if (resList.length === 0) {
        hasNoUrl = true
      } else {
        // create a list of idKey
        let i = 0
        const listIdKey = []
        while (i < resList.length) {
          listIdKey[i] = resList[i].idKey
          i++
        }
        resultats = await bestpractices.find({ idUrl: listIdKey }, { bestPractices: 1 })
      }
    } catch (err) {
      console.log(err)
      console.log('error during generation of ' + projectNameReq + ' best practices analysis')
      systemError = new SystemError()
    }
    return new Promise((resolve, reject) => {
      if (systemError !== null) {
        reject(systemError)
      } else if (hasNoUrl) {
        reject(new Error('No analysis found for project' + projectNameReq))
      } else {
        resolve(resultats)
      }
    })
  }
}
const bestPracticesRepository = new BestPracticesRepository()
module.exports = bestPracticesRepository

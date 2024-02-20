const lighthouses = require('./models/lighthouses')
const SystemError = require('../utils/SystemError')

const LighthouseRepository = function () {
  /**
   * insertion of one or more lighthouse analysis on the table lighthouses
   * @param {Array} lighthouseMetricsReports lightouse reports
   */
  this.insertAll = function (lighthouseMetricsReports) {
    return new Promise((resolve, reject) => {
      if (lighthouseMetricsReports.length > 0) {
        lighthouses
          .insertMany(lighthouseMetricsReports)
          .then(() => {
            resolve()
          })
          .catch((err) => {
            console.error('\x1b[31m%s\x1b[0m', err)
            reject(new SystemError())
          })
      } else {
        console.log('LIGHTHOUSE - None of the urls analysed could be inserted')
        reject(
          new Error('LIGHTHOUSE - None of the urls analysed could be inserted')
        )
      }
    })
  }

  /**
   * find all Lighthouse analysis saved in EcoSonar
   * @returns all ligthouse reports
   */
  this.findAllAnalysis = async function () {
    return new Promise((resolve, reject) => {
      lighthouses.find({}, {
        dateLighthouseAnalysis: 1,
        performance: 1,
        accessibility: 1,
        idUrlLighthouse: 1
      })
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find last analysis for one url in a project
   * @param {string} urlIdKey id key of the url saved
   * @returns last ligthouse analysis for url
   */
  this.findAnalysisUrl = async function (urlIdKey) {
    return new Promise((resolve, reject) => {
      lighthouses
        .find(
          { idUrlLighthouse: urlIdKey },
          {
            dateLighthouseAnalysis: 1,
            performance: 1,
            accessibility: 1,
            cumulativeLayoutShift: 1,
            largestContentfulPaint: 1,
            firstContentfulPaint: 1,
            speedIndex: 1,
            totalBlockingTime: 1,
            interactive: 1
          }
        )
        .sort({ dateLighthouseAnalysis: 1 })
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find last lighthouse analysis for one Project
   * @param {array} urls list of urls id keys
   * @returns last lighthouse analysis for the project
   */
  this.findAnalysisProject = async function (listIdKey) {
    return new Promise((resolve, reject) => {
      lighthouses
        .find(
          { idUrlLighthouse: listIdKey },
          {
            performance: 1,
            accessibility: 1,
            largestContentfulPaint: 1,
            cumulativeLayoutShift: 1,
            firstContentfulPaint: 1,
            speedIndex: 1,
            totalBlockingTime: 1,
            interactive: 1,
            dateLighthouseAnalysis: 1
          }
        )
        .sort({ dateLighthouseAnalysis: 1 })
        .then((result) => { resolve(result) })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * find Lighthouse Scores for one Project
   * @param {array} listIdKey list of urls id keys
   * @returns ligthouse score for analysis in the project
   */
  this.findScoreProject = async function (listIdKey) {
    return new Promise((resolve, reject) => {
      lighthouses
        .find(
          { idUrlLighthouse: listIdKey },
          {
            performance: 1,
            accessibility: 1,
            dateLighthouseAnalysis: 1
          }
        )
        .sort({ dateLighthouseAnalysis: 1 })
        .then((result) => { resolve(result) })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Deletion of all lighthouses analysis for a url
   * @param {Object} url url to be deleted
   */
  this.deleteAnalysisFromUrl = async function (url) {
    return new Promise((resolve, reject) => {
      lighthouses.deleteMany({ idUrlLighthouse: url[0].idKey })
        .then((result) => {
          console.log(`DELETE URL - On Lighthouse ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }

  /**
   * Deletion of all lighthouses analysis for a project
   * @param {Array} urlIdKeyList list of id key representing urls saved
   */
  this.deleteProject = async function (urlIdKeyList) {
    return new Promise((resolve, reject) => {
      lighthouses.deleteMany({ idUrlLighthouse: { $in: urlIdKeyList } })
        .then((result) => {
          console.log(`DELETE URLS PROJECT - On Lighthouse ${result.deletedCount} objects removed`)
          resolve()
        })
        .catch((error) => {
          console.error('\x1b[31m%s\x1b[0m', error)
          reject(new SystemError())
        })
    })
  }
}

const lighthouseRepository = new LighthouseRepository()
module.exports = lighthouseRepository

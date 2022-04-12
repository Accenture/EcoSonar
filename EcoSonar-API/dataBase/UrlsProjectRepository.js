const uniqid = require('uniqid')
const urlsprojects = require('./models/urlsprojects')
const greenits = require('./models/greenits')
const bestpractices = require('./models/bestpractices')
const lighthouses = require('./models/lighthouses')
const SystemError = require('../utils/SystemError')

const UrlsProjectRepository = function () {
  /**
   * insertion of one or more url on the table urlsProject : OK
   * @param {*} values
   * @returns
   */
  this.insertAll = async function (values) {
    const project = values[0]
    let varUrl, list, number
    const tab = []
    let indextab = 0
    let a = 1
    while (a < values.length) {
      varUrl = values[a]
      number = uniqid()
      list = { idKey: number, projectName: project, urlName: varUrl }
      tab[indextab] = list
      indextab = indextab + 1
      a = a + 1
    }
    return new Promise((resolve, reject) => {
      urlsprojects.insertMany(tab)
        .then(() => { resolve() })
        .catch((err) => {
          console.log(err)
          if (err._message === 'urlsprojects validation failed') {
            const nb = values.indexOf(err.errors.urlName.properties.value)
            a = 0
            const tabErreur = []
            while (a < values.length - 1) {
              if (a + 1 !== nb) {
                tabErreur[a] = ''
              } else {
                tabErreur[a] = ' Url has an invalid syntax'
              }
              a++
            }
            reject(tabErreur)
          } else {
            const systemError = new SystemError()
            reject(systemError)
          }
        })
    })
  }

  /**
     * deletion on the table urlsProject : OK
     * @param {id url} key
     */
  this.delete = async function (projectNameReq, urlNameReq) {
    let empty = false
    let errDelete = false
    try {
      const idKey = await urlsprojects.find({ projectName: projectNameReq, urlName: urlNameReq }, { idKey: 1 })
      if (idKey.length === 0) {
        empty = true
      } else {
        await greenits.deleteMany({ idUrlGreen: idKey[0].idKey })
        await bestpractices.deleteOne({ idUrl: idKey[0].idKey })
        await lighthouses.deleteMany({ idUrlLighthouse: idKey[0].idKey })
        await urlsprojects.deleteOne({ projectName: projectNameReq, urlName: urlNameReq })
      }
    } catch (err) {
      console.log(err)
      errDelete = true
    }
    return new Promise((resolve, reject) => {
      if (errDelete) {
        const systemError = new SystemError()
        reject(systemError)
      } else if (empty) {
        console.log(urlNameReq + ' in ' + projectNameReq + ' not found')
        reject(new Error(urlNameReq + ' in ' + projectNameReq + ' not found'))
      } else {
        console.log('analysis linked to url ' + urlNameReq + ' from ' + projectNameReq + ' were deleted as well as url')
        resolve()
      }
    })
  }

  /**
   * display all urls of a project : OK
   * @param {name of the project} projectName
   */
  this.findAll = async function (projectNameReq, insert) {
    return new Promise((resolve, reject) => {
      let res
      try {
        if (insert) {
          res = urlsprojects.find({ projectName: projectNameReq })
        } else {
          res = urlsprojects.find({ projectName: projectNameReq }, { urlName: 1 })
        }
        resolve(res)
      } catch (err) {
        console.log(err)
        const systemError = new SystemError()
        reject(systemError)
      }
    })
  }
}

const urlsProjectRepository = new UrlsProjectRepository()
module.exports = urlsProjectRepository

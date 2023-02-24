const urlsProjectRepository = require('../dataBase/urlsProjectRepository')
const SystemError = require('../utils/SystemError')

class UrlConfigurationService {
}
UrlConfigurationService.prototype.getAll = function (projectName) {
  return new Promise((resolve, reject) => {
    urlsProjectRepository.findAll(projectName, false).then((resultats) => {
      if (resultats.length === 0) {
        reject(new Error('Your project has no url assigned into EcoSonar. You must at least add one url if you want to analyse ecodesign practices.'))
      }
      const resultatsFormatted = resultats.map((res) => res.urlName)
      resolve(resultatsFormatted)
    })
  }
  )
}

/**
 * @param {String} projectName is the name of the project on wich we try to insert urls
 * @param {*} urlList is the list of the URLs to be inserted
 * This function will do 2 checks :
 * 1 - Verify into database if URL isn't already registered
 * 2-  Verify that every URLs in the list is different
 * Later a check about syntax is made (using REGEX)
 * URLs are trimmed to avoid issues with copy-paste adding whitespace and tab charactes
 * @reject in case of error, the function reject error type and description
 */

UrlConfigurationService.prototype.insert = async function (projectName, urlList) {
  // Initializing parameters
  const notInsertedArray = []
  const errorArray = []
  let systemError = false
  // Retrieving URLs in database for project
  const urlAlreadyAddedInProject = await urlsProjectRepository.findAll(projectName, true)
    .then((urlList) => urlList.map((res) => res.urlName))
    .catch((error) => {
      if (error instanceof SystemError) {
        systemError = true
      }
    })

  let index = 0
  while (index < urlList.length) {
    const newList = urlList.filter((url) => url.trim() === urlList[index].trim())
    if (urlAlreadyAddedInProject.includes(urlList[index].trim()) || newList.length > 1) {
      notInsertedArray.push(urlList[index].trim())
      errorArray[index] = 'URL was duplicated or already inserted'
    } else {
      errorArray[index] = ''
    }
    index++
  }

  return new Promise((resolve, reject) => {
    if (notInsertedArray.length === 0 && !systemError) {
      urlsProjectRepository.insertAll(projectName, urlList)
        .then(() => resolve())
        .catch((error) => { reject(error) })
    } else if (systemError) {
      reject(new SystemError())
    } else {
      reject(errorArray)
    }
  })
}

UrlConfigurationService.prototype.delete = async function (projectName, urlName) {
  return new Promise((resolve, reject) => {
    urlsProjectRepository.delete(projectName, urlName)
      .then((res) => { resolve(res) })
      .catch((error) => { reject(error) })
  })
}

const urlConfigurationService = new UrlConfigurationService()
module.exports = urlConfigurationService

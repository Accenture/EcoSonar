const tempUrlsProjectRepository = require('../dataBase/tempurlsProjectRepository')
const urlsProjectRepository = require('../dataBase/urlsProjectRepository')
const SystemError = require('../utils/SystemError')

class UrlConfigurationService {
}

/**
 * @param {String} projectName is the name of the project
 * Retrieve the urls saved for the project (those who will be audited when running an analysis)
 * @return list of urls saved
 * @return list of errors (duplication or validation)
 */
UrlConfigurationService.prototype.getAll = function (projectName) {
  return new Promise((resolve, reject) => {
    urlsProjectRepository.findAll(projectName, false)
      .then((results) => {
        if (results.length === 0) {
          reject(new Error('Your project has no url assigned into EcoSonar. You must at least add one url if you want to analyse ecodesign practices.'))
        }
        const resultatsFormatted = results.map((res) => res.urlName)
        resolve(resultatsFormatted)
      })
      .catch((error) => {
        reject(error)
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
 * 3-  Insert into database
 * 4-  Remove crawled urls that have been saved
 * Later a check about syntax is made (using REGEX)
 * URLs are trimmed to avoid issues with copy-paste adding whitespace and tab charactes
 * @reject in case of error, the function reject error type and description
 */
UrlConfigurationService.prototype.insert = async function (projectName, urlList) {
  // Initializing parameters

  let systemError = false
  let urlAlreadyAddedInProject = []
  let errorRegexp = []
  // Retrieving URLs in database for project
  await urlsProjectRepository.findAll(projectName, true)
    .then((urlListResult) => { urlAlreadyAddedInProject = urlListResult.map((res) => res.urlName) })
    .catch((error) => {
      if (error instanceof SystemError) {
        systemError = true
      }
    })

  const { errorArray, notInsertedArray } = verifyNoDuplication(urlList, urlAlreadyAddedInProject)

  if (notInsertedArray.length === 0 && !systemError) {
    urlsProjectRepository.insertAll(projectName, urlList)
      .catch((error) => {
        if (error instanceof SystemError) {
          systemError = true
        }
        errorRegexp = error
      })
  }

  if (notInsertedArray.length === 0 && !systemError && errorRegexp.length === 0) {
    systemError = await removeTemporaryUrlsThatWereSaved(projectName, urlList)
  }

  return new Promise((resolve, reject) => {
    if (notInsertedArray.length > 0) {
      console.log('URL CONFIGURATION SERVICE - Some urls are duplicated')
      reject(errorArray)
    } else if (errorRegexp.length > 0) {
      console.log('URL CONFIGURATION SERVICE - Some urls are invalid')
      reject(errorRegexp)
    } else if (systemError) {
      console.log('URL CONFIGURATION SERVICE - An error occured when reaching the database')
      reject(new SystemError())
    } else {
      resolve()
    }
  })
}

function verifyNoDuplication (urlList, urlAlreadyAddedInProject) {
  const errorArray = []
  const notInsertedArray = []
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
  return { errorArray, notInsertedArray }
}

async function removeTemporaryUrlsThatWereSaved (projectName, urlList) {
  // Retrieved all urls crawled to remove saved urls
  let systemError = false
  await tempUrlsProjectRepository.findUrls(projectName)
    .then((crawledList) => {
      const urlsCrawledList = crawledList ? crawledList.urlsList : []
      if (urlsCrawledList.length > 0) {
        // remove urls that were saved previously in the temporary url list
        const crawledNotSaved = urlsCrawledList.filter(e => !urlList.includes(e))
        tempUrlsProjectRepository.updateUrls(projectName, crawledNotSaved)
          .catch(() => {
            systemError = true
          })
      }
    })
    .catch(() => {
      systemError = true
    })
  return systemError
}

/**
 * @param {String} projectName is the name of the project
 * @param {String} urlName is the url in the project to be deleted
 * Delete a url into a project
 */
UrlConfigurationService.prototype.delete = async function (projectName, urlName) {
  return new Promise((resolve, reject) => {
    urlsProjectRepository.delete(projectName, urlName)
      .then((res) => { resolve(res) })
      .catch((error) => { reject(error) })
  })
}

const urlConfigurationService = new UrlConfigurationService()
module.exports = urlConfigurationService

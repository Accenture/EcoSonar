const tempUrlsProjectRepository = require('../dataBase/tempurlsProjectRepository')
const urlsProjectRepository = require('../dataBase/urlsProjectRepository')
const greenItRepository = require('../dataBase/greenItRepository')
const lighthouseRepository = require('../dataBase/lighthouseRepository')
const bestPracticesRepository = require('../dataBase/bestPracticesRepository')
const w3cRepository = require('../dataBase/w3cRepository')
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
    urlsProjectRepository.findAll(projectName)
      .then((results) => {
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
 * @param {*} urlToBeAdded is the list of the URLs to be inserted
 * This function will do 2 checks :
 * 1 - Verify into database if URL isn't already registered
 * 2-  Verify that every URLs in the list is different
 * 3-  Insert into database
 * 4-  Remove crawled urls that have been saved
 * Later a check about syntax is made (using REGEX)
 * URLs are trimmed to avoid issues with copy-paste adding whitespace and tab charactes
 * @reject in case of error, the function reject error type and description
 */
UrlConfigurationService.prototype.insert = async function (projectName, urlToBeAdded) {
  let systemError = false
  let urlAlreadyAddedInProject = []
  let errorRegexp = []

  await urlsProjectRepository.findAll(projectName)
    .then((urls) => { urlAlreadyAddedInProject = urls.map((res) => res.urlName) })
    .catch((error) => {
      if (error instanceof SystemError) {
        systemError = true
      }
    })

  const { errorArray, notInsertedArray } = verifyNoDuplication(urlToBeAdded, urlAlreadyAddedInProject)

  if (!systemError && notInsertedArray.length === 0) {
    urlsProjectRepository.insertAll(projectName, urlToBeAdded)
      .catch((error) => {
        if (error instanceof SystemError) {
          systemError = true
        } else {
          errorRegexp = error
        }
      })
  }

  if (!systemError && notInsertedArray.length === 0 && errorRegexp.length === 0) {
    systemError = await removeTemporaryUrlsThatWereSaved(projectName, urlToBeAdded)
  }

  return new Promise((resolve, reject) => {
    if (notInsertedArray.length > 0) {
      console.error('URL CONFIGURATION SERVICE - Some urls are duplicated')
      reject(errorArray)
    } else if (errorRegexp.length > 0) {
      console.error('URL CONFIGURATION SERVICE - Some urls are invalid')
      reject(errorRegexp)
    } else if (systemError) {
      console.error('URL CONFIGURATION SERVICE - An error occured when reaching the database')
      reject(new SystemError())
    } else {
      resolve()
    }
  })
}

function verifyNoDuplication (urlToBeAdded, urlAlreadyAddedInProject) {
  const errorArray = []
  const notInsertedArray = []
  let index = 0
  while (index < urlToBeAdded.length) {
    const urlToBeChecked = urlToBeAdded[index].trim()
    const listWithDuplicates = urlToBeAdded.filter((url) => url.trim() === urlToBeChecked)
    if (urlAlreadyAddedInProject.includes(urlToBeChecked) || listWithDuplicates.length > 1) {
      notInsertedArray.push(urlToBeChecked)
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
  let systemError = false
  let urlToDelete = []

  await urlsProjectRepository.findAll(projectName)
    .then((result) => {
      urlToDelete = result.filter((e) => e.urlName === urlName)
    }).catch(() => {
      systemError = true
    })

  if (!systemError && urlToDelete.length > 0) {
    try {
      await lighthouseRepository.deleteAnalysisFromUrl(urlToDelete)
      await greenItRepository.deleteAnalysisFromUrl(urlToDelete)
      await w3cRepository.deleteAnalysisFromUrl(urlToDelete)
      await bestPracticesRepository.deleteAnalysisFromUrl(urlToDelete)
      await urlsProjectRepository.deleteUrl(urlToDelete)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(new SystemError())
    }
  } else if (systemError) {
    return Promise.reject(new SystemError())
  } else {
    return Promise.reject(new Error(urlName + ' in ' + projectName + ' not found'))
  }
}

const urlConfigurationService = new UrlConfigurationService()
module.exports = urlConfigurationService

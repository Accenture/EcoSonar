const urlsProjectRepository = require('../dataBase/urlsProjectRepository')

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
 * @param {*} urlsList is the list of the URLs to be inserted
 * This function will do 2 checks :
 * 1 - Verify into database if URL isn't already registered
 * 2-  Verify that every URLs in the list is different
 * Later a check about syntax is made (using REGEX)
 * URLs are trimmed to avoid issues with copy-paste adding whitespace and tab charactes
 * @reject in case of error, the function reject error type and description
 */

UrlConfigurationService.prototype.insert = async function (projectName, urlsList) {
  // Retrieving URLs in database for project
  const formattedArray = await urlsProjectRepository.findAll(projectName, true).then((res) => res.map((res) => res.urlName))

  // Initializing parameters
  const values = []
  values.push(projectName)
  const notInsertedArray = []
  const errorArray = []

  // Excluding duplicate already existing in database
  let i = 0
  while (i < urlsList.length) {
    if (formattedArray.includes(urlsList[i].trim())) {
      if (!notInsertedArray.includes(urlsList[i].trim())) {
        notInsertedArray.push(urlsList[i].trim())
      }
      errorArray[i] = 'URL was duplicated or already inserted'
    } else {
      errorArray[i] = ''
    }
    i++
  }

  // Excluding duplicate in submitted URLs list
  i = 0
  while (i < urlsList.length) {
    for (let j = 0; j < urlsList.length; j++) {
      if (i !== j && urlsList[i].trim() === urlsList[j].trim()) {
        errorArray[j] = 'URL was duplicated or already inserted'
        notInsertedArray.push(urlsList[j])
      } else if (!values.includes(urlsList[j].trim())) {
        values.push(urlsList[j].trim())
      }
    }
    i++
  }

  return new Promise((resolve, reject) => {
    if (notInsertedArray.length < 1 && values.length >= 2) {
      urlsProjectRepository.insertAll(values).then(() => { resolve() }).catch((erreur) => { reject(erreur) })
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

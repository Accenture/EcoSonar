const urlsProjectRepository = require('../dataBase/UrlsProjectRepository')

class UrlConfigurationService {
}
UrlConfigurationService.prototype.getAll = function (projectName) {
  return new Promise((resolve, reject) => {
    urlsProjectRepository.findAll(projectName, false).then((resultats) => {
      if (resultats.length === 0) {
        reject(new Error('No url found for project ' + projectName))
      }
      const resultatsFormatted = resultats.map((res) => res.urlName)
      resolve(resultatsFormatted)
    })
  })
}

UrlConfigurationService.prototype.insert = async function (projectName, urlsList) {
  const arrayBDD = await urlsProjectRepository.findAll(projectName, true)
  const arrayFormated = arrayBDD.map((res) => res.urlName)

  const values = []
  values.push(projectName)
  let i = 0
  const noInserted = []
  const tabErreur = []
  let url

  // deleting duplicate already in database
  while (i < urlsList.length) {
    if (arrayFormated.includes(urlsList[i]) === true) {
      if (noInserted.includes(urlsList[i]) === false) {
        noInserted.push(urlsList[i])
      }

      tabErreur[i] = 'URL was duplicated or already inserted'
      urlsList[i] = null
    } else {
      tabErreur[i] = ''
    }

    i++
  }

  // deleting duplicate already in urlsName
  i = 0
  let double
  while (i < urlsList.length) {
    url = urlsList[i]
    urlsList[i] = null

    if (url !== null && urlsList.includes(url) === false && noInserted.includes(url) === false) {
      urlsList[i] = url
      values.push(urlsList[i])
    } else if (url !== null && noInserted.includes(url) === false) {
      double = urlsList.indexOf(url)
      urlsList[double] = null
      tabErreur[double] = 'URL was duplicated or already inserted'
      tabErreur[i] = 'URL was duplicated or already inserted'
      noInserted.push(url)
    }
    i++
  }

  return new Promise((resolve, reject) => {
    if (noInserted.length < 1 && values.length >= 2) {
      urlsProjectRepository.insertAll(values).then(() => { resolve() }).catch((erreur) => { reject(erreur) })
    } else {
      reject(tabErreur)
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

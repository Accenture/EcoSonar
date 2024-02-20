import { axiosInstance } from '../config/axiosConfiguration'
import errors from '../utils/errors.json'
import formatError from '../format/formatError'

export function insertUrlsConfiguration (projectName, urlList) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/insert', {
      projectName,
      urlName: urlList
    }).then(() => {
      console.log('CONFIG URL SERVICE - INSERT : urls inserted')
      resolve()
    })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.error('CONFIG URL SERVICE - INSERT : error occured when inserting urls : validation or duplication errors')
          reject(error.response.data.error)
        } else {
          console.error(`CONFIG URL SERVICE  - INSERT : An error occured while inserting URLs for project ${projectName}, please try again.`)
          reject(new Error(formatError(errors.insertionError, projectName)))
        }
      })
  })
}

export function getUrlsConfiguration (projectName) {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/api/all?projectName=' + projectName)
      .then((response) => {
        console.log('CONFIG URL SERVICE - GET : ' + response.data.length + ' urls retrieved')
        resolve(response.data)
      })
      .catch(() => {
        console.error('CONFIG URL SERVICE  - GET : An error occured while retrieving URLs for project ' + projectName)
        reject(new Error(formatError(errors.errorRetrievingURL, projectName)))
      })
  })
}

export function deleteUrlFromProject (projectName, urlName) {
  return new Promise((resolve, reject) => {
    axiosInstance.delete('/api/delete', {
      data: {
        projectName,
        urlName
      }
    })
      .then(() => {
        console.log('CONFIG URL SERVICE - DELETE : ' + urlName + 'deleted successfully')
        resolve()
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn(`CONFIG URL SERVICE - DELETE : ${urlName} in project ${projectName} not found`)
          reject(new Error(formatError(errors.urlNotFound, projectName, urlName)))
        } else {
          console.error('CONFIG URL SERVICE  - DELETE : unknown error occured')
          reject(new Error(formatError(errors.deletingError, projectName)))
        }
      })
  })
}

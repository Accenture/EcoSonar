import { axiosInstance } from '../config/axiosConfiguration'
import formatError from '../format/formatError'
import errors from '../utils/errors.json'

export function getBestPractices (projectName) {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/api/bestPractices/project?projectName=' + projectName)
      .then((response) => {
        console.log('BEST PRACTICES SERVICE - GET : best practices retrieved')
        resolve(response.data)
      })
      .catch((error) => {
        console.error('BEST PRACTICES SERVICE - GET : unknown error occured : ', error.message)
        reject(new Error(formatError(errors.errorRetrievingBestPractices, projectName)))
      })
  })
}

export function getBestPracticesForUrl (projectName, urlName) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/bestPractices/url', {
      projectName,
      urlName
    })
      .then((response) => {
        console.log('BEST PRACTICES SERVICE - GET : best practices for ' + urlName + ' retrieved')
        resolve(response.data)
      })
      .catch((error) => {
        console.error('BEST PRACTICES SERVICE - GET : unknown error occured :  ', error.message)
        reject(new Error(formatError(errors.errorRetrievingBestPractices, projectName)))
      })
  })
}

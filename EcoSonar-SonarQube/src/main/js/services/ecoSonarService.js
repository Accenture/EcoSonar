import { axiosInstance } from '../config/axiosConfiguration'
import formatError from '../format/formatError'
import errors from '../utils/errors.json'

export function getAnalysisUrlConfiguration (projectName, urlName) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/greenit/url', {
      projectName,
      urlName
    }).then((response) => {
      console.log('ECOSONAR SERVICE - POST : analysis retrieved')
      resolve(response.data)
    })
      .catch(() => {
        console.error('ECOSONAR SERVICE  - POST : unknown error occured')
        reject(new Error(formatError(errors.errorRetrievingAnalysisforURL, projectName, urlName)))
      })
  })
}

export function getAnalysisForProjectConfiguration (projectName) {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/api/greenit/project?projectName=' + projectName)
      .then((response) => {
        console.log('GREENIT SERVICE - GET : analysis retrieved')
        resolve(response.data)
      })
      .catch(() => {
        console.error('ECOSONAR SERVICE  - GET : unknown error occured')
        reject(new Error(formatError(errors.errorRetrievingAnalysis, projectName)))
      })
  })
}

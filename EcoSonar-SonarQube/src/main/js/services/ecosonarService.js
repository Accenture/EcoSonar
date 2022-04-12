import { axiosInstance } from '../config/axiosConfiguration'

export function getAnalysisUrlConfiguration (projectName, urlName) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/greenit/url', {
      projectName: projectName,
      urlName: urlName
    }).then((response) => {
      console.log('GREENIT SERVICE - POST : analysis retrieved')
      resolve(response.data)
    })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn('GREENIT SERVICE - POST : {} has no analysis registered', urlName)
          reject(new Error('No analysis found for url ' + urlName + ' in ' + projectName))
        } else {
          console.error('GREENIT SERVICE  - POST : unknown error occured')
          reject(new Error('An error occured while retrieving analysis for url ' + urlName + ' in ' + projectName + ', please try again.'))
        }
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
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn(`GREENIT SERVICE - GET : ${projectName} has no analysis registered`)
          resolve({})
        } else {
          console.error('GREENIT SERVICE  - GET : unknown error occured')
          reject(new Error(`An error occured while retrieving analysis for project ${projectName}, please try again.`))
        }
      })
  })
}

import { axiosInstance } from '../config/axiosConfiguration'

export function insertUrlsConfiguration (projectName, urlList) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/insert', {
      projectName: projectName,
      urlName: urlList
    }).then(() => {
      console.log('CONFIG URL SERVICE - INSERT : urls inserted')
      resolve()
    })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn('CONFIG URL SERVICE - INSERT : error occured when inserting urls : validation or duplication errors')
          reject(error.response.data.error)
        } else {
          console.error('CONFIG URL SERVICE  - INSERT : unknown error occured')
          reject(new Error('An error occured while retrieving URLs for project ' + projectName + ', please try again.'))
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
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn('CONFIG URL SERVICE - GET : {} has no url registered', projectName)
          resolve([])
        } else {
          console.error('CONFIG URL SERVICE  - GET : unknown error occured')
          reject(new Error('An error occured while retrieving URLs for project ' + projectName + ', please try again.'))
        }
      })
  })
}

export function deleteUrlFromProject (projectName, urlName) {
  return new Promise((resolve, reject) => {
    axiosInstance.delete('/api/delete', {
      data: {
        projectName: projectName,
        urlName: urlName
      }
    })
      .then(() => {
        console.log('CONFIG URL SERVICE - DELETE : ' + urlName + 'deleted successfully')
        resolve()
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn('CONFIG URL SERVICE - DELETE : {} could not be deleted', urlName)
          reject(new Error(error.response.data.error))
        } else {
          console.error('CONFIG URL SERVICE  - DELETE : unknown error occured')
          reject(new Error('An error occured while deleting URL for project ' + projectName + ', please try again.'))
        }
      })
  })
}

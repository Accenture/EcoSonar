import { axiosInstance } from '../config/axiosConfiguration'

export function getBestPractices (projectName) {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/api/bestPractices/project?projectName=' + projectName)
      .then((response) => {
        console.log('BEST PRACTICES SERVICE - GET : best practices retrieved')
        resolve(response.data)
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const json = { status: 'ANALYSIS_NOT_FOUND', message: 'No analysis has been launched for project ' + projectName }
          reject(json)
        } else {
          console.error('BEST PRACTICES SERVICE - GET : unknown error occured : ', error.message)
          const json = { status: 'ERROR_SYSTEM', message: 'An error occured while retrieving Best practices for project ' + projectName + ', please try again.' }
          reject(json)
        }
      })
  })
}

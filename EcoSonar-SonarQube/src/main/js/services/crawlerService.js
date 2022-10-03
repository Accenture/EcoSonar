import { axiosInstance } from '../config/axiosConfiguration'
import formatError from '../format/formatError'
import errors from '../utils/errors.json'

export function crawl (projectName, mainUrl) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/crawl', { projectName: projectName, mainUrl: mainUrl }, { timeout: 600000 })
      .then((response) => {
        console.log('CRAWLER SERVICE - URL retrieved')
        resolve(response.data)
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          reject(new Error(formatError(errors.errorCrawling, mainUrl)))
        } else {
          console.error(error)
          console.error('CRAWLER SERVICE - unknown error occured : ', error.message)
          reject(new Error(formatError(errors.errorCrawling, mainUrl)))
        }
      })
  })
}

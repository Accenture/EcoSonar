import { axiosInstance } from '../config/axiosConfiguration'
import formatError from '../format/formatError'
import errors from '../utils/errors.json'

export function crawl (projectName, mainUrl, saveUrls) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/crawl', { projectName, mainUrl, saveUrls }, { timeout: 600000 })
      .then(() => {
        resolve()
        console.log('CRAWLER SERVICE - crawling started')
      })
      .catch((error) => {
        console.error(error)
        console.error('CRAWLER SERVICE - unknown error occured : ', error.message)
        reject(new Error(formatError(errors.errorCrawling, mainUrl)))
      })
  })
}

export function getCrawl (projectNameReq) {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/api/crawl', { params: { projectName: projectNameReq } }, { timeout: 600000 })
      .then((response) => {
        console.log(`CRAWLER SERVICE - ${response.data.length} URLs retrieved for project ${projectNameReq}`)
        resolve(response.data)
      })
      .catch((error) => {
        console.error(error)
        console.error('CRAWLER SERVICE - unknown error occured : ', error.message)
        reject(new Error(formatError(errors.errorGetCrawling, projectNameReq)))
      })
  })
}

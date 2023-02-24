import { axiosInstance } from '../config/axiosConfiguration'
import formatError from '../format/formatError'
import errors from '../utils/errors.json'

export function exportAudit (projectName) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/export', {
      projectName
    }, {
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    }).then((buffer) => {
      console.log('EXPORT AUDIT SERVICE : export completed')
      resolve(buffer.data)
    })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn('EXPORT AUDIT SERVICE : {} could not export Audit', projectName)
        } else {
          console.error('EXPORT AUDIT SERVICE : unknown error occured', error.message)
        }
        reject(new Error(formatError(errors.errorExportAudit, projectName)))
      })
  })
}

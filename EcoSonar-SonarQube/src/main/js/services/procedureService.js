import { axiosInstance } from '../config/axiosConfiguration'
import formatError from '../format/formatError'
import errors from '../utils/errors.json'

export function addProcedure (projectNameReq, selectedProcedureReq) {
  return new Promise((resolve, reject) => {
    axiosInstance.post('/api/procedure', {
      projectName: projectNameReq,
      selectedProcedure: selectedProcedureReq
    }).then(() => {
      console.log('POST PROCEDURE : procedure added')
      resolve()
    })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn('POST PROCEDURE : Procedure chosen was not recognized')
          reject(new Error(errors.errorAddProcedure))
        } else {
          console.error('POST PROCEDURE : Procedure saving has encountered an error for project', projectNameReq)
          reject(new Error(formatError(errors.errorSystemAddProcedure, projectNameReq)))
        }
      })
  })
}

export function getProcedure (projectName) {
  return new Promise((resolve, reject) => {
    axiosInstance.get('/api/procedure?projectName=' + projectName)
      .then((response) => {
        console.log('GET PROCEDURE : procedure retrieved')
        resolve(response.data)
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.warn('GET PROCEDURE :', projectName, 'has no procedure registered')
          reject(new Error(''))
        } else {
          console.error('GET PROCEDURE : unknown error occured')
          reject(new Error(formatError(errors.errorSystemGetProcedure, projectName)))
        }
      })
  })
}

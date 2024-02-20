const projectsRepository = require('../dataBase/projectsRepository')
const SystemError = require('../utils/SystemError')

class ProcedureService { }

ProcedureService.prototype.saveProcedure = async function (projectName, selectedProcedure) {
  let project = null
  let systemError = false

  await projectsRepository.getProjectSettings(projectName)
    .then((result) => { project = result })
    .catch(() => { systemError = true })

  return new Promise((resolve, reject) => {
    if (!systemError && project !== null) {
      projectsRepository.updateProjectProcedure(projectName, selectedProcedure)
        .then(() => resolve())
        .catch((error) => reject(error))
    } else if (!systemError) {
      projectsRepository.createProcedure(projectName, selectedProcedure)
        .then(() => resolve())
        .catch((error) => reject(error))
    } else {
      reject(new SystemError())
    }
  })
}

ProcedureService.prototype.getProcedure = async function (projectName) {
  return new Promise((resolve, reject) => {
    projectsRepository.getProjectSettings(projectName)
      .then((existingProject) => {
        if (existingProject === null || existingProject.procedure === undefined) {
          resolve({ procedure: '' })
        }
        resolve({ procedure: existingProject.procedure })
      }).catch((err) => {
        reject(err)
      })
  })
}

const procedureService = new ProcedureService()
module.exports = procedureService

const projectsRepository = require('../dataBase/projectsRepository')
const urlsProjectRepository = require('../dataBase/urlsProjectRepository')

class ProcedureService { }

ProcedureService.prototype.saveProcedure = async function (projectName, selectedProcedure) {
  // selected procedure can be equal to 'quick wins', 'highest impact', 'smart impact', 'score impact'
  const projectExist = await projectsRepository.getProjectSettings(projectName)
  let allUrls = []
  if (projectExist === null) {
    allUrls = await urlsProjectRepository.findAll(projectName, true)
  }
  return new Promise((resolve, reject) => {
    if (projectExist !== null) {
      projectsRepository.updateProjectProcedure(projectName, selectedProcedure)
        .then(() => resolve())
        .catch((error) => reject(error))
    } else {
      if (allUrls.length > 0) {
        projectsRepository.createProcedure(projectName, selectedProcedure)
          .then(() => resolve())
          .catch((error) => reject(error))
      } else {
        const errorMessage = 'Project not found'
        console.error(errorMessage)
        reject(new Error(errorMessage))
      }
    }
  })
}

ProcedureService.prototype.getProcedure = async function (projectName) {
  return new Promise((resolve, reject) => {
    projectsRepository.getProjectSettings(projectName)
      .then((existingProject) => {
        if (existingProject === null || existingProject.procedure === undefined) {
          reject(new Error('No procedure found for project ' + projectName))
        }
        resolve({ procedure: existingProject.procedure })
      }).catch((err) => {
        reject(err)
      })
  })
}

const procedureService = new ProcedureService()
module.exports = procedureService

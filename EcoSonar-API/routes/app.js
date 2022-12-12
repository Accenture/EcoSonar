const express = require('express')
const urlConfigurationService = require('../services/urlConfigurationService')
const analyseService = require('../services/analysisService')
const retrieveBestPracticesService = require('../services/retrieveBestPracticesService')
const crawlerService = require('../services/crawler/crawlerService')
const procedureService = require('../services/procedureService')
const loginProxyConfigurationService = require('../services/loginProxyConfigurationService')
const userJourneyService = require('../services/userJourneyService')
const SystemError = require('../utils/SystemError')
const asyncMiddleware = require('../utils/AsyncMiddleware')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.disable('x-powered-by')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const sonarqubeServerUrl = process.env.ECOSONAR_ENV_SONARQUBE_SERVER_URL || ''
const whitelist = [sonarqubeServerUrl]

if (process.env.ECOSONAR_ENV_CLOUD_PROVIDER === 'local') {
  const localServer = process.env.ECOSONAR_ENV_LOCAL_DEV_SERVER_URL || ''
  whitelist.push(localServer)
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS : ' + origin))
    }
  }
}
app.use(cors(corsOptions))

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// API CRUD UrlsProject
app.get('/api/all', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('GET URLS PROJECT - retrieve all urls from project ' + projectName)
  urlConfigurationService.getAll(projectName)
    .then((resultats) => {
      console.log('GET URLS PROJECT - retrieved ' + resultats.length + ' urls from project ' + projectName)
      return res.status(200).json(resultats)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('GET URLS PROJECT - No url retrieved for project ' + projectName)
      return res.status(400).json({ error: error.message })
    })
}))

app.post('/api/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const urlsList = req.body.urlName
  console.log('INSERT URLS PROJECT - insert urls into project ' + projectName)
  urlConfigurationService.insert(projectName, urlsList)
    .then(() => {
      console.log('INSERT URLS PROJECT - insert succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('INSERT URLS PROJECT - Validation failed')
      return res.status(400).json({ error })
    })
}))

app.delete('/api/delete', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const urlName = req.body.urlName
  console.log('DELETE URLS PROJECT - delete url ' + urlName + ' from project ' + projectName)
  urlConfigurationService.delete(projectName, urlName)
    .then(() => {
      console.log('DELETE URLS PROJECT - delete succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('DELETE URLS PROJECT - Url not found, could not be deleted')
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD LOGIN Credentials
// insert login credentials for a project
app.post('/api/login/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  const loginCredentials = req.body.login
  const proxyConfiguration = req.body.proxy
  console.log('INSERT LOGIN - PROXY CREDENTIALS - insert credentials into project ' + projectName)
  loginProxyConfigurationService.insert(projectName, loginCredentials, proxyConfiguration)
    .then(() => {
      console.log('INSERT LOGIN CREDENTIALS - insert succeeded')
      return res.status(201).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('INSERT LOGIN CREDENTIALS - insertion failed')
      return res.status(400).json({ error })
    })
}))

// Find login credentials for a project
app.get('/api/login/find', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('FIND LOGIN CREDENTIALS - credentials into project ' + projectName)
  loginProxyConfigurationService.getLoginCredentials(projectName)
    .then((loginCredentials) => {
      console.log('FIND LOGIN CREDENTIALS - retrieve succeeded')
      return res.status(200).json(loginCredentials)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('FIND LOGIN CREDENTIALS - failed')
      return res.status(400).json({ error: error.message })
    })
}))

// Find proxy configuration for a project
app.get('/api/proxy/find', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('FIND PROXY CONFIGURATION - credentials into project ' + projectName)
  loginProxyConfigurationService.getProxyConfiguration(projectName)
    .then((proxyConfiguration) => {
      console.log('FIND PROXY CONFIGURATION - retrieve succeeded')
      return res.status(200).json(proxyConfiguration)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('FIND PROXY CONFIGURATION - failed')
      return res.status(400).json({ error: error.message })
    })
}))

// Delete login credentials for a project
app.delete('/api/login', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('DELETE LOGIN CREDENTIALS - delete credentials into project ' + projectName)
  loginProxyConfigurationService.deleteLoginCredentials(projectName)
    .then(() => {
      console.log('DELETE LOGIN CREDENTIALS - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('DELETE LOGIN CREDENTIALS - failed')
      return res.status(400).json({ error: error.message })
    })
}))

// Delete proxy configuration for a project
app.delete('/api/proxy', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('DELETE PROXY CONFIGURATION  - delete credentials into project ' + projectName)
  loginProxyConfigurationService.deleteProxyConfiguration(projectName)
    .then(() => {
      console.log('DELETE PROXY CONFIGURATION  - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('DELETE PROXY CONFIGURATION  - failed')
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD User Flow
// insert new user flow for a url
app.post('/api/user-flow/insert', asyncMiddleware(async (req, res, _next) => {
  const url = req.body.url
  const userFlow = req.body.userFlow
  console.log('INSERT USER FLOW - insert credentials into url ' + url)
  userJourneyService.insertUserFlow(url, userFlow)
    .then(() => {
      console.log('INSERT USER FLOW - insert succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('INSERT USER FLOW - insertion failed')
      return res.status(400).json({ error: error.message })
    })
}))

// Find user flow for a project
app.post('/api/user-flow/find', asyncMiddleware(async (req, res, _next) => {
  const url = req.body.url
  console.log('FIND USER FLOW - credentials into url ' + url)
  userJourneyService.getUserFlow(url)
    .then((userFlow) => {
      console.log('FIND USER FLOW - retrieve succeeded')
      return res.status(200).json(userFlow)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('FIND USER FLOW - failed')
      return res.status(400).json({ error: error.message })
    })
}))

// Delete user flow for a project
app.delete('/api/user-flow', asyncMiddleware(async (req, res, _next) => {
  const url = req.body.url
  console.log('DELETE USER FLOW  - delete user flow into url ' + url)
  userJourneyService.deleteUserFlow(url)
    .then(() => {
      console.log('DELETE USER FLOW - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('USER FLOW  - failed')
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD GreenIT X Lighthouse
// insert an analysis
app.post('/api/greenit/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  console.log('INSERT ANALYSIS - Launch analysis for project ' + projectName)
  analyseService.insert(projectName)
  res.status(202).send()
}))

// get analysis for an url
app.post('/api/greenit/url', asyncMiddleware(async (req, res, _next) => {
  const projectNameReq = req.body.projectName
  const urlNameReq = req.body.urlName
  console.log('GET ANALYSIS URL - retrieve analysis for url ' + urlNameReq + ' in project ' + projectNameReq)
  analyseService.getUrlAnalysis(projectNameReq, urlNameReq)
    .then((resultats) => {
      console.log('GET ANALYSIS URL - Analysis for url retrieved')
      return res.status(200).json(resultats)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('GET ANALYSIS URL - Analysis for url could not be retrieved')
      return res.status(400).json({ error: error.message })
    })
}))

// get analysis for all urls of a project at one date
app.get('/api/greenit/project', asyncMiddleware(async (req, res, _next) => {
  const projectNameReq = req.query.projectName
  console.log('GET ANALYSIS PROJECT - retrieve analysis for project ' + projectNameReq)
  analyseService.getProjectAnalysis(projectNameReq)
    .then((resultats) => {
      console.log('GET ANALYSIS PROJECT - Analysis for project retrieved')
      return res.status(200).json(resultats)
    }).catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('GET ANALYSIS PROJECT - Analysis for project could not be retrieved')
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD BestPractices
// retrieve all best practices for a project
app.get('/api/bestPractices/project', asyncMiddleware(async (req, res, _next) => {
  const projectNameReq = req.query.projectName
  console.log('GET BEST PRACTICES PROJECT - retrieve best practices analysis for project ' + projectNameReq)
  retrieveBestPracticesService.getProjectAnalysis(projectNameReq)
    .then((resultats) => {
      console.log('GET BEST PRACTICES PROJECT - Best practices for project retrieved')
      return res.status(200).json(resultats)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('GET BEST PRACTICES PROJECT - Best practices analysis for project could not be retrieved')
      console.log(error.message)
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD BestPractices
// retrieve  best practices for an URL
// POST method is used because passing and URL into the req.query isn't possible, query is then misunderstood.
app.post('/api/bestPractices/url', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const urlName = req.body.urlName
  console.log(`GET BEST PRACTICES URL - retrieve best practices analysis for url ${urlName} into project ${projectName}`)
  retrieveBestPracticesService.getUrlBestPractices(projectName, urlName)
    .then((resultats) => {
      console.log('GET BEST PRACTICES URL - Best practices for url retrieved')
      return res.status(200).json(resultats)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      console.log('GET BEST PRACTICES URL - Best practices analysis for project could not be retrieved')
      return res.status(400).json({ error: error.message })
    })
}))

// Crawler service
// Crawl across the given website to find URLs
// POST method is used because passing and URL into the req.query isn't possible, query is then misunderstood.
app.post('/api/crawl', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const mainUrl = req.body.mainUrl
  console.log(`CRAWLER - Running crawler from ${mainUrl}`)
  crawlerService.crawl(projectName, mainUrl)
    .then((result) => {
      console.log(`CRAWLER - ${result.length} URL retrieved`)
      return res.status(200).json(result)
    })
    .catch(() => {
      console.log('CRAWLER - Crawler has encountered and error')
      return res.status(500).send()
    })
}))

// API PROCEDURE
// POST method is used to update the procedure of a project
app.post('/api/procedure', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  const selectedProcedure = req.query.selectedProcedure
  procedureService.saveProcedure(projectName, selectedProcedure)
    .then(() => {
      console.log(`POST PROCEDURE - Procedure ${selectedProcedure} for a project ${projectName} saved`)
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        console.log('POST PROCEDURE - Procedure saving has encountered an error')
        return res.status(500).send()
      }
      console.log(`POST PROCEDURE PROJECT - Procedure ${selectedProcedure} for a project ${projectName} could not be retrieved`)
      return res.status(400).json({ error: error.message })
    })
}))

// get method is used to get the procedure of the project
app.get('/api/procedure', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  procedureService.getProcedure(projectName)
    .then((procedure) => {
      console.log(`GET PROCEDURE - Project ${projectName} with ${procedure.procedure} retrieved`)
      return res.status(200).json(procedure)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        console.log(`GET PROCEDURE - Procedure for project ${projectName} retrieving has encountered an error`)
        return res.status(500).send()
      }
      console.log(`GET PROCEDURE - Procedure for project ${projectName} could not be retrieved`)
      return res.status(400).json({ error: error.message })
    })
}))

module.exports = app

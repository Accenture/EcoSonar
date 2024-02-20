const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const urlConfigurationService = require('../services/urlConfigurationService')
const analysisService = require('../services/analysisService')
const retrieveAnalysisService = require('../services/retrieveAnalysisService')
const retrieveBestPracticesService = require('../services/retrieveBestPracticesService')
const crawlerService = require('../services/crawler/crawlerService')
const procedureService = require('../services/procedureService')
const loginProxyConfigurationService = require('../services/loginProxyConfigurationService')
const userJourneyService = require('../services/userJourneyService')
const exportAuditService = require('../services/exportAuditService')
const SystemError = require('../utils/SystemError')
const asyncMiddleware = require('../utils/AsyncMiddleware')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../swagger')
const projectService = require('../services/projectService')
const packageJson = require('../package.json')
const bestPracticesServices = require('../services/bestPracticesService')

dotenv.config()

const app = express()
app.disable('x-powered-by')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.SWAGGER_PORT || 3002
app.listen(PORT, () => console.log(`Swagger in progress on port ${PORT}`))

const sonarqubeServerUrl = process.env.ECOSONAR_ENV_SONARQUBE_SERVER_URL || ''
const whitelist = [sonarqubeServerUrl]

if (process.env.ECOSONAR_ENV_CLOUD_PROVIDER === 'local') {
  const localServers = process.env.ECOSONAR_ENV_LOCAL_DEV_SERVER_URL?.split(';') || []
  for (const localServer of localServers) {
    whitelist.push(localServer)
  }
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
/**
 * @swagger
 * /api/all:
 *   get:
 *     tags:
 *       - "URL Configuration"
 *     summary: "Get All URLs from Project"
 *     description: retrieve list of URLs saved and audited by EcoSonar for the project.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.get('/api/all', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('GET URLS PROJECT - retrieve all urls from project ' + projectName)
  urlConfigurationService.getAll(projectName)
    .then((results) => {
      console.log('GET URLS PROJECT - retrieved ' + results.length + ' urls from project ' + projectName)
      return res.status(200).json(results)
    })
    .catch((error) => {
      console.error(error)
      console.error('GET URLS PROJECT - retrieve all urls encountered an error for project ' + projectName)
      return res.status(500).send()
    })
}))

/**
 * @swagger
 * /api/insert:
 *   post:
 *     tags:
 *       - "URL Configuration"
 *     summary: "Insert URL into Project"
 *     description: add list of URLs to be audited once project is audited by EcoSonar.
 *     parameters:
 *       - name: urls
 *         in: body
 *         description: urls to be inserted in the project
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            urls:
 *              type:
 *                projectName:
 *                  type: string
 *                urlName:
 *                  type: array
 *                  items: string
 *          example:
 *            projectName:  ""
 *            urlName: ["url"]
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: System error.
 */
app.post('/api/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const urlsList = req.body.urlName
  console.log(`INSERT URLS PROJECT - insert urls into project ${projectName}`)
  urlConfigurationService.insert(projectName, urlsList)
    .then(() => {
      console.log('INSERT URLS PROJECT - insert succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        console.error(error)
        console.error(`INSERT URLS PROJECT - insert urls into project ${projectName} encountered an error`)
        return res.status(500).send()
      }
      console.error('INSERT URLS PROJECT - Validation failed')
      return res.status(400).json({ error })
    })
}))

/**
 * @swagger
 * /api/delete:
 *   delete:
 *     tags:
 *       - "URL Configuration"
 *     summary: "Delete URL from Project"
 *     description: Delete url to be audited in a project configuration.
 *     parameters:
 *       - name: urlDeleted
 *         in: body
 *         description: The url to be deleted in the project
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *            urlName:
 *              type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Url not found, could not be deleted.
 *       500:
 *         description: System error.
 */
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
      console.error(error)
      if (error instanceof SystemError) {
        console.error('DELETE URLS PROJECT - delete url ' + urlName + ' from project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD LOGIN Credentials
/**
 * @swagger
 * /api/login/insert:
 *   post:
 *     tags:
 *       - "Login Configuration"
 *     summary: "Save Login For Project"
 *     description: Insert how to login into the project in database
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *       - name: login
 *         in: body
 *         description: The login credentials settings
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            login:
 *              type: object
 *              properties:
 *                authentication_url:
 *                  type: string
 *                steps:
 *                  type: array
 *                  items:
 *                    type: object
 *     responses:
 *       201:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.post('/api/login/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  const loginCredentials = req.body.login
  console.log('INSERT LOGIN CREDENTIALS - insert credentials into project ' + projectName)
  loginProxyConfigurationService.insertLoginCredentials(projectName, loginCredentials)
    .then(() => {
      console.log('INSERT LOGIN CREDENTIALS - insert succeeded')
      return res.status(201).send()
    })
    .catch((error) => {
      console.error(error)
      console.error('INSERT LOGIN CREDENTIALS - insert credentials into project ' + projectName + ' encountered an error')
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      return res.status(400).json({ error })
    })
}))

// API CRUD PROXY Configuration
/**
 * @swagger
 * /api/proxy/insert:
 *   post:
 *     tags:
 *       - "Proxy Configuration"
 *     summary: "Save Proxy For Project"
 *     description: Insert proxy configuration for a project.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *       - name: proxy
 *         in: body
 *         description: The proxy settings
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            proxy:
 *              type: object
 *              properties:
 *                ipAddress:
 *                  type: string
 *                port:
 *                  type: string
 *     responses:
 *       201:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.post('/api/proxy/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  const proxyConfiguration = req.body.proxy
  console.log('INSERT PROXY - insert proxy credentials into project ' + projectName)
  loginProxyConfigurationService.insertProxyConfiguration(projectName, proxyConfiguration)
    .then(() => {
      console.log('INSERT PROXY CREDENTIALS - insert succeeded')
      return res.status(201).send()
    })
    .catch((error) => {
      console.error(error)
      console.error('INSERT PROXY - proxy credentials into project ' + projectName + ' encountered an error')
      if (error instanceof SystemError) {
        return res.status(500).send()
      }
      return res.status(400).json({ error })
    })
}))

/**
 * @swagger
 * /api/login/find:
 *   get:
 *     tags:
 *       - "Login Configuration"
 *     summary: "Get Login For Project"
 *     description: Find login credentials for a project.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
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
        console.error(error)
        console.error('FIND LOGIN CREDENTIALS - credentials into project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      console.warn('FIND LOGIN CREDENTIALS - credentials into project ' + projectName + ' are not saved')
      return res.status(200).json({})
    })
}))

/**
 * @swagger
 * /api/proxy/find:
 *   get:
 *     tags:
 *       - "Proxy Configuration"
 *     summary: "Get Proxy For Project"
 *     description: Find proxy configuration for a project.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
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
        console.error(error)
        console.error('FIND PROXY CREDENTIALS - credentials into project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      console.warn('FIND PROXY CREDENTIALS - credentials into project ' + projectName + ' are not saved')
      return res.status(200).json({})
    })
}))

/**
 * @swagger
 * /api/login:
 *   delete:
 *     tags:
 *       - "Login Configuration"
 *     summary: "Delete Login For Project"
 *     description: Delete login credentials saved in database for a project.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Project not found.
 *       500:
 *         description: System error.
 */
app.delete('/api/login', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('DELETE LOGIN CREDENTIALS - delete credentials into project ' + projectName)
  loginProxyConfigurationService.deleteLoginCredentials(projectName)
    .then(() => {
      console.log('DELETE LOGIN CREDENTIALS - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.error('DELETE LOGIN CREDENTIALS - delete credentials into project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      return res.status(400).json({ error: error.message })
    })
}))

/**
 * @swagger
 * /api/proxy:
 *   delete:
 *     tags:
 *       - "Proxy Configuration"
 *     summary: "Delete Proxy For Project"
 *     description: Delete proxy configuration saved in database for a project.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Project not found.
 *       500:
 *         description: System error.
 */
app.delete('/api/proxy', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('DELETE PROXY CONFIGURATION  - delete credentials into project ' + projectName)
  loginProxyConfigurationService.deleteProxyConfiguration(projectName)
    .then(() => {
      console.log('DELETE PROXY CONFIGURATION  - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.error('DELETE PROXY CONFIGURATION - delete credentials into project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD User Flow
/**
 * @swagger
 * /api/user-flow/insert:
 *   post:
 *     tags:
 *       - "User Flow Configuration"
 *     summary: "Save User Flow For URL"
 *     description: Insert new user flow for a url in a project.
 *     parameters:
 *       - name: userFlow
 *         in: body
 *         description: user flow to be added
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *            url:
 *              type: string
 *            userFlow:
 *              type: object
 *              properties:
 *                steps:
 *                  type: array
 *                  items:
 *                    type: object
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Insertion failed.
 *       500:
 *         description: System error.
 */
app.post('/api/user-flow/insert', asyncMiddleware(async (req, res, _next) => {
  const url = req.body.url
  const projectName = req.body.projectName
  const userFlow = req.body.userFlow
  console.log('INSERT USER FLOW - insert credentials for url ' + url + ' in project ' + projectName)
  userJourneyService.insertUserFlow(projectName, url, userFlow)
    .then(() => {
      console.log('INSERT USER FLOW - insert succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.error('INSERT USER FLOW - insert credentials for url ' + url + ' in project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      console.error('INSERT USER FLOW - insertion failed')
      return res.status(400).json({ error: error.message })
    })
}))

/**
 * @swagger
 * /api/user-flow/find:
 *   post:
 *     tags:
 *       - "User Flow Configuration"
 *     summary: "Get User Flow For URL"
 *     description: Find user flow for a URL.
 *     parameters:
 *       - name: userFlow
 *         in: body
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *            url:
 *              type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.post('/api/user-flow/find', asyncMiddleware(async (req, res, _next) => {
  const url = req.body.url
  const projectName = req.body.projectName
  console.log('FIND USER FLOW - get flow for url ' + url + ' in project ' + projectName)
  userJourneyService.getUserFlow(projectName, url)
    .then((userFlow) => {
      console.log('FIND USER FLOW - retrieve succeeded')
      return res.status(200).json(userFlow)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        console.error(error)
        console.log('FIND USER FLOW - get flow for url ' + url + ' in project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      console.warn('FIND USER FLOW - flow for url ' + url + ' is not saved')
      return res.status(200).json({})
    })
}))

/**
 * @swagger
 * /api/user-flow:
 *   delete:
 *     tags:
 *       - "User Flow Configuration"
 *     summary: "Delete User Flow For URL"
 *     description: Delete user flow for a URL
 *     parameters:
 *       - name: userFlow
 *         in: body
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *            url:
 *              type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Delete user flow failed.
 *       500:
 *         description: System error.
 */
app.delete('/api/user-flow', asyncMiddleware(async (req, res, _next) => {
  const url = req.body.url
  const projectName = req.body.projectName
  console.log('DELETE USER FLOW  - delete user flow into url ' + url + ' in project ' + projectName)
  userJourneyService.deleteUserFlow(projectName, url)
    .then(() => {
      console.log('DELETE USER FLOW - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.error('DELETE USER FLOW - delete user flow into url ' + url + ' in project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD GreenIT X Lighthouse x W3C Validator
/**
 * @swagger
 * /api/greenit/insert:
 *   post:
 *     tags:
 *       - "EcoSonar Analysis"
 *     summary: "Launch an EcoSonar Analysis"
 *     description: Launch an EcoSonar analysis (GreenIT-Analysis, Google Lighthouse and W3C Validator only)
 *     parameters:
 *       - name: projectName
 *         in: body
 *         description: The name of the project
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *     responses:
 *       202:
 *         description: Analysis launched
 *
 */
app.post('/api/greenit/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  console.log('INSERT ANALYSIS - Launch analysis for project ' + projectName)
  analysisService.insert(projectName)
  res.status(202).send()
}))

/**
 * @swagger
 * /api/greenit/url:
 *   post:
 *     tags:
 *       - "EcoSonar Analysis"
 *     summary: "Get Analysis Per URL"
 *     description: Get last EcoSonar analysis for the url
 *     parameters:
 *       - name: projectName
 *         in: body
 *         description: The name of the project
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *            urlName:
 *              type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.post('/api/greenit/url', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const urlName = req.body.urlName
  console.log('GET ANALYSIS URL - retrieve analysis for url ' + urlName + ' in project ' + projectName)
  retrieveAnalysisService.getUrlAnalysis(projectName, urlName)
    .then((results) => {
      console.log('GET ANALYSIS URL - Analysis for url retrieved')
      return res.status(200).json(results)
    })
    .catch((error) => {
      console.log(error)
      console.log('GET ANALYSIS URL - retrieve analysis for url ' + urlName + ' in project ' + projectName + ' encountered an error')
      return res.status(500).send()
    })
}))

/**
 * @swagger
 * /api/greenit/project:
 *    get:
 *     tags:
 *       - "EcoSonar Analysis"
 *     summary: "Get Analysis Per Project"
 *     description: Get last EcoSonar analysis for the project.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.get('/api/greenit/project', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('GET ANALYSIS PROJECT - retrieve analysis for project ' + projectName)
  retrieveAnalysisService.getProjectAnalysis(projectName)
    .then((results) => {
      console.log('GET ANALYSIS PROJECT - Analysis for project retrieved')
      return res.status(200).json(results)
    }).catch((error) => {
      console.error(error)
      console.error('GET ANALYSIS PROJECT - retrieve analysis for project ' + projectName + ' encountered an erro')
      return res.status(500).send()
    })
}))

/**
 * @swagger
 * /api/ecosonar/scores:
 *   get:
 *     tags:
 *       - "EcoSonar Analysis"
 *     summary: "Get Project Scores for latest analysis"
 *     description: Retrieve EcoSonar scores (EcoIndex, Google Lighthouse and W3C Validator) to be returned to the CICD pipelines.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.get('/api/ecosonar/scores', asyncMiddleware(async (req, res, _next) => {
  const projectNameReq = req.query.projectName
  console.log('GET ECOSONAR PROJECT SCORES - retrieve scores for project ' + projectNameReq)
  retrieveAnalysisService.getProjectScores(projectNameReq)
    .then((result) => {
      console.log('GET ECOSONAR PROJECT SCORES - Scores for project retrieved')
      return res.status(200).json(result)
    }).catch((error) => {
      console.error(error)
      console.error('GET ECOSONAR PROJECT SCORES - retrieve scores for project ' + projectNameReq + ' encountered an error')
      return res.status(500).send()
    })
}))

/**
 * @swagger
 * /api/ecosonar/info:
 *   get:
 *     tags:
 *       - "EcoSonar Analysis"
 *     summary: "Get Average of all scores for projects registered in EcoSonar at a defined date"
 *     description: Retrieve all EcoSonar projects average for all scores (EcoIndex, Google Lighthouse and W3C Validator). You can retrieve the scores at a date defined or for last analysis made if no date defined.
 *     parameters:
 *       - name: date
 *         in: query
 *         description: endpoint will return the last analysis before that date, today if none, format YYYY-MM-DD
 *         required: false
 *         type: string
 *         format: date
 *         example: "2020-12-31"
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Bad date format
 *       500:
 *         description: System error.
 */
app.get('/api/ecosonar/info', asyncMiddleware(async (req, res, _next) => {
  const date = req.query.date ?? null
  console.log('GET AVERAGE PROJECT SCORE - retrieve all informations for all projects for the date defined')
  projectService.getAllInformationsAverage(date)
    .then((result) => {
      console.log('GET AVERAGE PROJECT SCORES - Retrieved average of scores from all projects for the date defined')
      return res.status(200).json(result)
    }).catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.error('GET AVERAGE PROJECT SCORE - retrieve all informations for all projects for the date defined encountered an error')
        return res.status(500).send()
      }
      console.error('GET AVERAGE PROJECT SCORES - Average of scores from all projects for the date defined could not be retrieved')
      return res.status(400).json({ error: error.message })
    })
}))

/**
 * @swagger
 * /api/project/all:
 *   post:
 *     tags:
 *       - "EcoSonar Analysis"
 *     summary: "Get all projects scores from date defined"
 *     description: Retrieve all EcoSonar projects and return the scores for each of them at the date defined, if date not filled it would be the latest analysis.
 *     parameters:
 *       - name: date
 *         in: query
 *         description: endpoint will return the last analysis before that date, today if none, format YYYY-MM-DD
 *         required: false
 *         type: string
 *         format: date
 *         example: "2020-12-31"
 *       - name: filterName
 *         in: query
 *         description: retrieve projects whose name contains the string 'filterName', case insensitive
 *         required: false
 *         type: string
 *         example: "my-project"
 *       - name: filterAndSort
 *         in: body
 *         description: filter and sorting configuration to retrieve only specific projects registered in EcoSonar. For filtering (filterScore), it will retrieve only projects whose score is either above or below the threshold defined in the field score. cat can take the following values ecoIndex, perfScore, accessScore, w3cScore. Score is a value from 0 to 100 and select can take the values upper or lower.  For sorting (sortBy), it will sort the list of projects according to the category and order chosen.type can take the following values ecoIndex, perfScore, accessScore, w3cScore and name. order can take the value asc or desc.
 *         required: false
 *         schema:
 *          type: object
 *          properties:
 *            filterScore:
 *              type: object
 *              properties:
 *                cat:
 *                  type: string
 *                  example: ecoIndex
 *                  enum:
 *                    - ecoIndex
 *                    - perfScore
 *                    - accessScore
 *                    - w3cScore
 *                score:
 *                  type: integer
 *                select:
 *                  type: string
 *                  example: upper
 *                  enum:
 *                    - upper
 *                    - lower
 *            sortBy:
 *              type: object
 *              properties:
 *                type:
 *                  type: string
 *                  example: ecoIndex
 *                  enum:
 *                    - ecoIndex
 *                    - perfScore
 *                    - accessScore
 *                    - w3cScore
 *                    - name
 *                order:
 *                  type: string
 *                  enum:
 *                    - asc
 *                    - desc
 *                  example: asc
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Bad date format
 *       500:
 *         description: System error.
 */
app.post('/api/project/all', asyncMiddleware(async (req, res, _next) => {
  const date = req.query.date ?? null
  const filterName = req.query.filterName ?? null
  const sortBy = req.body.sortBy ?? null
  const filterScore = req.body.filterScore ?? null
  console.log('GET PROJECTS SCORES - Retrieve scores for each project')
  projectService.getAllProjectInformations(date, sortBy, filterName, filterScore)
    .then((result) => {
      console.log('GET PROJECTS SCORES - Average scores for each project retrieved')
      return res.status(200).json(result)
    }).catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.log('GET PROJECTS SCORES - Retrieve scores for each project encountered an error')
        return res.status(500).send()
      }
      console.log('GET PROJECT SCORES - Average scores for each each project could not be retrieved')
      return res.status(400).json({ error: error.message })
    })
}))

// API CRUD BestPractices
/**
 * @swagger
 * /api/bestPractices/project:
 *    get:
 *     tags:
 *       - "EcoSonar Analysis"
 *     summary: "Get Best Practices per Project"
 *     description: Retrieve all best practices for a project from the last analysis.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.get('/api/bestPractices/project', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log('GET BEST PRACTICES PROJECT - retrieve best practices analysis for project ' + projectName)
  retrieveBestPracticesService.getProjectAnalysis(projectName)
    .then((results) => {
      console.log('GET BEST PRACTICES PROJECT - Best practices for project retrieved')
      return res.status(200).json(results)
    })
    .catch((error) => {
      console.error(error)
      console.error('GET BEST PRACTICES PROJECT - retrieve best practices analysis for project ' + projectName + ' encountered an error')
      return res.status(500).send()
    })
}))

// API CRUD BestPractices
/**
 * @swagger
 * /api/bestPractices/url:
 *    post:
 *      tags:
 *        - "EcoSonar Analysis"
 *      summary: "Get Best Practices per URL"
 *      description: Retrieve best practices for an URL from the last analysis
 *      parameters:
 *        - name: projectName
 *          in: body
 *          description: The name of the project
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              projectName:
 *                type: string
 *              urlName:
 *                type: string
 *      responses:
 *        200:
 *          description: Success.
 *        500:
 *          description: System error.
 */
app.post('/api/bestPractices/url', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const urlName = req.body.urlName
  console.log(`GET BEST PRACTICES URL - retrieve best practices analysis for url ${urlName} into project ${projectName}`)
  retrieveBestPracticesService.getUrlBestPractices(projectName, urlName)
    .then((results) => {
      console.log('GET BEST PRACTICES URL - Best practices for url retrieved')
      return res.status(200).json(results)
    })
    .catch((error) => {
      console.error(error)
      console.log(`GET BEST PRACTICES URL - retrieve best practices analysis for url ${urlName} into project ${projectName} encountered an error`)
      return res.status(500).send()
    })
}))

// Crawler service
/**
 * @swagger
 * /api/crawl:
 *   post:
 *     tags:
 *       - "URL Configuration"
 *     summary: Launch crawling website
 *     description: Crawl the given website to find all pages related.
 *     parameters:
 *       - name: crawledUrl
 *         in: body
 *         description: crawling the website
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *            mainUrl:
 *              type: string
 *            saveUrls:
 *              type: boolean
 *     responses:
 *       202:
 *         description: Crawler started.
 */
app.post('/api/crawl', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const mainUrl = req.body.mainUrl
  const saveUrls = req.body.saveUrls
  console.log(`CRAWLER - Running crawler from ${mainUrl}`)
  crawlerService.launchCrawl(projectName, mainUrl, saveUrls)
  console.log('CRAWLER - Crawler started')
  return res.status(202).send()
}))

/**
 * @swagger
 * /api/crawl:
 *   get:
 *     tags:
 *       - "URL Configuration"
 *     summary: "Get URLs crawled"
 *     description: Get all URLs already crawled for the project
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: project name
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.get('/api/crawl', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log(`CRAWLER - Retrieve all urls crawled for ${projectName}`)
  crawlerService.retrieveCrawledUrl(projectName)
    .then((results) => {
      console.log(`CRAWLER - ${results.length} URLs retrieved for project ${projectName}`)
      return res.status(200).json(results)
    })
    .catch((error) => {
      console.error(error)
      console.error(`CRAWLER - Retrieve all urls crawled for ${projectName} encountered an error`)
      return res.status(500).send()
    })
}))

// API PROCEDURE
/**
 * @swagger
 * /api/procedure:
 *   post:
 *     tags:
 *       - "Procedure Configuration"
 *     summary: "Add Procedure for project"
 *     description: Update the procedure of a project, procedure can take the following values quickWins, highestImpact, scoreImpact. Procedure is the sorting method for best practices analysis.
 *     parameters:
 *       - name: projectName
 *         in: body
 *         description: The name of the project
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *            projectName:
 *              type: string
 *            selectedProcedure:
 *              type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Procedure could not be updated.
 *       500:
 *         description: System Error.
 */
app.post('/api/procedure', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const selectedProcedure = req.body.selectedProcedure
  console.log(`POST PROCEDURE - Save procedure ${selectedProcedure} for project ${projectName}`)
  procedureService.saveProcedure(projectName, selectedProcedure)
    .then(() => {
      console.log(`POST PROCEDURE - Procedure for project ${projectName} saved`)
      return res.status(200).send()
    })
    .catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.error(`POST PROCEDURE - Save procedure ${selectedProcedure} for project ${projectName} encountered an error`)
        return res.status(500).send()
      }
      console.error(`POST PROCEDURE PROJECT - Procedure for project ${projectName} could not be saved because procedure is incorrect`)
      return res.status(400).json({ error: error.message })
    })
}))

/**
 * @swagger
 * /api/procedure:
 *   get:
 *     tags:
 *       - "Procedure Configuration"
 *     summary: "Get Procedure for project"
 *     description: Retrieve the sorting method used for best practices analysis.
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System Error.
 */
app.get('/api/procedure', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log(`GET PROCEDURE - Get Procedure for project ${projectName}`)
  procedureService.getProcedure(projectName)
    .then((procedure) => {
      console.log(`GET PROCEDURE - Project ${projectName} retrieved`)
      return res.status(200).json(procedure)
    })
    .catch((error) => {
      console.error(error)
      console.error(`GET PROCEDURE - Get Procedure for project ${projectName} encountered an error`)
      return res.status(500).send()
    })
}))

app.post('/api/export', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  console.log(`POST EXCEL - audit for project ${projectName} to be retrieved`)
  exportAuditService.exportAudit(projectName)
    .then((auditExported) => {
      console.log(`POST EXCEL - Excel export for project ${projectName} has been completed`)
      return res.status(200).send(auditExported)
    })
    .catch((error) => {
      console.error(error)
      if (error instanceof SystemError) {
        console.log(`POST EXCEL - audit for project ${projectName} to be retrieved encountered an error`)
        return res.status(500).send()
      }
      console.log(`POST EXCEL PROJECT - Excel export for project ${projectName} could not be resolved`)
      return res.status(400).json({ error: error.message })
    })
}))

/**
 * @swagger
 * /api/version:
 *   get:
 *     tags:
 *       - "EcoSonar Infos"
 *     summary: "Get version of Ecosonar"
 *     description: Retrieve the version of Ecosonar used.
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: EcoSonar version could not be retrieved.
 */
app.get('/api/version', asyncMiddleware(async (_req, res, _next) => {
  try {
    console.log('GET VERSION - Version of Ecosonar retrieved')
    return res.status(200).json({ version: packageJson.version })
  } catch (error) {
    console.error('GET VERSION - Version of Ecosonar could not be retrieved')
    return res.status(400).json({ error: error.message })
  }
}))

/**
 * @swagger
 * /api/best-practices-rules:
 *   get:
 *     tags:
 *       - "EcoSonar Infos"
 *     summary: "Get all practices documentation"
 *     description: Retrieve documentation for all best practices in EcoSonar.
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Documentation could not be retrieved.
 */
app.get('/api/best-practices-rules', asyncMiddleware(async (req, res, _next) => {
  console.log('GET BEST PRACTICES - Best practices rules to be retrieved')

  try {
    const bestPracticesRules = bestPracticesServices.getAllBestPracticesRules()
    console.log('GET BEST PRACTICES - Best practices rules has been retrieved')
    return res.status(200).send(bestPracticesRules)
  } catch (error) {
    console.error('GET BEST PRACTICES - Best practices rules could not be retrieved')
    return res.status(400).json({ error: error.message })
  }
}))

/**
 * @swagger
 * /api/project:
 *   delete:
 *     tags:
 *       - "URL Configuration"
 *     summary: "Delete Project "
 *     description: Delete project and all related urls & analysis
 *     parameters:
 *       - name: projectName
 *         in: query
 *         description: The name of the project
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.delete('/api/project', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  console.log(`DELETE PROJECT - Delete project ${projectName}`)
  projectService.deleteProject(projectName)
    .then(() => {
      console.log(`DELETE PROJECT - Project ${projectName} deletion succeeded`)
      return res.status(200).send()
    })
    .catch((error) => {
      console.error(error)
      console.error(`DELETE PROJECT - Delete project ${projectName} encountered an error`)
      return res.status(500).send()
    })
}))

module.exports = app

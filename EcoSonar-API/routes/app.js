import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import helmet from 'helmet'
import swaggerSpec from '../swagger.js'
import RateLimit from 'express-rate-limit'
import urlConfigurationService from '../services/urlConfigurationService.js'
import analysisService from '../services/analysisService.js'
import retrieveAnalysisService from '../services/retrieveAnalysisService.js'
import retrieveBestPracticesService from '../services/retrieveBestPracticesService.js'
import crawlerService from '../services/crawler/crawlerService.js'
import procedureService from '../services/procedureService.js'
import loginProxyConfigurationService from '../services/loginProxyConfigurationService.js'
import userJourneyService from '../services/userJourneyService.js'
import exportAuditService from '../services/exportAuditService.js'
import SystemError from '../utils/SystemError.js'
import asyncMiddleware from '../utils/AsyncMiddleware.js'
import projectService from '../services/projectService.js'
import bestPracticesServices from '../services/bestPracticesService.js'
import loggerService from '../loggers/traces.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const packageJson = require('../package.json')
const basicAuth = require('express-basic-auth')
import fs from 'node:fs';
import { aesEncrypt, aesDecrypt } from '../services/encryptionService.js'

dotenv.config()

const app = express()
app.disable('x-powered-by')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())

const PORT = process.env.SWAGGER_PORT || 3002
app.listen(PORT, () => loggerService.info(`Swagger in progress on port ${PORT}`))
const passWord = process.env.ECOSONAR_USER_PASSWORD || 'password'
const userName = process.env.ECOSONAR_USER_USERNAME || 'admin'

// Add choice to desable basic auth (to use on RP or other stuff)
const basicAuthEnabled = process.env.ECOSONAR_BASIC_AUTH === 'true'

if (basicAuthEnabled) {
  app.use("/swagger", basicAuth({
    users: {userName: passWord},
    challenge: true,
  }), swaggerUi.serve, swaggerUi.setup(swaggerSpec))
} else {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}



const sonarqubeServerUrl = process.env.ECOSONAR_ENV_SONARQUBE_SERVER_URL || ''
const whitelist = [sonarqubeServerUrl]

const localServers = process.env.ECOSONAR_ENV_LOCAL_DEV_SERVER_URL?.split(';') || []
for (const localServer of localServers) {
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

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300 // max 300 requests per windowMs
})

app.use(limiter)

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
  loggerService.info('GET URLS PROJECT - retrieve all urls from project ' + projectName)
  urlConfigurationService.getAll(projectName)
    .then((results) => {
      loggerService.info('GET URLS PROJECT - retrieved ' + results.length + ' urls from project ' + projectName)
      return res.status(200).json(results)
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error('GET URLS PROJECT - retrieve all urls encountered an error for project ' + projectName)
      return res.status(500).send()
    })
}))

/**
 * @swagger
 * /api/encrypt:
 *   post:
 *     tags:
 *       - "Encryption"
 *     summary: "Encrypt text"
 *     description: retrieve list of URLs saved and audited by EcoSonar for the project.
 *     parameters:
 *       - name: projectName
 *         in: body
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.post('/api/encrypt', (req, res) => {
  const data = req.body.text
  const encryptedData = aesEncrypt(data)
  res.json({ encryptedData })
})


/**
 * @swagger
 * /api/decrypt:
 *   post:
 *     tags:
 *       - "Encryption"
 *     summary: "Decrypt text"
 *     description: retrieve list of URLs saved and audited by EcoSonar for the project.
 *     parameters:
 *       - name: projectName
 *         in: body
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.post('/api/decrypt', (req, res) => {
  const  encryptedData  = req.body.text
  const data = aesDecrypt(encryptedData)
  res.json({ data })
})

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
  loggerService.info(`INSERT URLS PROJECT - insert urls into project ${projectName}`)
  urlConfigurationService.insert(projectName, urlsList)
    .then(() => {
      loggerService.info('INSERT URLS PROJECT - insert succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        loggerService.error(error)
        loggerService.error(`INSERT URLS PROJECT - insert urls into project ${projectName} encountered an error`)
        return res.status(500).send()
      }
      loggerService.error('INSERT URLS PROJECT - Validation failed')
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
  loggerService.info('DELETE URLS PROJECT - delete url ' + urlName + ' from project ' + projectName)
  urlConfigurationService.delete(projectName, urlName)
    .then(() => {
      loggerService.info('DELETE URLS PROJECT - delete succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error('DELETE URLS PROJECT - delete url ' + urlName + ' from project ' + projectName + ' encountered an error')
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
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       201:
 *         description: Success.
 *       500:
 *         description: System error.
 */
app.post('/api/login/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  const loginCredentials = req.body.login
  loggerService.info('INSERT LOGIN CREDENTIALS - insert credentials into project ' + projectName)
  loginProxyConfigurationService.insertLoginCredentials(projectName, loginCredentials)
    .then(() => {
      loggerService.info('INSERT LOGIN CREDENTIALS - insert succeeded')
      return res.status(201).send()
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error('INSERT LOGIN CREDENTIALS - insert credentials into project ' + projectName + ' encountered an error')
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
  loggerService.info('INSERT PROXY - insert proxy credentials into project ' + projectName)
  loginProxyConfigurationService.insertProxyConfiguration(projectName, proxyConfiguration)
    .then(() => {
      loggerService.info('INSERT PROXY CREDENTIALS - insert succeeded')
      return res.status(201).send()
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error('INSERT PROXY - proxy credentials into project ' + projectName + ' encountered an error')
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
  loggerService.info('FIND LOGIN CREDENTIALS - credentials into project ' + projectName)
  loginProxyConfigurationService.getLoginCredentials(projectName)
    .then((loginCredentials) => {
      loggerService.info('FIND LOGIN CREDENTIALS - retrieve succeeded')
      return res.status(200).json(loginCredentials)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        loggerService.error(error)
        loggerService.error('FIND LOGIN CREDENTIALS - credentials into project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      loggerService.warn('FIND LOGIN CREDENTIALS - credentials into project ' + projectName + ' are not saved')
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
  loggerService.info('FIND PROXY CONFIGURATION - credentials into project ' + projectName)
  loginProxyConfigurationService.getProxyConfiguration(projectName)
    .then((proxyConfiguration) => {
      loggerService.info('FIND PROXY CONFIGURATION - retrieve succeeded')
      return res.status(200).json(proxyConfiguration)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        loggerService.error(error)
        loggerService.error('FIND PROXY CREDENTIALS - credentials into project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      loggerService.warn('FIND PROXY CREDENTIALS - credentials into project ' + projectName + ' are not saved')
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
  loggerService.info('DELETE LOGIN CREDENTIALS - delete credentials into project ' + projectName)
  loginProxyConfigurationService.deleteLoginCredentials(projectName)
    .then(() => {
      loggerService.info('DELETE LOGIN CREDENTIALS - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error('DELETE LOGIN CREDENTIALS - delete credentials into project ' + projectName + ' encountered an error')
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
  loggerService.info('DELETE PROXY CONFIGURATION  - delete credentials into project ' + projectName)
  loginProxyConfigurationService.deleteProxyConfiguration(projectName)
    .then(() => {
      loggerService.info('DELETE PROXY CONFIGURATION  - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error('DELETE PROXY CONFIGURATION - delete credentials into project ' + projectName + ' encountered an error')
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
  loggerService.info('INSERT USER FLOW - insert credentials for url ' + url + ' in project ' + projectName)
  userJourneyService.insertUserFlow(projectName, url, userFlow)
    .then(() => {
      loggerService.info('INSERT USER FLOW - insert succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error('INSERT USER FLOW - insert credentials for url ' + url + ' in project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      loggerService.error('INSERT USER FLOW - insertion failed')
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
  loggerService.info('FIND USER FLOW - get flow for url ' + url + ' in project ' + projectName)
  userJourneyService.getUserFlow(projectName, url)
    .then((userFlow) => {
      loggerService.info('FIND USER FLOW - retrieve succeeded')
      return res.status(200).json(userFlow)
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        loggerService.error(error)
        loggerService.info('FIND USER FLOW - get flow for url ' + url + ' in project ' + projectName + ' encountered an error')
        return res.status(500).send()
      }
      loggerService.warn('FIND USER FLOW - flow for url ' + url + ' is not saved')
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
  loggerService.info('DELETE USER FLOW  - delete user flow into url ' + url + ' in project ' + projectName)
  userJourneyService.deleteUserFlow(projectName, url)
    .then(() => {
      loggerService.info('DELETE USER FLOW - succeeded')
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error('DELETE USER FLOW - delete user flow into url ' + url + ' in project ' + projectName + ' encountered an error')
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
 *            username:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       202:
 *         description: Analysis launched
 *
 */
app.post('/api/greenit/insert', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const username = req.body.username
  const password = req.body.password
  loggerService.info('INSERT ANALYSIS - Launch analysis for project ' + projectName)
  analysisService.insert(projectName, username, password)
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
  loggerService.info('GET ANALYSIS URL - retrieve analysis for url ' + urlName + ' in project ' + projectName)
  retrieveAnalysisService.getUrlAnalysis(projectName, urlName)
    .then((results) => {
      loggerService.info('GET ANALYSIS URL - Analysis for url retrieved')
      return res.status(200).json(results)
    })
    .catch((error) => {
      loggerService.info(error)
      loggerService.info('GET ANALYSIS URL - retrieve analysis for url ' + urlName + ' in project ' + projectName + ' encountered an error')
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
  loggerService.info('GET ANALYSIS PROJECT - retrieve analysis for project ' + projectName)
  retrieveAnalysisService.getProjectAnalysis(projectName, res)
    .then((results) => {
      loggerService.info('GET ANALYSIS PROJECT - Analysis for project retrieved')
      return res.status(200).json(results)
    }).catch((error) => {
      loggerService.error(error)
      loggerService.error('GET ANALYSIS PROJECT - retrieve analysis for project ' + projectName + ' encountered an erro')
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
  loggerService.info('GET ECOSONAR PROJECT SCORES - retrieve scores for project ' + projectNameReq)
  retrieveAnalysisService.getProjectScores(projectNameReq)
    .then((result) => {
      loggerService.info('GET ECOSONAR PROJECT SCORES - Scores for project retrieved')
      return res.status(200).json(result)
    }).catch((error) => {
      loggerService.error(error)
      loggerService.error('GET ECOSONAR PROJECT SCORES - retrieve scores for project ' + projectNameReq + ' encountered an error')
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
  loggerService.info('GET AVERAGE PROJECT SCORE - retrieve all informations for all projects for the date defined')
  projectService.getAllInformationsAverage(date)
    .then((result) => {
      loggerService.info('GET AVERAGE PROJECT SCORES - Retrieved average of scores from all projects for the date defined')
      return res.status(200).json(result)
    }).catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error('GET AVERAGE PROJECT SCORE - retrieve all informations for all projects for the date defined encountered an error')
        return res.status(500).send()
      }
      loggerService.error('GET AVERAGE PROJECT SCORES - Average of scores from all projects for the date defined could not be retrieved')
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
  loggerService.info('GET PROJECTS SCORES - Retrieve scores for each project')
  projectService.getAllProjectInformations(date, sortBy, filterName, filterScore)
    .then((result) => {
      loggerService.info('GET PROJECTS SCORES - Average scores for each project retrieved')
      return res.status(200).json(result)
    }).catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.info('GET PROJECTS SCORES - Retrieve scores for each project encountered an error')
        return res.status(500).send()
      }
      loggerService.info('GET PROJECT SCORES - Average scores for each each project could not be retrieved')
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
  loggerService.info('GET BEST PRACTICES PROJECT - retrieve best practices analysis for project ' + projectName)
  retrieveBestPracticesService.getProjectAnalysis(projectName, res)
    .then((results) => {
      loggerService.info('GET BEST PRACTICES PROJECT - Best practices for project retrieved')
      return res.status(200).json(results)
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error('GET BEST PRACTICES PROJECT - retrieve best practices analysis for project ' + projectName + ' encountered an error')
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
  loggerService.info(`GET BEST PRACTICES URL - retrieve best practices analysis for url ${urlName} into project ${projectName}`)
  retrieveBestPracticesService.getUrlBestPractices(projectName, urlName)
    .then((results) => {
      loggerService.info('GET BEST PRACTICES URL - Best practices for url retrieved')
      return res.status(200).json(results)
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.info(`GET BEST PRACTICES URL - retrieve best practices analysis for url ${urlName} into project ${projectName} encountered an error`)
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
 *            username:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       202:
 *         description: Crawler started.
 */
app.post('/api/crawl', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const mainUrl = req.body.mainUrl
  const saveUrls = req.body.saveUrls
  const username = req.body.username
  const password = req.body.password
  loggerService.info(`CRAWLER - Running crawler from ${mainUrl}`)
  crawlerService.launchCrawl(projectName, mainUrl, saveUrls, username, password)
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
  loggerService.info(`CRAWLER - Retrieve all urls crawled for ${projectName}`)
  crawlerService.retrieveCrawledUrl(projectName)
    .then((results) => {
      loggerService.info(`CRAWLER - ${results.length} URLs retrieved for project ${projectName}`)
      return res.status(200).json(results)
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error(`CRAWLER - Retrieve all urls crawled for ${projectName} encountered an error`)
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
  loggerService.info(`POST PROCEDURE - Save procedure ${selectedProcedure} for project ${projectName}`)
  procedureService.saveProcedure(projectName, selectedProcedure)
    .then(() => {
      loggerService.info(`POST PROCEDURE - Procedure for project ${projectName} saved`)
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error(`POST PROCEDURE - Save procedure ${selectedProcedure} for project ${projectName} encountered an error`)
        return res.status(500).send()
      }
      loggerService.error(`POST PROCEDURE PROJECT - Procedure for project ${projectName} could not be saved because procedure is incorrect`)
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
  loggerService.info(`GET PROCEDURE - Get Procedure for project ${projectName}`)
  procedureService.getProcedure(projectName)
    .then((procedure) => {
      loggerService.info(`GET PROCEDURE - Project ${projectName} retrieved`)
      return res.status(200).json(procedure)
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error(`GET PROCEDURE - Get Procedure for project ${projectName} encountered an error`)
      return res.status(500).send()
    })
}))

app.post('/api/export', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  loggerService.info(`POST EXCEL - audit for project ${projectName} to be retrieved`)
  exportAuditService.exportAudit(projectName, res)
    .then((auditExported) => {
      loggerService.info(`POST EXCEL - Excel export for project ${projectName} has been completed`)
      return res.status(200).send(auditExported)
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.info(`POST EXCEL - audit for project ${projectName} to be retrieved encountered an error`)
        return res.status(500).send()
      }
      loggerService.info(`POST EXCEL PROJECT - Excel export for project ${projectName} could not be resolved`)
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
    loggerService.info('GET VERSION - Version of Ecosonar retrieved')
    return res.status(200).json({ version: packageJson.version })
  } catch (error) {
    loggerService.error('GET VERSION - Version of Ecosonar could not be retrieved')
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
  loggerService.info('GET BEST PRACTICES - Best practices rules to be retrieved')

  try {
    const bestPracticesRules = bestPracticesServices.getAllBestPracticesRules()
    loggerService.info('GET BEST PRACTICES - Best practices rules has been retrieved')
    return res.status(200).send(bestPracticesRules)
  } catch (error) {
    loggerService.error('GET BEST PRACTICES - Best practices rules could not be retrieved')
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
  loggerService.info(`DELETE PROJECT - Delete project ${projectName}`)
  projectService.deleteProject(projectName)
    .then(() => {
      loggerService.info(`DELETE PROJECT - Project ${projectName} deletion succeeded`)
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error(`DELETE PROJECT - Delete project ${projectName} encountered an error`)
      return res.status(500).send()
    })
}))

/**
 * @swagger
 * /api/logs:
 *   get:
 *     tags:
 *       - "EcoSonar logs"
 *     summary: "Get logs of Ecosonar"
 *     description: Retrieve the logs of Ecosonar server.
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Error retrieving logs.
 */
app.get('/api/logs', (req, res) => { 
  loggerService.query({ order: 'desc', limit: 100 },  
  (err, result) => { 
      if (err) { 
          res.status(500).send({  
              error: 'Error retrieving logs' 
             }); 
      } else { 
        
    fs.readFile('\app.log', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
      res.send(data);
    });
           
      } 
  }); 
});

// API CONFIGURATION
/**
 * @swagger
 * /api/configuration:
 *   post:
 *     tags:
 *       - "Project Configuration"
 *     summary: "Add configuration for project"
 *     description: Update the different modules/analysis to be used
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
 *            w3c:
 *              type: string
 *            carbon:
 *              type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Procedure could not be updated.
 *       500:
 *         description: System Error.
 */
app.post('/api/configuration', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const w3c = req.body.w3c
  const carbon = req.body.carbon
  loggerService.info(`POST configuration - Insert configuration for project ${projectName}`)
  configurationService.saveConfiguration(projectName, w3c, carbon)
    .then(() => {
      loggerService.info(`POST configuration - configuration for project ${projectName} saved`)
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error(`POST configuration - Save configuration for project ${projectName} encountered an error`)
        return res.status(500).send()
      }
      loggerService.error(`POST configuration PROJECT - configuration for project ${projectName} could not be saved because procedure is incorrect`)
      return res.status(400).json({ error: error.message })
    })
}))

/**
 * @swagger
 * /api/configuration:
 *   put:
 *     tags:
 *       - "Project Configuration"
 *     summary: "Add configuration for project"
 *     description: Update the different modules/analysis to be used
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
 *            w3c:
 *              type: string
 *            carbon:
 *              type: string
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Procedure could not be updated.
 *       500:
 *         description: System Error.
 */
app.put('/api/configuration', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.body.projectName
  const w3c = req.body.w3c
  const carbon = req.body.carbon
  loggerService.info(`PUT configuration - Modify configuration for project ${projectName}`)
  configurationService.updateConfiguration(res, projectName, w3c, carbon)
    .then(() => {
      loggerService.info(`PUT configuration - configuration for project ${projectName} saved`)
      return res.status(200).send()
    })
    .catch((error) => {
      loggerService.error(error)
      if (error instanceof SystemError) {
        loggerService.error(`PUT configuration - Modify configuration for project ${projectName} encountered an error`)
        return res.status(500).send()
      }
      loggerService.error(`PUT configuration PROJECT - Modify configuration for project ${projectName} could not be saved because procedure is incorrect`)
      return res.status(400).json({ error: error.message })
    })
}))

/**
 * @swagger
 * /api/configuration:
 *   get:
 *     tags:
 *       - "Project Configuration"
 *     summary: "Get configuration for project"
 *     description: Retrieve the configuration for a given project.
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
app.get('/api/configuration', asyncMiddleware(async (req, res, _next) => {
  const projectName = req.query.projectName
  loggerService.info(`GET CONFIGURATION - Get configuration for project ${projectName}`)
  configurationService.getConfiguration(projectName, res)
    .then((config) => {
      loggerService.info(`GET CONFIGURATION - Project ${projectName} retrieved`)
      return res.status(200).json(config)
    })
    .catch((error) => {
      loggerService.error(error)
      loggerService.error(`GET CONFIGURATION - Get configuration for project ${projectName} encountered an error`)
      return res.status(500).send()
    })
}))

export default app

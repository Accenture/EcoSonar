const express = require('express')
const urlConfigurationService = require('../services/urlConfigurationService')
const analyseService = require('../services/analysisService')
const retrieveBestPracticesService = require('../services/retrieveBestPracticesService')
const SystemError = require('../utils/SystemError')

const asyncMiddleware = require('../utils/AsyncMiddleware')
const cors = require('cors')

const app = express()
app.disable('x-powered-by')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const whitelist = ['http://localhost:3001', 'http://localhost:9000', '<SONARQUBE_SERVER_URL>']
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// API CRUD UrlsProject
app.get('/api/all', asyncMiddleware(async (req, res, next) => {
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

app.post('/api/insert', asyncMiddleware(async (req, res, next) => {
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
      return res.status(400).json({ error: error })
    })
}))

app.delete('/api/delete', asyncMiddleware(async (req, res, next) => {
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

// API CRUD GreenIT X Lighthouse
// insert an analysis
app.post('/api/greenit/insert', asyncMiddleware(async (req, res, next) => {
  const projectName = req.body.projectName
  console.log('INSERT ANALYSIS - launch greenit and lighthouse analysis for project ' + projectName)
  analyseService.insert(projectName)
  res.status(202).send()
}))

// get analysis for an url
app.post('/api/greenit/url', asyncMiddleware(async (req, res, next) => {
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
app.get('/api/greenit/project', asyncMiddleware(async (req, res, next) => {
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
app.get('/api/bestPractices/project', asyncMiddleware(async (req, res, next) => {
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
      return res.status(400).json({ error: error.message })
    })
}))

module.exports = app

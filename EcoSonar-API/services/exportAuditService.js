const exceljs = require('exceljs')
const retrieveAnalysisService = require('./retrieveAnalysisService')
const urlConfigurationService = require('./urlConfigurationService')
const SystemError = require('../utils/SystemError')

class ExportAuditService { }

ExportAuditService.prototype.exportAudit = async function (projectName) {
  // get Urls
  let urls = []
  let analysis = null
  await urlConfigurationService.getAll(projectName)
    .then((results) => {
      urls = results
    })
    .catch((error) => {
      if (error instanceof SystemError) {
        return new SystemError()
      }
      console.log('EXPORT EXCEL - No url retrieved for project ' + projectName)
    })
  // get project analysis
  await retrieveAnalysisService.getProjectAnalysis(projectName)
    .then((results) => {
      analysis = results
    }).catch((error) => {
      if (error instanceof SystemError) {
        return new SystemError()
      }
      console.log('EXPORT EXCEL - Analysis for project could not be retrieved')
    })

  if (urls.length === 0 || analysis == null) {
    throw new Error('Export Audit is not possible because urls were not inserted into project or analysis for project could not be retrieved')
  }

  // date
  const dateGreenitLastAnalysis = analysis.lastAnalysis.greenit !== null && analysis.lastAnalysis.greenit.dateAnalysis
    ? `${new Date(analysis.lastAnalysis.greenit.dateAnalysis).toDateString()} - ${new Date(analysis.lastAnalysis.greenit.dateAnalysis).toLocaleTimeString([], { hour12: false })}  `
    : null
  const dateLighthouseLastAnalysis = analysis.lastAnalysis.lighthouse !== null && analysis.lastAnalysis.lighthouse.dateAnalysis
    ? `${new Date(analysis.lastAnalysis.lighthouse.dateAnalysis).toDateString()} - ${new Date(analysis.lastAnalysis.lighthouse.dateAnalysis).toLocaleTimeString([], { hour12: false })}  `
    : null
  let dateLastAnalysis = null
  if (dateGreenitLastAnalysis !== null) {
    dateLastAnalysis = dateGreenitLastAnalysis
  } else if (dateLighthouseLastAnalysis !== null) {
    dateLastAnalysis = dateLighthouseLastAnalysis
  }
  // analysis
  let analysisGreenit = analysis.lastAnalysis.greenit
  let analysisW3c = analysis.lastAnalysis.w3c
  let lighthousePerformance, lighthouseAccessibility, lighthouseMetrics
  if (analysis.lastAnalysis.lighthouse) {
    lighthousePerformance = {
      displayValue: analysis.lastAnalysis.lighthouse.performance.displayValue,
      complianceLevel: analysis.lastAnalysis.lighthouse.performance.complianceLevel
    }
    lighthouseAccessibility = {
      displayValue: analysis.lastAnalysis.lighthouse.accessibility.displayValue,
      complianceLevel: analysis.lastAnalysis.lighthouse.accessibility.complianceLevel
    }
    lighthouseMetrics = {
      largestContentfulPaint: {
        displayValue: analysis.lastAnalysis.lighthouse.largestContentfulPaint.displayValue,
        complianceLevel: analysis.lastAnalysis.lighthouse.largestContentfulPaint.complianceLevel,
        score: analysis.lastAnalysis.lighthouse.largestContentfulPaint.score
      },
      firstContentfulPaint: {
        displayValue: analysis.lastAnalysis.lighthouse.firstContentfulPaint.displayValue,
        complianceLevel: analysis.lastAnalysis.lighthouse.firstContentfulPaint.complianceLevel,
        score: analysis.lastAnalysis.lighthouse.firstContentfulPaint.score
      },
      speedIndex: {
        displayValue: analysis.lastAnalysis.lighthouse.speedIndex.displayValue,
        complianceLevel: analysis.lastAnalysis.lighthouse.speedIndex.complianceLevel,
        score: analysis.lastAnalysis.lighthouse.speedIndex.score
      },
      totalBlockingTime: {
        displayValue: analysis.lastAnalysis.lighthouse.totalBlockingTime.displayValue,
        complianceLevel: analysis.lastAnalysis.lighthouse.totalBlockingTime.complianceLevel,
        score: analysis.lastAnalysis.lighthouse.totalBlockingTime.score
      },
      interactive: {
        displayValue: analysis.lastAnalysis.lighthouse.interactive.displayValue,
        complianceLevel: analysis.lastAnalysis.lighthouse.interactive.complianceLevel,
        score: analysis.lastAnalysis.lighthouse.interactive.score
      },
      cumulativeLayoutShift: {
        displayValue: analysis.lastAnalysis.lighthouse.cumulativeLayoutShift.displayValue,
        complianceLevel: analysis.lastAnalysis.lighthouse.cumulativeLayoutShift.complianceLevel,
        score: analysis.lastAnalysis.lighthouse.cumulativeLayoutShift.score
      }
    }
  }
  try {
    const workbook = await new exceljs.Workbook()
    // which tab is active at the openning
    workbook.views = [
      {
        x: 0, y: 0, width: 10000, height: 20000, firstSheet: 0, activeTab: 0, visibility: 'visible'
      }
    ]
    // project page
    formatExcelSheet('', 0, workbook, projectName, analysisGreenit, analysisW3c, lighthouseAccessibility, lighthousePerformance, lighthouseMetrics, dateLastAnalysis)
    // url pages
    for (const [index, url] of urls.entries()) {
      await retrieveAnalysisService.getUrlAnalysis(projectName, url)
        .then((res) => {
          analysisGreenit = res.lastAnalysis.greenit
          analysisW3c = res.lastAnalysis.w3c
          lighthouseAccessibility = res.lastAnalysis.lighthouse !== null ? res.lastAnalysis.lighthouse.accessibility : null
          lighthousePerformance = res.lastAnalysis.lighthouse !== null ? res.lastAnalysis.lighthouse.performance : null
          lighthouseMetrics = res.lastAnalysis.lighthouse
          formatExcelSheet(url, index + 1, workbook, projectName, analysisGreenit, analysisW3c, lighthouseAccessibility, lighthousePerformance, lighthouseMetrics, dateLastAnalysis)
        })
        .catch((error) => {
          console.error(error.message)
          console.log('Analysis for URL ' + url + ' could not be resolved ')
        })
    }
    return workbook.xlsx.writeBuffer()
  } catch (err) {
    console.error(err.message)
    return new Error('Could not export Audit to Excel for projet ' + projectName)
  }
}

function formatExcelSheet (urlName, index, workbook, projectName, analysisGreenit, analysisW3c, lighthouseAccessibility, lighthousePerformance, lighthouseMetrics, dateLastAnalysis) {
  let sheet
  if (urlName !== '') {
    sheet = workbook.addWorksheet('url' + index)
  } else {
    sheet = workbook.addWorksheet(projectName)
  }
  let row = sheet.getRow(1)
  row.getCell(1).value = 'EcoSonar Analysis'
  row.getCell(1).font = {
    bold: true,
    size: 16
  }
  // draw border of the cell
  row.getCell(1).border = {
    top: { style: 'thick' },
    left: { style: 'thick' },
    bottom: { style: 'thick' }
  }

  row.getCell(2).value = 'Date of last analysis'
  row.getCell(3).value = dateLastAnalysis
  // draw border of the cell
  row.getCell(2).border = {
    top: { style: 'thick' },
    bottom: { style: 'thick' }
  }
  // draw border of group the cell
  row.getCell(3).border = {
    top: { style: 'thick' },
    bottom: { style: 'thick' },
    right: { style: 'thick' }
  }
  // formatting
  row.getCell(1).alignment = { wrapText: true }
  row.getCell(2).alignment = { wrapText: true }
  row.getCell(3).alignment = { wrapText: true }

  let rowIndex = 3
  if (urlName !== '') {
    row = sheet.getRow(4)
    row.getCell(1).value = 'Audited Page:'
    row.getCell(1).font = {
      bold: true,
      size: 16
    }
    // draw border of the cell
    row.getCell(1).border = {
      top: { style: 'thick' },
      left: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    row.getCell(2).value = {
      text: urlName,
      hyperlink: urlName,
      tooltip: urlName
    }
    // draw border of the cell
    row.getCell(2).border = {
      top: { style: 'thick' },
      bottom: { style: 'thick' },
      right: { style: 'thick' }
    }
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    rowIndex = 6
  }
  // score and grade
  row = sheet.getRow(rowIndex)
  row.getCell(1).value = 'EcoIndex project grade (average)'
  if (analysisGreenit !== null) {
    row.getCell(2).value = analysisGreenit.grade
    setColor(row.getCell(2), analysisGreenit.grade)
  } else {
    row.getCell(2).value = 'no analysis'
    setColor(row.getCell(2), '')
  }
  row.getCell(3).value = 'Lighthouse Performance grade (average)'
  if (lighthousePerformance !== null) {
    row.getCell(4).value = lighthousePerformance.complianceLevel
    setColor(row.getCell(4), lighthousePerformance.complianceLevel)
  } else {
    row.getCell(4).value = 'no analysis'
    setColor(row.getCell(4), '')
  }
  row.getCell(5).value = 'Lighthouse Accessibility grade (average)'
  if (lighthouseAccessibility !== null) {
    row.getCell(6).value = lighthouseAccessibility.complianceLevel
    setColor(row.getCell(6), lighthouseAccessibility.complianceLevel)
  } else {
    row.getCell(6).value = 'no analysis'
    setColor(row.getCell(6), '')
  }
  row.getCell(7).value = 'W3C validator grade'
  if (analysisW3c !== null) {
    row.getCell(8).value = analysisW3c.grade
    setColor(row.getCell(8), analysisW3c.grade)
  } else {
    row.getCell(8).value = 'no analysis'
    setColor(row.getCell(8), '')
  }
  // draw border of the cell
  row.getCell(1).border = {
    top: { style: 'thick' },
    left: { style: 'thick' }
  }
  row.getCell(2).border = {
    top: { style: 'thick' },
    right: { style: 'thick' }
  }
  row.getCell(3).border = {
    top: { style: 'thick' }
  }
  row.getCell(4).border = {
    top: { style: 'thick' },
    right: { style: 'thick' }
  }
  row.getCell(5).border = {
    top: { style: 'thick' }
  }
  row.getCell(6).border = {
    top: { style: 'thick' },
    right: { style: 'thick' }
  }
  row.getCell(7).border = {
    top: { style: 'thick' }
  }
  row.getCell(8).border = {
    top: { style: 'thick' },
    right: { style: 'thick' }
  }
  // formatting
  row.getCell(1).alignment = { wrapText: true }
  row.getCell(2).alignment = { wrapText: true }
  row.getCell(3).alignment = { wrapText: true }
  row.getCell(4).alignment = { wrapText: true }
  row.getCell(5).alignment = { wrapText: true }
  row.getCell(6).alignment = { wrapText: true }
  row.getCell(7).alignment = { wrapText: true }
  row.getCell(8).alignment = { wrapText: true }
  rowIndex++

  row = sheet.getRow(rowIndex)
  row.getCell(1).value = 'EcoIndex project score (average)'
  if (analysisGreenit !== null) {
    row.getCell(2).value = analysisGreenit.ecoIndex
    setColor(row.getCell(2), analysisGreenit.grade)
  } else {
    row.getCell(2).value = 'no analysis'
    setColor(row.getCell(2), '')
  }
  row.getCell(3).value = 'Lighthouse Performance score (average)'
  if (lighthousePerformance !== null) {
    row.getCell(4).value = lighthousePerformance.displayValue
    setColor(row.getCell(4), lighthousePerformance.complianceLevel)
  } else {
    row.getCell(4).value = 'no analysis'
    setColor(row.getCell(4), '')
  }
  row.getCell(5).value = 'Lighthouse Accessibility score (average)'
  if (lighthouseAccessibility !== null) {
    row.getCell(6).value = lighthouseAccessibility.displayValue
    setColor(row.getCell(6), lighthouseAccessibility.complianceLevel)
  } else {
    row.getCell(6).value = 'no analysis'
    setColor(row.getCell(6), '')
  }
  row.getCell(7).value = 'W3C validator score'
  if (analysisW3c !== null) {
    row.getCell(8).value = analysisW3c.score
    setColor(row.getCell(8), analysisW3c.grade)
  } else {
    row.getCell(8).value = 'no analysis'
    setColor(row.getCell(8), '')
  }
  // draw border of the cell
  row.getCell(1).border = {
    left: { style: 'thick' },
    bottom: { style: 'thick' }
  }
  row.getCell(2).border = {
    bottom: { style: 'thick' },
    right: { style: 'thick' }
  }
  row.getCell(3).border = {
    bottom: { style: 'thick' }
  }
  row.getCell(4).border = {
    bottom: { style: 'thick' },
    right: { style: 'thick' }
  }
  row.getCell(5).border = {
    bottom: { style: 'thick' }
  }
  row.getCell(6).border = {
    bottom: { style: 'thick' },
    right: { style: 'thick' }
  }
  row.getCell(7).border = {
    bottom: { style: 'thick' }
  }
  row.getCell(8).border = {
    bottom: { style: 'thick' },
    right: { style: 'thick' }
  }
  // formatting
  row.getCell(1).alignment = { wrapText: true }
  row.getCell(2).alignment = { wrapText: true }
  row.getCell(3).alignment = { wrapText: true }
  row.getCell(4).alignment = { wrapText: true }
  row.getCell(5).alignment = { wrapText: true }
  row.getCell(6).alignment = { wrapText: true }
  row.getCell(7).alignment = { wrapText: true }
  row.getCell(8).alignment = { wrapText: true }
  rowIndex++

  // greenit Analysis metrics
  rowIndex++
  row = sheet.getRow(rowIndex)
  row.getCell(1).value = 'GreenIT-Analysis Metrics:'
  row.getCell(1).font = {
    bold: true,
    size: 14
  }
  // formatting
  row.getCell(1).alignment = { wrapText: true }
  rowIndex++
  // draw border of the cell
  row.getCell(1).border = {
    top: { style: 'thick' },
    left: { style: 'thick' }
  }
  row.getCell(2).border = {
    top: { style: 'thick' }
  }
  row.getCell(3).border = {
    right: { style: 'thick' },
    top: { style: 'thick' }
  }
  row = sheet.getRow(rowIndex)
  if (analysisGreenit !== null) {
    row.getCell(1).value = 'Size of the DOM (average)'
    row.getCell(2).value = analysisGreenit.domSize.displayValue
    row.getCell(3).value = analysisGreenit.domSize.complianceLevel
    setColor(row.getCell(3), analysisGreenit.domSize.complianceLevel)
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    rowIndex++
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(3).border = {
      right: { style: 'thick' }
    }
    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Number of requests (average)'
    row.getCell(2).value = analysisGreenit.nbRequest.displayValue
    row.getCell(3).value = analysisGreenit.nbRequest.complianceLevel
    setColor(row.getCell(3), analysisGreenit.nbRequest.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(3).border = {
      right: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    rowIndex++

    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Size of the page (Kb) (average)'
    row.getCell(2).value = analysisGreenit.responsesSize.displayValue
    row.getCell(3).value = analysisGreenit.responsesSize.complianceLevel
    setColor(row.getCell(3), analysisGreenit.responsesSize.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    row.getCell(2).border = {
      bottom: { style: 'thick' }
    }
    row.getCell(3).border = {
      right: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    rowIndex++
  } else {
    row.getCell(1).value = 'no analysis'
    setColor(row.getCell(1), '')
    // draw border of the cell
    row.getCell(1).border = {
      bottom: { style: 'thick' },
      left: { style: 'thick' }
    }
    row.getCell(2).border = {
      bottom: { style: 'thick' }
    }
    row.getCell(3).border = {
      bottom: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    rowIndex++
  }

  // Lighthouse performance metrics
  rowIndex++
  row = sheet.getRow(rowIndex)
  row.getCell(1).value = 'Lighthouse Performance Metrics:'
  row.getCell(1).font = {
    bold: true,
    size: 14
  }
  // formatting
  row.getCell(1).alignment = { wrapText: true }
  rowIndex++
  // draw border of the cell
  row.getCell(1).border = {
    top: { style: 'thick' },
    left: { style: 'thick' }
  }
  row.getCell(2).border = {
    top: { style: 'thick' }
  }
  row.getCell(3).border = {
    top: { style: 'thick' }
  }
  row.getCell(4).border = {
    right: { style: 'thick' },
    top: { style: 'thick' }
  }

  row = sheet.getRow(rowIndex)
  if (lighthouseMetrics !== null) {
    row.getCell(1).value = 'Largest Contentful Paint (s) (average)'
    row.getCell(2).value = lighthouseMetrics.largestContentfulPaint.displayValue
    row.getCell(3).value = lighthouseMetrics.largestContentfulPaint.complianceLevel
    row.getCell(4).value = lighthouseMetrics.largestContentfulPaint.score
    setColor(row.getCell(3), lighthouseMetrics.largestContentfulPaint.complianceLevel)
    setColor(row.getCell(4), lighthouseMetrics.largestContentfulPaint.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    row.getCell(4).alignment = { wrapText: true }
    rowIndex++

    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Cumulative Layout Shift (average)'
    row.getCell(2).value = lighthouseMetrics.cumulativeLayoutShift.displayValue
    row.getCell(3).value = lighthouseMetrics.cumulativeLayoutShift.complianceLevel
    row.getCell(4).value = lighthouseMetrics.cumulativeLayoutShift.score
    setColor(row.getCell(3), lighthouseMetrics.cumulativeLayoutShift.complianceLevel)
    setColor(row.getCell(4), lighthouseMetrics.cumulativeLayoutShift.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    row.getCell(4).alignment = { wrapText: true }
    rowIndex++

    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'First Contentful Paint (s) (average)'
    row.getCell(2).value = lighthouseMetrics.firstContentfulPaint.displayValue
    row.getCell(3).value = lighthouseMetrics.firstContentfulPaint.complianceLevel
    row.getCell(4).value = lighthouseMetrics.firstContentfulPaint.score
    setColor(row.getCell(3), lighthouseMetrics.firstContentfulPaint.complianceLevel)
    setColor(row.getCell(4), lighthouseMetrics.firstContentfulPaint.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    row.getCell(4).alignment = { wrapText: true }
    rowIndex++

    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Speed Index (s) (average)'
    row.getCell(2).value = lighthouseMetrics.speedIndex.displayValue
    row.getCell(3).value = lighthouseMetrics.speedIndex.complianceLevel
    row.getCell(4).value = lighthouseMetrics.speedIndex.score
    setColor(row.getCell(3), lighthouseMetrics.speedIndex.complianceLevel)
    setColor(row.getCell(4), lighthouseMetrics.speedIndex.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    row.getCell(4).alignment = { wrapText: true }
    rowIndex++

    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Total Blocking Time (ms) (average)'
    row.getCell(2).value = lighthouseMetrics.totalBlockingTime.displayValue
    row.getCell(3).value = lighthouseMetrics.totalBlockingTime.complianceLevel
    row.getCell(4).value = lighthouseMetrics.totalBlockingTime.score
    setColor(row.getCell(3), lighthouseMetrics.totalBlockingTime.complianceLevel)
    setColor(row.getCell(4), lighthouseMetrics.totalBlockingTime.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    row.getCell(4).alignment = { wrapText: true }
    rowIndex++

    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Time to interactive (s) (average)'
    row.getCell(2).value = lighthouseMetrics.interactive.displayValue
    row.getCell(3).value = lighthouseMetrics.interactive.complianceLevel
    row.getCell(4).value = lighthouseMetrics.interactive.score
    setColor(row.getCell(3), lighthouseMetrics.interactive.complianceLevel)
    setColor(row.getCell(4), lighthouseMetrics.interactive.complianceLevel)
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    row.getCell(2).border = {
      bottom: { style: 'thick' }
    }
    row.getCell(3).border = {
      bottom: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    row.getCell(3).alignment = { wrapText: true }
    row.getCell(4).alignment = { wrapText: true }
    rowIndex++
  } else {
    row.getCell(1).value = 'no analysis'
    setColor(row.getCell(1), '')
    // draw border of the cell
    row.getCell(1).border = {
      bottom: { style: 'thick' },
      left: { style: 'thick' }
    }
    row.getCell(2).border = {
      bottom: { style: 'thick' }
    }
    row.getCell(3).border = {
      bottom: { style: 'thick' }
    }
    row.getCell(4).border = {
      right: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    rowIndex++
  }

  // W3c validator
  rowIndex++
  row = sheet.getRow(rowIndex)
  row.getCell(1).value = 'W3C Validator Metrics:'
  row.getCell(1).font = {
    bold: true,
    size: 14
  }
  // formatting
  row.getCell(1).alignment = { wrapText: true }
  rowIndex++
  // draw border of the cell
  row.getCell(1).border = {
    top: { style: 'thick' },
    left: { style: 'thick' }
  }
  row.getCell(2).border = {
    top: { style: 'thick' },
    right: { style: 'thick' }
  }

  row = sheet.getRow(rowIndex)
  if (analysisW3c !== null) {
    row.getCell(1).value = 'Number of Infos'
    row.getCell(2).value = analysisW3c.totalInfo
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    rowIndex++
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(2).border = {
      right: { style: 'thick' }
    }
    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Number of Warnings'
    row.getCell(2).value = analysisW3c.totalWarning
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    rowIndex++
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(2).border = {
      right: { style: 'thick' }
    }
    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Number of Errors'
    row.getCell(2).value = analysisW3c.totalError
    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
    rowIndex++
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' }
    }
    row.getCell(2).border = {
      right: { style: 'thick' }
    }
    row = sheet.getRow(rowIndex)
    row.getCell(1).value = 'Number of Fatal Errors'
    row.getCell(2).value = analysisW3c.totalFatalError
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    row.getCell(2).border = {
      right: { style: 'thick' },
      bottom: { style: 'thick' }
    }

    // formatting
    row.getCell(1).alignment = { wrapText: true }
    row.getCell(2).alignment = { wrapText: true }
  } else {
    row.getCell(1).value = 'no analysis'
    setColor(row.getCell(1), '')
    // draw border of the cell
    row.getCell(1).border = {
      left: { style: 'thick' },
      bottom: { style: 'thick' }
    }
    row.getCell(2).border = {
      right: { style: 'thick' },
      bottom: { style: 'thick' }
    }
  }

  // Adapting each column's size to view all text
  sheet.columns.forEach(function (column) {
    let maxLength = 0
    column.eachCell({ includeEmpty: true }, function (cell) {
      const columnLength = cell.value ? cell.value.toString().length : 10
      if (columnLength > maxLength) {
        maxLength = columnLength
      }
    })
    column.width = maxLength < 10 ? 10 : maxLength
  })
}

function setColor (cell, grade) {
  let couleur
  if (grade === 'A' || grade === 'B') {
    couleur = '0cf000'
  } else if (grade === 'C' || grade === 'D') {
    couleur = 'ff9500'
  } else if (grade === 'E' || grade === 'F' || grade === 'G') {
    couleur = 'FF3A3A'
  } else {
    couleur = 'e6e6e6'
  }
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: couleur }
  }
}

const exportAuditService = new ExportAuditService()
module.exports = exportAuditService

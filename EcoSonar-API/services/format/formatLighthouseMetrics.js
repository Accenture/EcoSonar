class FormatLighthouseMetrics {}

FormatLighthouseMetrics.prototype.complianceLevel = function (score) {
  if (score === 'N.A' || score === null) {
    return 'N.A'
  } else if (score > 75) {
    return 'A'
  } else if (score > 65) {
    return 'B'
  } else if (score > 50) {
    return 'C'
  } else if (score > 35) {
    return 'D'
  } else if (score > 20) {
    return 'E'
  } else if (score > 5) {
    return 'F'
  } else return 'G'
}

FormatLighthouseMetrics.prototype.formatPerf = function (reports) {
  return {
    score: Math.trunc(reports.categories.performance.score * 100),
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.categories.performance.score * 100)
    )
  }
}
FormatLighthouseMetrics.prototype.formatAccess = function (reports) {
  return {
    score: Math.trunc(reports.categories.accessibility.score * 100),
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.categories.accessibility.score * 100)
    )
  }
}
FormatLighthouseMetrics.prototype.formatLargestContentfulPaint = function (reports) {
  return {
    score: Math.trunc(reports.audits['largest-contentful-paint'].score * 100),
    displayValue: reports.audits['largest-contentful-paint'].displayValue,
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.audits['largest-contentful-paint'].score * 100)
    )
  }
}
FormatLighthouseMetrics.prototype.formatCumulativeLayoutShift = function (reports) {
  return {
    score: Math.trunc(reports.audits['cumulative-layout-shift'].score * 100),
    displayValue: reports.audits['cumulative-layout-shift'].displayValue,
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.audits['cumulative-layout-shift'].score * 100)
    )
  }
}
FormatLighthouseMetrics.prototype.formatFirstContentfulPaint = function (reports) {
  return {
    score: Math.trunc(reports.audits['first-contentful-paint'].score * 100),
    displayValue: reports.audits['first-contentful-paint'].displayValue,
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.audits['first-contentful-paint'].score * 100)
    )
  }
}
FormatLighthouseMetrics.prototype.formatSpeedIndex = function (reports) {
  return {
    score: Math.trunc(reports.audits['speed-index'].score * 100),
    displayValue: reports.audits['speed-index'].displayValue,
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.audits['speed-index'].score * 100)
    )
  }
}
FormatLighthouseMetrics.prototype.formatTotalBlockingTime = function (reports) {
  return {
    score: Math.trunc(reports.audits['total-blocking-time'].score * 100),
    displayValue: reports.audits['total-blocking-time'].displayValue,
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.audits['total-blocking-time'].score * 100)
    )
  }
}
FormatLighthouseMetrics.prototype.formatInteractive = function (reports) {
  return {
    score: Math.trunc(reports.audits.interactive.score * 100),
    displayValue: reports.audits.interactive.displayValue,
    complianceLevel: this.complianceLevel(
      Math.trunc(reports.audits.interactive.score * 100)
    )
  }
}

const formatLighthouseMetrics = new FormatLighthouseMetrics()
module.exports = formatLighthouseMetrics

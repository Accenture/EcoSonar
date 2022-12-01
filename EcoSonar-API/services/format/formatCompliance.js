class FormatCompliance {}

// EcoIndex -> Grade
FormatCompliance.prototype.getGrade = function (score) {
  if (score > 80) {
    return 'A'
  } else if (score > 70) {
    return 'B'
  } else if (score > 55) {
    return 'C'
  } else if (score > 40) {
    return 'D'
  } else if (score > 25) {
    return 'E'
  } else if (score > 10) {
    return 'F'
  } else return 'G'
}

// Lighthouse Metrics compliance Level
FormatCompliance.prototype.complianceLevel = function (score) {
  if (score === 'N.A' || score === null) {
    return 'N.A'
  } else if (score > 80) {
    return 'A'
  } else if (score > 70) {
    return 'B'
  } else if (score > 55) {
    return 'C'
  } else if (score > 40) {
    return 'D'
  } else if (score > 25) {
    return 'E'
  } else if (score > 10) {
    return 'F'
  } else return 'G'
}

// W3C Compliance Level
FormatCompliance.prototype.complianceLevelW3c = function (type) {
  if (type === 'info') {
    return 'C'
  }
  if (type === 'warning') {
    return 'E'
  }
  if (type === 'error' || type === 'fatal error' || !type) {
    return 'G'
  }
}

const formatCompliance = new FormatCompliance()
module.exports = formatCompliance

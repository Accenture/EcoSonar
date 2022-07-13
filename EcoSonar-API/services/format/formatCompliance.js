class FormatCompliance {}

// EcoIndex -> Grade
FormatCompliance.prototype.getGrade = function (score) {
  if (score > 75) {
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

// Lighthouse Metrics compliance Level
FormatCompliance.prototype.complianceLevel = function (score) {
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

const formatCompliance = new FormatCompliance()
module.exports = formatCompliance

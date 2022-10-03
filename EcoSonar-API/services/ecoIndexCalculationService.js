class EcoIndexCalculationService {}

EcoIndexCalculationService.prototype.computeQuantile = function (quantiles, value) {
  for (let i = 1; i < quantiles.length; i++) {
    if (value < quantiles[i]) return (i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1]))
  }
  return quantiles.length - 1
}

EcoIndexCalculationService.prototype.calculateEcoIndex = function (dom, req, size) {
  const quantilesdom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601]
  const quantilesreq = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920]
  const quantilessize = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26]

  const qdom = this.computeQuantile(quantilesdom, dom)
  const qreq = this.computeQuantile(quantilesreq, req)
  const qsize = this.computeQuantile(quantilessize, size)
  return Math.round(100 - (5 * (3 * qdom + 2 * qreq + qsize)) / 6)
}

EcoIndexCalculationService.prototype.setScoreLetter = function (metric, value) {
  const domSize = [350, 480, 707, 1350, 1653, 2400]
  const nbRequest = [10, 25, 33, 40, 86, 168]
  const responseSize = [132, 505, 1500, 1800, 2400, 3382]

  let rangedArray
  switch (metric) {
    case 'domSize':
      rangedArray = domSize
      break
    case 'nbRequest':
      rangedArray = nbRequest
      break
    case 'responseSize':
      rangedArray = responseSize
      break
    default:
      break
  }

  if (value === 'N.A' || value === null) {
    return 'N.A'
  } else if (value <= rangedArray[0]) {
    return 'A'
  } else if (value <= rangedArray[1]) {
    return 'B'
  } else if (value <= rangedArray[2]) {
    return 'C'
  } else if (value <= rangedArray[3]) {
    return 'D'
  } else if (value <= rangedArray[4]) {
    return 'E'
  } else if (value <= rangedArray[5]) {
    return 'F'
  } else return 'G'
}
const ecoIndexCalculationService = new EcoIndexCalculationService()
module.exports = ecoIndexCalculationService

const concat = require('concat-files')
const glob = require('glob')
const fs = require('fs')

const DIR = './services/greenit-analysis/dist'

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR)
}

const rules = glob.sync('./services/greenit-analysis/greenit-core/rules/*.js')

// One script to analyse them all
concat([
  './services/greenit-analysis/greenit-core/analyseFrameCore.js',
  './services/greenit-analysis/greenit-core/utils.js',
  './services/greenit-analysis/greenit-core/rulesManager.js',
  './services/greenit-analysis/greenit-core/ecoIndex.js',
  ...rules,
  './services/greenit-analysis/greenit-core/greenpanel.js'
], './services/greenit-analysis/dist/bundle.js', function (err) {
  if (err) throw err
  console.log('build complete')
})

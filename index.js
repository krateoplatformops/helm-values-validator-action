const core = require('@actions/core')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
require('colors')
const helpers = require('./helpers')
const util = require('node:util')

const FOLDER_NOT_FOUND = 'The folder "%s" is not found'
const ORPHANS_FOUND = 'Some orphans found'

try {
  const chartFolder = core.getInput('chart-folder')
  const stopIfFindOrphans = core.getInput('stop-if-find-orphans') === 'true'
  const stopOnErrors = core.getInput('stop-on-error') === 'true'
  const ignore = core.getInput('ignore') || ''

  // Check if the folder exists
  if (!fs.existsSync(chartFolder)) {
    if (stopOnErrors) {
      throw new Error(util.format(FOLDER_NOT_FOUND, chartFolder))
    } else {
      console.log(FOLDER_NOT_FOUND.red, chartFolder)
    }
    return
  }

  const templates = helpers.getAllFiles(path.join(chartFolder, 'templates'))
  const placeholders = helpers.getPlaceholders(templates)

  // Values
  const valuesFile = yaml.load(
    fs.readFileSync(path.join(chartFolder, 'values.yaml'), 'utf8')
  )
  const values = helpers.propertiesToArray(valuesFile)

  // Check for missing placeholders
  const orphanValues = []
  const ignoreList = ignore.split(',').map((x) => x.trim())

  values.forEach((p) => {
    if (
      !placeholders[p] &&
      ignoreList.filter((x) => p.startsWith(x + '.') || p === x).length === 0
    ) {
      orphanValues.push(p)
    }
  })

  if (orphanValues.length > 0) {
    console.log('### Unused properties ###'.bold)
    orphanValues.forEach((p) => {
      console.log(p.red)
    })
  }

  if (orphanValues.length > 0 && stopIfFindOrphans) {
    throw new Error(ORPHANS_FOUND)
  }
} catch (error) {
  core.setFailed(error.message)
}

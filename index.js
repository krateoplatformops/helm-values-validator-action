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
  // const chartFolder = core.getInput('chart-folder')
  // const stopIfOrphans = core.getInput('stop-if-find-orphans') === 'true'
  // const stopOnErrors = core.getInput('stop-on-error') === 'true'

  const chartFolder = './chart'
  const stopOnErrors = false
  const stopIfFindOrphans = false

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
  const orphanTemplates = []
  values.forEach((p) => {
    if (!placeholders[p]) {
      orphanValues.push(p)
    }
  })
  // Check for missing values
  Object.keys(placeholders).forEach((p) => {
    if (!values.includes(p)) {
      orphanTemplates.push(p)
    }
  })

  if (orphanValues.length > 0) {
    console.log('### values.yaml ###'.bold)
    orphanValues.forEach((p) => {
      console.log(`Unused prop: ${p}`.red)
    })
  }
  if (orphanTemplates.length > 0) {
    console.log('### templates ###'.bold)
    orphanTemplates.forEach((p) => {
      console.log(`Missing: ${p}`.red)
    })
  }

  if (
    (orphanValues.length > 0 || orphanTemplates.length > 0) &&
    stopIfFindOrphans
  ) {
    throw new Error(ORPHANS_FOUND)
  }
} catch (error) {
  core.setFailed(error.message)
}

const fs = require('fs')
const path = require('path')

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else {
      const ext = path.extname(file).toLowerCase()
      if (['.yaml', '.yml'].includes(ext)) {
        arrayOfFiles.push(path.join(dirPath, '/', file))
      }
    }
  })

  return arrayOfFiles
}

const getPlaceholders = (templates) => {
  const placeholders = []
  const regex =
    /\{\{[^{}]*[^\w\s\.]?\s*\.Values\s*([^{}\s]*)\s*[^\w\s\.]?[^{}]*\}\}/gm
  templates.forEach((template) => {
    const file = fs.readFileSync(template, 'utf8')
    while ((m = regex.exec(file)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }
      const p = m[1]
        .trim()
        .substring(1)
        .replace(/[^\w.]|_/gm, '')
      if (!placeholders[p]) {
        placeholders[p] = 1
      } else {
        placeholders[p]++
      }
    }
  })
  return placeholders
}

const propertiesToArray = (obj) => {
  const isObject = (val) =>
    val && typeof val === 'object' && !Array.isArray(val)

  const addDelimiter = (a, b) => (a ? `${a}.${b}` : b)

  const paths = (obj = {}, head = '') => {
    return Object.entries(obj).reduce((product, [key, value]) => {
      let fullPath = addDelimiter(head, key)
      return isObject(value)
        ? product.concat(paths(value, fullPath))
        : product.concat(fullPath)
    }, [])
  }

  return paths(obj)
}

module.exports = {
  getAllFiles,
  getPlaceholders,
  propertiesToArray
}

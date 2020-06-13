/* This file fixes an issue which causes NYC to error with: "Invalid file coverage object, missing keys, found:data"
  For some reason reports sometimes have all their data in the "data" key. This script simply moves everything in
  the data key up one level. */

const fs = require('fs')

const cypressData = JSON.parse(fs.readFileSync('coverage/from-cypress.json').toString())
const jestData = JSON.parse(fs.readFileSync('coverage/from-jest.json').toString())

raise(cypressData)
raise(jestData)

function raise (report) {
  for (const key in report) {
    if (!report.hasOwnProperty(key)) {
      continue
    }

    if (report[key].data) {
      report[key] = report[key].data
    }
  }
}

fs.writeFileSync('coverage/from-cypress.json', JSON.stringify(cypressData))
fs.writeFileSync('coverage/from-jest.json', JSON.stringify(jestData))

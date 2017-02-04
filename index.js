const del = require('del')
const express = require('express')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const uuid = require('node-uuid')
const webdriverio = require('webdriverio')
const bodyParser = require('body-parser')
// const pHash = require('phash')
mkdirp(path.join(__dirname, 'tmp'))

const WAIT_TIME = 15000

const app = express()
const browserName = 'chrome'
const options = {
  host: process.env.SELENIUM_HOST || 'localhost',
  desiredCapabilities: { browserName }
}
const viewportSize = { height: 2190, width: 980 }

app.use(bodyParser.json())
app.get('/', function (req, res, next) {
  const url = req.query.url
  if (!url) {
    return res.status(400).json('url missing')
  }
  getScreenshot(url, res, next)
})

app.post('/', function (req, res, next) {
  const url = req.body.url
  if (!url) {
    return res.status(400).json('url missing')
  }
  getScreenshot(url, res, next)
})

function getScreenshot (url, res, next) {
  const requestId = uuid.v1()
  const screenshotFilename = path.join(
    __dirname,
    'tmp',
    `${requestId}-${browserName}.jpg`
  )

  // creating new browser instance on every request
  const browser = webdriverio.remote(options).init()
  let screenshot
  browser
    .setViewportSize(viewportSize, true)
    .url(url)
    .then(() => {
      // instead of pausing we need a way of determining if
      // browser is done loading and displaying (PDF?)
      return browser.pause(4000)
    })
    .then(() => {
      console.log(`Saving screenshot: ${requestId}-${browserName}.jpg`)
      browser.saveScreenshot(screenshotFilename)
    })
    .then(() => {
      const start = new Date().getTime()
      const interval = setInterval(
        () => {
          console.log(`Waiting for ${requestId}-${browserName}.jpg to exist`)
          const now = new Date().getTime()
          if (now - start > WAIT_TIME) {
            clearInterval(interval)
            res.sendStatus(500)
            browser.end()
          } else if (fs.existsSync(screenshotFilename)) {
            console.log(`Found ${requestId}-${browserName}.jpg!`)
            clearInterval(interval)
            res.sendFile(screenshotFilename)
            browser.end()
          }
        },
        100
      )
      setTimeout(() => {
        del([screenshotFilename])
      }, WAIT_TIME + 10000)
    })
    .catch(next)
}

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log(`screenshot-service on port ${PORT}!`)
})

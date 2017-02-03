const express = require('express')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const uuid = require('node-uuid')
const webdriverio = require('webdriverio')
const bodyParser = require('body-parser')
// const pHash = require('phash')

mkdirp(path.join(__dirname, 'tmp'))

const app = express()
const browserName = 'firefox'
const options = { desiredCapabilities: { browserName } }
const viewportSize = { height: 800, width: 1080 }

app.use(bodyParser.json())
app.get('/', function (req, res) {
  res.send('Insert instructions here...')
})

app.post('/', function (req, res) {
  console.log('a')
  const requestId = uuid.v1()
  const screenshotFilename = `${requestId}-${browserName}.jpg`
  const url = req.body.url
  if (!url) {
    return res.status(400).json('url missing')
  }

  // creating new browser instance on every request
  const browser = webdriverio.remote(options).init()
  browser
    .setViewportSize(viewportSize, true)
    .url(url)
    .then(() => {
      // instead of pausing we need a way of determining if
      // browser is done loading and displaying
      return browser.pause(5000)
    })
    .then(() => {
      browser.saveScreenshot(path.join(__dirname, 'tmp', screenshotFilename))
    })
    // .then(() => {
    //   return new Promise((resolve, reject) => {
    //     var hashA = pHash.imageHashSync("a.jpg")
    //     pHash.imageHash(screenshotFilename, (error, hash) => {
    //       if (error) {
    //         reject(error)
    //       }
    //       res.json({hash})
    //       resolve()
    //     })
    //   })
    // })
    // .then(() => {
    //   del([screenshotFilename])
    // })
    .catch(error => {
      console.log({error})
    })
    .end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log(`phash-service on port ${PORT}!`)
})

const pHash = require('phash')

const filename = 'tmp/8d3747e0-e973-11e6-98c5-010798dc8e46-firefox.jpg'

pHash.imageHash(filename, (error, hash) => {
  console.log(error, hash)
})

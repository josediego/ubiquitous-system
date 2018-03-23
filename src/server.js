const url = require('url')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

function rawBodySaver(req, res, buf, encoding) {
    if (buf && buf.length) req.rawBody = buf.toString(encoding || 'utf8')
}
app.use(bodyParser.json({ verify: rawBodySaver }))
app.use(bodyParser.urlencoded({ extended: false, verify: rawBodySaver }))
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }))

app.use(cors())

const server = require('http').createServer(app)
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log('listening on port', port)
})
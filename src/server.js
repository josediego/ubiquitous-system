const url = require("url")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const Raven = require("raven")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const app = express()

// Sentry setup
if (!process.env.SENTRY_DSN)
  throw new Error("SENTRY_DSN environment variable missing")
Raven.config(process.env.SENTRY_DSN, {
  release: process.env.RELEASED_REVISION
}).install()
// Raven request (and error) handler must be the first middleware on the app
app.use(Raven.requestHandler())

function rawBodySaver(req, res, buf, encoding) {
  if (buf && buf.length) req.rawBody = buf.toString(encoding || "utf8")
}
app.use(
  bodyParser.json({
    verify: rawBodySaver
  })
)
app.use(
  bodyParser.urlencoded({
    extended: false,
    verify: rawBodySaver
  })
)
app.use(
  bodyParser.raw({
    verify: rawBodySaver,
    type: function() {
      return true
    }
  })
)

const dbConfig = require("../config/database.config.js")
mongoose.connect(dbConfig.url, {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PWD
})

mongoose.connection.on("error", function() {
  console.log("Could not connect to the database. Exiting now...")
  process.exit()
})

mongoose.connection.once("open", function() {
  console.log("Successfully connected to the database")
})

app.use(cors())

// define a simple route
app.get("/", function(req, res) {
  res.json({
    message:
      "Welcome to Markdown Editor. Do markdown files easy and quickly. Organize and keep track of all your markdowns."
  })
})

require("./routes/markdown.routes.js")(app)

// Raven error handler must be before all other error handlers
// but after request handlers
app.use(Raven.errorHandler())

const server = require("http").createServer(app)
const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log("listening on port", port)
})

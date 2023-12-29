const express = require('express')
const app = express()
app.use(express.json())
const cors = require("cors")
const notesController = require("./controllers/notes")
require('http')
const mongoose = require('mongoose')
require('mongodb')
const {url} = require("./utils/config")
const {errorHandler,unknownEndpoint,requestLogger} = require("./utils/middleware")


mongoose.set('strictQuery',false)
mongoose.connect(url)

app.use(cors())
app.use(express.static("dist"))

  app.use(requestLogger)
  app.use("/api/notes", notesController)
 
  app.use(unknownEndpoint)

  app.use(errorHandler)

  module.exports = app
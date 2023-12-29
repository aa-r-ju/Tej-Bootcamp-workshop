const express = require('express')
const app = express()
app.use(express.json())
const cors = require("cors")
require('http')
const mongoose = require('mongoose')
require('mongodb')
const {url, PORT} = require("./utils/config")
const {errorHandler,unknownEndpoint,requestLogger} = require("./utils/middleware")
const {info} = require("./utils/logger")


mongoose.set('strictQuery',false)
mongoose.connect(url)




app.use(cors())
app.use(express.static("dist"))

  

  app.use(requestLogger)

  

  



  
  app.use(unknownEndpoint)



  app.use(errorHandler)

  module.exports = app
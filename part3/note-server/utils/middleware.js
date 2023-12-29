const {info} = require("./logger")


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
 


const errorHandler = (error, request, response, next) => {
    info(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }


  const requestLogger = (request, response, next) => {
    info('Method:', request.method)
    info('Path:  ', request.path)
    info('Body:  ', request.body)
    info('---')
    next()
  }
  


  module.exports = {
    errorHandler,
    unknownEndpoint,
    requestLogger
  }
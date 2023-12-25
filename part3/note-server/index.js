const express = require('express')
const app = express()
app.use(express.json())
const cors = require("cors")
const { request } = require('http')
const mongoose = require('mongoose')
const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb')

const url =
`mongodb+srv://Phonebook:phonebook@phonebook.fclcj21.mongodb.net/Phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})


noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)







app.use(cors())
app.use(express.static("dist"))

let notes = []


  const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

  
  app.get('/api/notes', (request, response) => {
    Note.find({}).then((result)=>{
      response.json(result)
    })
  })

  app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).send(`There are no notes at ${request.params.id}`)
      }
    }).catch((e)=> {
      next(e)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})



  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })
  



  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)



  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)



const PORT = process.env.PORT ? process.env.PORT : 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
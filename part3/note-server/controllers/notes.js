const app = require("express").Router()
const Note = require("../models/note")

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
    .then(
      response.status(204).end()
     )
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


  module.exports = app
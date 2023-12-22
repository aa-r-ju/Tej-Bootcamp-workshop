const express = require('express')
const app = express()
app.use(express.json())
const cors = require("cors")
const { request } = require('http')
const mongoose = require('mongoose')

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

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    
    if (note) {
      response.json(note)
    } else {
      response.status(404).send(`There are no notes at ${id}`)
    }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const myId = Number(request.params.id)
    notes = notes.filter(note => note.id !== myId)
  
    response.status(204).send(`The note at id ${myId} has been deleted`)
  })


  app.post('/api/notes', (request, response) => {
    const note = request.body
    note.id = notes.length+1
    notes.push(note)
    response.status(201).json(note)

    // const note = new Note({
    //   content: 'HTML is not Easy',
    //   important: true,
    // })
    
    // note.save().then(result => {
    //   console.log('note saved!')
    //   mongoose.connection.close()
    // })
  })



  app.put("/api/notes/:id", (request, response) => {
    const myId = Number(request.params.id);
    const updatedNote = request.body;
    let noteFound = false;
  
    const updatedNotes = notes.map((note) => {
      if (note.id !== myId) return note;
      else {
        noteFound = true;
        return updatedNote;
      }
    });
  
    if (noteFound) {
      notes = updatedNotes;
  
      response.status(202).json(updatedNote);
    } else {
      response.status(404).send(`There are no notes at ${myId}`);
    }
  });
  



  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)



const PORT = process.env.PORT ? process.env.PORT : 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
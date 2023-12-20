const express = require('express')
const app = express()
app.use(express.json())
const cors = require("cors")
const { request } = require('http')
  

app.use(cors())
app.use(express.static("dist"))

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]


  const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
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
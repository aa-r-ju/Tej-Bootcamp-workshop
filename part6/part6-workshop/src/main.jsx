import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import noteReducer from './reducers/noteReducer'
import { createStore } from 'redux'
import App from './App'
import { Provider } from 'react-redux'

const store = createStore(noteReducer)


const root = ReactDOM.createRoot(document.getElementById('root'))


  root.render(<Provider store={store}> <App /> </Provider>)

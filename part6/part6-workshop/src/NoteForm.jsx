import { useSelector, useDispatch } from 'react-redux'
import {createNote} from './reducers/noteReducer'
const NoteForm = () => {
    const notes = useSelector(state => state)
    const dispatch = useDispatch()

    const addNote = (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        dispatch(createNote(content))
      }
    return (
    <form onSubmit={addNote}>
        <input name="note" /> 
        <button type="submit">add note</button>
      </form>
    )
}

export default NoteForm;
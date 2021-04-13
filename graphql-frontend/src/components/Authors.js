import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {

  const authorQuery = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState(null)

  // refetchQueries will update the cache for the other views
  // onError allows error handling
  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError("All fields must be filled out to update birth year")
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    console.log('update author...')

    const name = event.target.name.value
    const setBornTo = parseInt(event.target.born.value)

    editAuthor({  variables: { name, setBornTo } })

    event.target.name.value = ''
    event.target.born.value = ''
  }

  useEffect(() => {
    if (authorQuery.data) {
      setAuthors(authorQuery.data.allAuthors)
    }
  }, [authorQuery])

  // this results in ESLint error because of props not being in dependency array,
  // but adding it there will result in infinite render issue
  useEffect(() => {
    if (result.data && result.data.editAuthor === null) { 
      props.setError('Author not found')
    }
  }, [result.data])

  if (!props.show || !authors) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name        
          <select name="name">
            {authors.map(author =>
              <option key={author.name} value={author.name}>{author.name}</option>
            )}
          </select>
        </div>
        <div>
          born
          <input
            name="born"
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors

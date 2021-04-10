import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {

  const authorQuery = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState(null)

  useEffect(() => {
    if (authorQuery.data) {
      setAuthors(authorQuery.data.allAuthors)
    }
  }, [authorQuery])

  // refetchQueries will update the cache for the other views
  // onError allows error handling
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError("All fields must be filled out")
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
          <input
            name="name"
          />
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

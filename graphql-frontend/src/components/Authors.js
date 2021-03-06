import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {

  const authorQuery = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState(null)

  // refetchQueries will update the cache for the other views
  // onError allows error handling
  // update is alternative to refetchQueries that is possibly optimized
  // in this situation, the edited author is filtered out and re-added through response.data
  // Note: The update piece is now technically redundant due to the subscription hook in App.js
  // that also updates the cache. It is left here for demonstration.
  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      props.setError("Error: " + error.message)
    },
    update: (store, response) => {
      // const dataInStore = store.readQuery({ query: ALL_AUTHORS })
      // store.writeQuery({
      //   query: ALL_AUTHORS,     
      //   data: {
      //     ...dataInStore,
      //     allAuthors: [ ...dataInStore.allAuthors.filter(author => author.name !== response.data.editAuthor.name), response.data.editAuthor ]
      //   }
      // })
      props.updateCacheWith('AUTHOR',response.data.editAuthor)
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
      props.setError('Could not change author\'s birth year')
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

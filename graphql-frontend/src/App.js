import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, AUTHOR_EDITED, ALL_AUTHORS } from './queries'

const Notify = ({ errorMessage }) => {
  if (!errorMessage)
    return null

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 7000)
  }

  const updateCacheWith = (type, addedElement) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    let dataInStore

    switch (type) {
      // for new books, the cache for the book collection and the author book count needs to be updated
      case 'BOOK':
        const addedBook = addedElement
        dataInStore = client.readQuery({ query: ALL_BOOKS })
        if (!includedIn(dataInStore.allBooks, addedBook)) {
          client.writeQuery({
            query: ALL_BOOKS,
            data: { allBooks : dataInStore.allBooks.concat(addedBook) }
          })

          // add author to cache if not included
          const authorToChange = addedBook.author
          dataInStore = client.readQuery({ query: ALL_AUTHORS })
          const authorObj = dataInStore.allAuthors.find(author => author.id === authorToChange.id)
          if (!authorObj) {
            client.writeQuery({
              query: ALL_AUTHORS,
              data: { allAuthors : dataInStore.allAuthors.concat({ ...authorToChange, bookCount: 1 }) }
            })
          } else {
            const newAuthorObj = {
              ...authorObj,
              bookCount: authorObj.bookCount ? authorObj.bookCount + 1 : 1
            }
  
            client.writeQuery({
              query: ALL_AUTHORS,
              data: {
                ...dataInStore,
                allAuthors: [ ...dataInStore.allAuthors.filter(author => author.id !== authorToChange.id), newAuthorObj ]
              }
            })
          }
        }
        break
      case 'AUTHOR':
        dataInStore = client.readQuery({ query: ALL_AUTHORS })
        client.writeQuery({
          query: ALL_AUTHORS,
          data: {
            ...dataInStore,
            allAuthors: [ ...dataInStore.allAuthors.filter(author => author.id !== addedElement.id), addedElement ]
          }
        })
        break
      default:
    }

  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith('BOOK',addedBook)
    }
  })

  useSubscription(AUTHOR_EDITED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const editedAuthor = subscriptionData.data.authorEdited
      notify(`${editedAuthor.name} edited`)
      updateCacheWith('AUTHOR',editedAuthor)
    }
  })

  // set token from local storage
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('booklist-user-token', token)
    setToken(tokenFromStorage)
  },[token])

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token
          ?
          <button onClick={() => setPage('login')}>login</button>
          :
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
            <button onClick={logout}>logout</button>
          </>
        }
      </div>

      <Authors
        show={page === 'authors'}
        setError={notify}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
        updateCacheWith={updateCacheWith}
      />

      <Recommendations
        show={page === 'recommendations'}
      />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setError={notify}
        redirect={setPage}
      />
    </div>
  )
}

export default App
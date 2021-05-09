import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, AUTHOR_EDITED, ALL_AUTHORS } from './queries'
import { Button, Page, Navigation, Notification } from './components/styles'

let TIMEOUT

const Notify = ({ errorMessage }) => {
  if (!errorMessage)
    return null

  return (
    <Notification>
      {errorMessage}
    </Notification>
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
    clearTimeout(TIMEOUT)
    setErrorMessage(message)
    TIMEOUT = setTimeout(() => {
      setErrorMessage(null)
    }, 4000)
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
    <Page>
      <Notify errorMessage={errorMessage} />
      <Navigation>
        <Button active={page} name='authors' onClick={() => setPage('authors')}>authors</Button>
        <Button active={page} name='books' onClick={() => setPage('books')}>books</Button>
        {!token
          ?
          <Button active={page} name='login' onClick={() => setPage('login')}>login</Button>
          :
          <>
            <Button active={page} name='add' onClick={() => setPage('add')}>add book</Button>
            <Button active={page} name='recommendations' onClick={() => setPage('recommendations')}>recommendations</Button>
            <Button active={page} name='logout' onClick={logout}>logout</Button>
          </>
        }
      </Navigation>

      <Authors
        show={page === 'authors'}
        setError={notify}
        updateCacheWith={updateCacheWith}
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
    </Page>
  )
}

export default App
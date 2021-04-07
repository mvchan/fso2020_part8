
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery } from '@apollo/client';

const ALL_AUTHORS = gql`
query {
  allAuthors  {
    name
    born
    bookCount
  }
}
`

const ALL_BOOKS = gql`
query {
  allBooks  {
    title
    author
    published
  }
}
`

const App = () => {
  const authorQuery = useQuery(ALL_AUTHORS)
  const bookQuery = useQuery(ALL_BOOKS)

  const [page, setPage] = useState('authors')
  const [authors, setAuthors] = useState(null)
  const [books, setBooks] = useState(null)

  useEffect(() => {
    if (authorQuery.data) {
      setAuthors(authorQuery.data.allAuthors)
    }
  }, [authorQuery])

  useEffect(() => {
    if (bookQuery.data) {
      setBooks(bookQuery.data.allBooks)
    }
  }, [bookQuery])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        authors={authors}
      />

      <Books
        show={page === 'books'}
        books={books}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App
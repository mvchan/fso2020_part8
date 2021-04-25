import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries'

const Books = (props) => {

  const [getBooks, bookQuery] = useLazyQuery(ALL_BOOKS)
  const [books, setBooks] = useState(null)

  const [genreFilter, setGenreFilter] = useState('all genres')
  const [genreList, setGenreList] = useState(null)

  // fetch books one time upon app load
  useEffect(() => {
    getBooks()
  }, [])

  // set books state if it's null
  useEffect(() => {
    if (!books && bookQuery.data) {
      setBooks(bookQuery.data.allBooks)
    }
  }, [books, bookQuery.data])

  // set books state using latest bookQuery.data upon filter change.
  // bookQuery.data is updated indirectly through mutation in NewBook since the mutation updates
  // the cache for the ALL_BOOKS query
  useEffect(() => {
    if (bookQuery.data) {
      setBooks(bookQuery.data.allBooks)
    }
  }, [genreFilter])

  // if books state is set, add all genres that are found from it into a list
  // and assign it to the genre list state
  useEffect(() => {
    if (books) {
      const genres = []
      books.forEach(book => {
        book.genres.forEach( g => !genres.includes(g) ? genres.push(g) : null)
      })
      
      setGenreList(Array.from(genres))
    }
  }, [books])

  const filter = genre => {
    setGenreFilter(genre)
  }

  if (!props.show || !books || !genreList) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre <b>{genreFilter}</b></p>
      <div>
        {genreList.map(g => 
          <button key={g} onClick={() => filter(g)}>{g}</button>
        )}
        <button onClick={() => filter('all genres')}>all genres</button>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.filter(book => book.genres.includes(genreFilter) || genreFilter === 'all genres').map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
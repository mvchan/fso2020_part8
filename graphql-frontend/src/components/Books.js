import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries'

const Books = (props) => {

  const bookQuery = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState(null)

  const [genreFilter, setGenreFilter] = useState('all genres')
  const [genreList, setGenreList] = useState(null)

  useEffect(() => {
    if (bookQuery.data) {
      setBooks(bookQuery.data.allBooks)
    }

    if (books) {
      // Set will disregard duplicates from being added
      const genres = new Set()
      books.forEach(book => {
        book.genres.forEach( g => genres.add(g) )
      })
      setGenreList(Array.from(genres))
    }
  }, [bookQuery, books])

  if (!props.show || !books) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre <b>{genreFilter}</b></p>
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
      <div>
        {genreList.map(g => 
          <button key={g} onClick={() => setGenreFilter(g)}>{g}</button>
        )}
        <button onClick={() => setGenreFilter('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {

    const userQuery = useQuery(ME)
    const [user, setUser] = useState(null)
    const bookQuery = useQuery(ALL_BOOKS)
    const [books, setBooks] = useState(null)

    useEffect(() => {
        if (userQuery.data) {
          setUser(userQuery.data.me)
        }

        if (bookQuery.data) {
            setBooks(bookQuery.data.allBooks)
        }
    }, [bookQuery, userQuery])

    if (!props.show || !books) {
        return null
    }
    
    return (
        <div>
          <h2>recommendations</h2>
          <p>books in your favorite genre <b>{user.favoriteGenre}</b></p>
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
              {books.filter(book => book.genres.includes(user.favoriteGenre)).map(a =>
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

export default Recommendations
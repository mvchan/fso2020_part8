import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {

    const [getUser, userQuery] = useLazyQuery(ME, { fetchPolicy: 'cache-and-network' })
    const [user, setUser] = useState(null)

    const [getRecommendations, bookQuery] = useLazyQuery(ALL_BOOKS, { fetchPolicy: 'cache-and-network' })
    const [recommendations, setRecommendations] = useState(null)

    // fetch the user when this view is being shown
    useEffect(() => {
        if (props.show)
            getUser()
    },[props.show])

    // fetch recommendations after user state has been set
    useEffect(() => {
        if (user)
            getRecommendations({ variables: { genre: user.favoriteGenre }})
    },[user, getRecommendations])

    // set the states if query data changes (e.g. fetched, cleared)
    useEffect(() => {
        if (userQuery.data)
            setUser(userQuery.data.me)
        
        if (bookQuery.data)
            setRecommendations(bookQuery.data.allBooks)
    }, [bookQuery.data, userQuery.data])

    if (!props.show || !user || !recommendations) {
        return null
    }
    
    return (
        <div>
          <h2>{recommendations.length} recommendations</h2>
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
              {recommendations.map(a =>
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
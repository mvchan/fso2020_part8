import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { LOGIN, ME } from '../queries'

const LoginForm = ({ setError, setToken, show, redirect }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
        //refetchQueries: [{ query: ME, fetchPolicy: 'network-only' }],
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        },
        //onCompleted: () => meQuery.refetch({fetchPolicy: 'network-first'})
        // update: (store, response) => {
        //     const dataInStore = store.readQuery({ query: ME })
        //     store.writeQuery({
        //       query: ME,     
        //       data: {
        //         ...dataInStore,
        //         me: { username: "manually_changed", favoriteGenre: "crime" }
        //       }
        //     })
        //   }
    })

    // save token to local storage if login is successful
    useEffect(() => {
        if ( result.data ) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('booklist-user-token', token)
            setUsername('')
            setPassword('')
            redirect('authors')
        }
    }, [result.data]) // eslint-disable-line
    
    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    if (!show) {
        return null
    }

    return (
        <div>
            <form onSubmit={submit}>
            <div>
                username <input
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm
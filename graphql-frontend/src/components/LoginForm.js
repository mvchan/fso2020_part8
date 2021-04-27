import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken, show, redirect }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login ] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        },
        onCompleted: (result) => {
            if (result.login) {
                // save token to local storage if login is successful
                const token = result.login.value
                localStorage.setItem('booklist-user-token', token)
                setToken(token)
                setUsername('')
                setPassword('')
                redirect('authors')
            }
        }
    })
    
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
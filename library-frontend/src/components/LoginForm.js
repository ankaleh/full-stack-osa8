import React/* , { useState, useEffect } */ from 'react'
/* import { gql, useMutation } from '@apollo/client' */

/* const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(
            username: $username,
            password: $password
        ){
            value
        }
    }
` */


const LoginForm = ({ token, setToken, setErrorMessage, show, handleLogin, username, setUsername, password, setPassword }) => {
    
  /* const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    
    const [login, result] = useMutation(LOGIN, {
        //refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS }],
        onError: (error) => {
          setErrorMessage(error.graphQLErrors[0].message)
        }
      })
    

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    
    }, [result.data]) // eslint-disable-line

    const handleLogin = async (event) => {
        event.preventDefault()
        //tehdään kysely:
        login({ variables: { username, password } })
    }
 */
    if (!show) {
        return null
      }

    return (
        <div>
          
          <h2>Log in!</h2>
    
          <form onSubmit={handleLogin}>
            <div>Username</div>
            <input type="text" value={username} name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
            <div>Password</div>
            <input type="text" value={password} name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
            <button type="submit" id='kirjaudu'>Login</button>
          </form>
    
        </div>
    
      )
    }

export default  LoginForm
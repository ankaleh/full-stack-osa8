
import React, { useState, useEffect  } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useMutation, gql/* , useLazyQuery, gql */ } from '@apollo/client'
import Recommendations from './components/Recommendations'


const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(
            username: $username,
            password: $password
        ){
            value
        }
    }
`
const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage , setErrorMessage] = useState(null)
  const [booksOfGenre, setBooksOfGenre] = useState(null)
  const [allBooks, setAllBooks] = useState(null)

  const client = useApolloClient()

  const [username, setUsername] = useState('')
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
        const token = localStorage.getItem('library-user-token')
        setToken(token)
    
    }, [result.data]) // eslint-disable-line

    const handleLogin = async (event) => {
        event.preventDefault()
        //tehdään kysely:
        login({ variables: { username, password } })
    }

  
  /* const [getUser, userResult] = useLazyQuery(USER)

  const handleRecommendedClick = (event) => {
    event.preventDefault()
    getUser()
    
  }

  useEffect(() => {
    if (userResult.data && token) {
        setBooksOfGenre(allBooks.filter(b => 
          b.genres.includes(userResult.data.me.favoriteGenre))
          )
    }
}, [userResult]) //eslint-disable-line

 */
const tok = () => console.log(token)

  if (!token) {
    tok()
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => {
            setPage('books')
            setBooksOfGenre(null)
            }}>books</button>
          <button onClick={()=> setPage('login')}>login</button>
          </div>

          <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'} token={token} booksOfGenre={booksOfGenre} setBooksOfGenre={setBooksOfGenre} allBooks={allBooks} setAllBooks={setAllBooks}
      />
      <LoginForm show={page==='login'} token={token} setToken={setToken} errorMessage={errorMessage} setErrorMessage={setErrorMessage} handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>  
      </div>
    )
  }
  return (
    
    <div>
      {tok()}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => {
          setPage('books')
          setBooksOfGenre(null)
          }}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>Books of your favorite genre</button>
        <button onClick={() => {
          setToken(null)
          localStorage.clear()
          client.resetStore()
        }}>logout</button>
      </div>

      <Authors
        show={page === 'authors'} token={token} setToken={setToken}
      />

      <Books
        show={page === 'books'} token={token} booksOfGenre={booksOfGenre} setBooksOfGenre={setBooksOfGenre} allBooks={allBooks} setAllBooks={setAllBooks}
      />

      <NewBook
        show={page === 'add'} errorMessage={errorMessage} setErrorMessage={setErrorMessage} 
      />

      <Recommendations show={page === 'recommendations'} allBooks={allBooks} token={token} booksOfGenre={booksOfGenre} setBooksOfGenre={setBooksOfGenre} setAllBooks={setAllBooks} />
      
    </div>
  )
}

export default App
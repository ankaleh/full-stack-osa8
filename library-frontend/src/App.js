
import React, { useState/* , useEffect */ } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

import { useApolloClient/* , useLazyQuery, gql */ } from '@apollo/client'
import Recommendations from './components/Recommendations'

/* const USER = gql`
  query {
    me {
      favoriteGenre
    }
  }
` */
const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage , setErrorMessage] = useState(null)
  const [booksOfGenre, setBooksOfGenre] = useState(null)
  const [allBooks, setAllBooks] = useState(null)

  const client = useApolloClient()

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
  if (!token) {
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
      <LoginForm show={page==='login'} token={token} setToken={setToken} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      </div>
    )
  }
  return (
    <div>
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

import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage , setErrorMessage] = useState(null)
  const [booksOfGenre, setBooksOfGenre] = useState(null)

  const client = useApolloClient()
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
        show={page === 'books'} booksOfGenre={booksOfGenre} setBooksOfGenre={setBooksOfGenre}
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
        show={page === 'books'} booksOfGenre={booksOfGenre} setBooksOfGenre={setBooksOfGenre}
      />

      <NewBook
        show={page === 'add'} errorMessage={errorMessage} setErrorMessage={setErrorMessage}
      />

    </div>
  )
}

export default App
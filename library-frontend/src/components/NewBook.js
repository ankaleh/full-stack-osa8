import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import Error from './Error'
//import { ALL_BOOKS } from './Books'?????

const CREATE_BOOK = gql`
mutation addBook($title: String, $author: String, $published: Int, $genres: [String]) {
  addBook(
    title: $title,
    author: $author
    published: $published,
    genres: $genres
  ) {
    title

  }
}
`
const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      
      published
    }
  }
`
const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      props.setErrorMessage(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    console.log('add book...')

    createBook({ variables: { title, author, published, genres } }) 

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add book</h2>
      <Error errorMessage={props.errorMessage} />
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
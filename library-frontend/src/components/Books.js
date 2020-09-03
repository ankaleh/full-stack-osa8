import React, { useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
const BOOKS_OF_GENRE = gql`
query allbooks($genre: String){
  allBooks(genre: $genre) {
    title
    author {
      name
    }
    published
    genres
  }
}
`
const Books = ({token, show, booksOfGenre, setBooksOfGenre, allBooks, setAllBooks}) => {

  //const [booksOfGenre, setBooksOfGenre] = useState(null)
  const [buttonsTexts, setButtonsTexts] = useState([])

  const result = useQuery(ALL_BOOKS)
  const [getBooks, booksResult] = useLazyQuery(BOOKS_OF_GENRE)

  //const [getUser, userResult] = useLazyQuery(USER)

  /* const handleClick = (event) => {
    event.preventDefault()
    const text = event.target.value
    setBooksOfGenre(result.data.allBooks.filter(b => 
    b.genres.includes(text)))
    
    //console.log(buttonsTexts)
  } */

  const handleClick = (event) => {
    event.preventDefault()
    const text = event.target.value
    getBooks({ variables: { genre: text } })
    /* if (booksResult.data) { //booksResult.data on edellisen klikkauksen lähettämä data 
      setBooksOfGenre(booksResult.data.allBooks)//genrehaun kirjat tähän
    } */
  }

  /* const handleRecommendedClick = (event) => {
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


  useEffect(() => {
    if (result.data) {
      setAllBooks(result.data.allBooks)
      let genres = []
      const arraysOfGenres = result.data.allBooks.map(book => 
        book.genres//book.genres.map(g => console.log(g))
      )
      arraysOfGenres.map(array => array.forEach(g => genres.push(g)))
      const reducedGenres = 
      genres.reduce((atStart, genre) => {
        
        if (!atStart.includes(genre)) {
          return atStart.concat(genre)
        }
        return atStart
      }, [])
      //console.log(reducedGenres)
      setButtonsTexts(reducedGenres)
    }
}, [result.data]) //eslint-disable-line

useEffect(() => {
  if (booksResult.data) {
      setBooksOfGenre(booksResult.data.allBooks) //tähän genrekyselyn tulos
  }  //tämä suoritetaan, kun booksResult-olio muuttuu (ei saa olla booksResult.data!)?:
}, [booksResult]) //eslint-disable-line 



  if (!show) {
    return null
  }

  if (result.loading || booksResult.loading) {
    return <div>Tietoja haetaan...</div>
  }

  if (booksOfGenre) {
      return <table>
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
        {booksOfGenre.map(b =>
          <tr key={b.title}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
          </tr>
        )}
      </tbody>
    </table>
  } 
  
  return (
    <div>
      
      <h2>books</h2>

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
          {result.data.allBooks.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {buttonsTexts.map(text =>
          <button onClick={handleClick} value={text} key={text}>{text}</button>
      )}
          {/* <button value={'refactoring'} onClick={handleClick}>Refactoring</button> */}
    </div>
    
  )
}

export default Books
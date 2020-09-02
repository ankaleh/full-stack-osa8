import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'

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
const Books = ({show, booksOfGenre, setBooksOfGenre}) => {

  //const [booksOfGenre, setBooksOfGenre] = useState(null)
  const [buttonsTexts, setButtonsTexts] = useState([])

  const result = useQuery(ALL_BOOKS)
  //console.log(result)


  const handleClick = (event) => {
    event.preventDefault()
    const text = event.target.value
    setBooksOfGenre(result.data.allBooks.filter(b => 
    b.genres.includes(text)))
    
    //console.log(buttonsTexts)
  }

  useEffect(() => {
    if (result.data) {
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

  if (!show) {
    return null
  }

  if (result.loading) {
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
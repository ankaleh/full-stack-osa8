import React, { useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'

const USER = gql`
  query {
    me {
      favoriteGenre
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

const Recommendations = ({ show, booksOfGenre, setBooksOfGenre, token, allBooks }) => {
    
    
    const userResult = useQuery(USER)
    const [getBooks, booksResult] = useLazyQuery(BOOKS_OF_GENRE)

    const [booksOfFavoriteGenre, setBooksOfFavoriteGenre] = useState(null)
  
    /* useEffect(() => {
      if (userResult.data && token) {
          
          setBooksOfFavoriteGenre(allBooks.filter(b => 
            b.genres.includes(userResult.data.me.favoriteGenre))
            )
      }
  }, [userResult.data]) //eslint-disable-line */
  

  useEffect(() => {
    if (userResult.data && token) {
        console.log(userResult.data.me.favoriteGenre)
        
        getBooks({ variables: { genre: userResult.data.me.favoriteGenre } })
    }

}, [userResult.data]) //eslint-disable-line

useEffect(() => {
    if (booksResult.data) {
        setBooksOfFavoriteGenre(booksResult.data.allBooks) //tähän genrekyselyn tulos
    }  
}, [booksResult.data])
  
  if (!show) {
    return null
  }

  if (userResult.loading || booksResult.loading) {
    return <div>Tietoja haetaan...</div>
  }

    return (
        <div>
            <h2>Recommendations for you, based on your favorite genre</h2>
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
          {booksOfFavoriteGenre.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
        </div>


    )

}

export default Recommendations
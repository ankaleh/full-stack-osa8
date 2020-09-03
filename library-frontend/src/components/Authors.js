  
import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import Error from './Error'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
const EDIT_AUTHOR = gql`
mutation editAuthor($name: String, $setBornTo: Int) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}
`

const Authors = (props) => {
  //const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [errorMessage , setErrorMessage] = useState(null)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    }
  })
  const result = useQuery(ALL_AUTHORS)
  

  const handleSubmit = (event) => {
    event.preventDefault()
    //console.log(selectedOption.value)
    /* setName(selectedOption.value) */
    /* console.log(name) */
    if (selectedOption) {
      editAuthor({ variables: {name: selectedOption.value, setBornTo: birthday} })
    } else {
      setErrorMessage('You have to choose author!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
    //setName('')
    setBirthday('')
  }

  if (!props.show) {
    return null
  }
  
  
  if (result.loading) {
    return <div>Tietoja haetaan...</div>
  }

  const authorsNames = result.data.allAuthors.map(a => a.name)
  const options = authorsNames.map(name => ({ value: name, label: name }))
  
if (props.token) {
  return (
    
    <div>
      <Error errorMessage={errorMessage}/>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}

        </tbody>
      </table>
      <h2>Set birthday</h2>
      <form onSubmit={handleSubmit}>
        <Select defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        {/* <input value={name} onChange={ ({target}) => {setName(target.value)} }/> */}
        <input value={birthday} onChange={ ({target}) => {setBirthday(Number(target.value))} }/>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}
return (
    
  <div>
    <h2>authors</h2>
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>
            born
          </th>
          <th>
            books
          </th>
        </tr>
        {result.data.allAuthors.map(a =>
          <tr key={a.name}>
            <td>{a.name}</td>
            <td>{a.born}</td>
            <td>{a.bookCount}</td>
          </tr>
        )}

      </tbody>
    </table>
  </div>
)
}

export default Authors

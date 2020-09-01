import React from 'react'

const Error = ({ errorMessage }) => {
    const errorMessageStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    
    if (!errorMessage) {
        return null
    }
    return (
        <div style={errorMessageStyle}>
          {errorMessage}
        </div>
    
    )
}
    
    export default Error
    


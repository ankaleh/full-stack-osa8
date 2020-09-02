const mongoose = require('mongoose')

const userSchema = mongoose.Schema( {
    username: { type: String, unique: true, required: true, minlength: 3 },
    password: String,
    favoriteGenre: String
  })

  module.exports = mongoose.model('User', userSchema)
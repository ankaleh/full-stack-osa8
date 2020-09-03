const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
require('dotenv').config()
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

//yhdistetään tietokantan:
const mongoUrl = process.env.MONGODB_URI
const secret = process.env.SECRET
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('Yhditetty MOngoDB:hen.')
  })
  .catch((error) => {
    console.log('Virhe yhdistettäessä MongoDB:hen: ', error.message)
  })


const typeDefs = gql`
  type Author {
      name: String,
      born: Int,
      bookCount: Int,
      id: ID!
  }
  type Book {
    title: String!,
    author: Author!,
    published: Int!,
    genres: [String!]!,
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  
  type Query {
      bookCount: Int,
      authorCount: Int,
      allBooks(author: String, genre: String): [Book],
      allAuthors: [Author],
      me: User  
  }

  type Mutation {
      addBook(
        title: String,
        author: String,
        published: Int,
        genres: [String],
      ): Book
      editAuthor(
          name: String,
          setBornTo: Int,
      ): Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
  }
`

const resolvers = {
  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args, context) => {
        if (args.author && args.genre) {
            //return books.filter(book => book.author===args.author && book.genres.includes(args.genre))
        }
        if (args.author) {
            //return Book.find({ author: { $in:  } })
        }
        if (args.genre) {
            return Book.find({ genres: { $in: [ args.genre ] } })
        }
        const books = await Book.find({})
        //console.log(books)
        //console.log('allBooks: ', context.currentUser)
        return books
      },
      allAuthors: (root, args) => {
          //console.log(currentUser)
          return Author.find({})
      },
      me: (root, args, { currentUser }) => {
          //console.log('me: ', currentUser)
          return currentUser
      },
    },

  Author: {
      bookCount: async (root) => {
        const author = await Author.findOne({ name: root.name })
        //console.log(author)
        return Book.find({ author: author }).countDocuments()
        
    }
  },
  Book: {
      author: async (root) => {
          const author = await Author.findById(root.author)
          console.log(author.name)
          return author
      }
  },

    Mutation: {
      addBook: async (root, args, { currentUser }) => { 
        console.log('addBook: ', currentUser) 
        if (!currentUser) {
            throw new AuthenticationError('Not authenticated!)')
        }
          const mongoAuthor = await Author.findOne({ name: args.author })
          
          if (!mongoAuthor) {
            const newAuthor = new Author({ name: args.author })
            const book = new Book({ ...args, author: newAuthor })
            try {
                await newAuthor.save()
                await book.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return book
          } 

          const book = new Book({ ...args, author: mongoAuthor })
          try {
              await book.save()
          } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        }
        return book
      },

      editAuthor: async (root, args, { currentUser }) => { //{ currentUser } on context.currentUser destrukturoidussa muodossa
         
      if (!currentUser) {
              throw new AuthenticationError('Not authenticated!')
          }
         const mongoAuthor = await Author.findOne({ name: args.name })
         console.log(mongoAuthor)
         console.log(args.setBornTo)

         mongoAuthor.born = args.setBornTo

         try {
            await mongoAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
              invalidArgs: args,
          })
        }
         return mongoAuthor
      },

      createUser: async (root, args) => {
          const newUser = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
          try {
            await newUser.save()
          } catch (error) {
          throw new UserInputError(error.message, {
              invalidArgs: args,
          })
        }
        return newUser
      },


      login: async (root, args) => {
          const userLoggingIn = await User.findOne({ username: args.username })
          if ( !userLoggingIn && args.password !== 'salasana' ) {
              throw new UserInputError("Wrong credentials!")
          }
          console.log('login: ', userLoggingIn.username, userLoggingIn._id)
          const userForToken = { username: userLoggingIn.username, id: userLoggingIn._id }

          return {value: jwt.sign(userForToken, secret) } //palautetaan skeemassa määritetyn Token-tyypin kenttä value
      }
    }
}

//olioon server lisätään kolmas parametri, context, konstruktorikutsussa:
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
      // authiin asetetaan pyynnön Authorization-otsakkeen tiedot eli token,
      //ja jos headerina ei tule validia tokenia, kysely vastaa "null":
      const auth = req ? req.headers.authorization : null 
      //console.log(req.headers.authorization)
      if (auth && auth.toLowerCase().startsWith('bearer')) {
        const decodedToken = jwt.verify(auth.substring(7), secret)
        //console.log(decodedToken)
        const currentUser = await User.findById(decodedToken.id)
        //console.log(decodedToken.id)
        return { currentUser } //contextin kentäksi
      }
      
    }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
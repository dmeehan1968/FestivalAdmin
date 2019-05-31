import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

const rootValue = { hello: () => 'Hello World!' }

export default [
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
]

import { GraphQLSchema } from 'graphql'
import sequelizeGraphQLSchema from 'sequelize-graphql-schema'
import { ApolloServer } from 'apollo-server-express'

const options = {

}

const { generateSchema } = sequelizeGraphQLSchema(options)

export default app => {
  try {
    const models = app.get('models')
    const schema = generateSchema(models)
    const server = new ApolloServer({
      schema: new GraphQLSchema(schema),
      context: ({ req }) => ({ user: req.user })
    })
    server.applyMiddleware({ app })
    return [ (req, res, next) => next() ]

  } catch(err) {
    console.log(err.stack);
    throw err
  }
}

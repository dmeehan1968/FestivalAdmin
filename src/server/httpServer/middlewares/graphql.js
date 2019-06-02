import graphqlHTTP from 'express-graphql'
import { GraphQLSchema } from 'graphql'
import sequelizeGraphQLSchema from 'sequelize-graphql-schema'

const options = {

}
const { generateSchema } = sequelizeGraphQLSchema(options)

export default app => {
  try {
    const models = app.get('models')
    const schema = generateSchema(models)
    return [
      '/graphql',
      graphqlHTTP({
        schema: new GraphQLSchema(schema),
        graphiql: true,
      })
    ]
  } catch(err) {
    console.log(err.stack);
    throw err
  }
}

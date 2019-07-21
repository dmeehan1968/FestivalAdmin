import { Given, When, Then } from 'cucumber'
import expect from 'expect'

Then('the GraphQL {word} type has fields:', function (type, data) {
  const typedef = this.model.graphql.types[type]
  expect(typedef).toEqual(data.hashes().reduce((acc, row) => {
    return { ...acc, [row.field]: row.type }
  }, {}))
})

Then('the GraphQL {word} mutation accepts {word} and returns {word}', function(name, input, output) {
  const mutation = this.model.graphql.mutations[name]
  expect(mutation.input).toEqual(input)
  expect(mutation.output).toEqual(output)
})

Then('the GraphQL excludes mutations:', function (data) {
  expect(this.model.graphql.excludeMutations).toEqual(data.raw().reduce((acc, row) => ([ ...acc, row[0]]), []))
})

Then('the GraphQL excludes queries:', function (data) {
  expect(this.model.graphql.excludeQueries).toEqual(data.raw().reduce((acc, row) => ([ ...acc, row[0]]), []))
})

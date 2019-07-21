import { Given, When, Then } from 'cucumber'
import expect from 'expect'
import sinon from 'sinon'

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

Then('the GraphQL {word} mutation resolver calls model {word}', function (name, method, text) {
  const options = JSON.parse(text)
  const resolver = this.model.graphql.mutations[name].resolver
  const mock = sinon.mock(this.model)
  mock.expects(method).once().withExactArgs(...options.method_args)
  resolver(...options.resolver_args)
  mock.verify()
})

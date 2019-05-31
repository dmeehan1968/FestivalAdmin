import httpServer from './httpServer'
import express from 'express'

jest.resetModules()
jest.mock('express')

describe("server", () => {

  describe("port", () => {

    it("listens on port 8000 as default", () => {
      expect.assertions(1)
      return httpServer().then(() => {
        const app = express.mock.results.slice(-1)[0].value
        expect(app.listen).toHaveBeenCalledWith(8000, expect.any(Function))
      })
    });

    it("listens on options port", () => {
      expect.assertions(1)
      return httpServer({ port: 8888 }).then(() => {
        const app = express.mock.results.slice(-1)[0].value
        expect(app.listen).toHaveBeenCalledWith(8888, expect.any(Function))
      })
    });

  });

  describe("graphql", () => {

    it("loads graphqlHTTP", () => {
      expect.assertions(1)
      return httpServer().then(() => {
        const app = express.mock.results.slice(-1)[0].value
        const graphqlMiddlewareMatcher = {
          asymmetricMatch: actual => {
            return (
              typeof actual === 'function'
              && actual.name === 'graphqlMiddleware'
            )
          },
        }
        expect(app.use).toHaveBeenCalledWith('/graphql', graphqlMiddlewareMatcher)
      })
    });
  });
});

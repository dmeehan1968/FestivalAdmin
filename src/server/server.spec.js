import { Express } from 'jest-express/lib/express'
import server from './server'

jest.mock('express', () => require('jest-express'))

describe("server", () => {

  let app
  let originalPort = process.env.PORT

  beforeEach(() => {
    app = new Express()
    if (process.env.PORT) {
      delete process.env.PORT
    }
  });

  afterEach(() => {
    app.resetMocked()
    if (originalPort) {
      process.env.PORT = originalPort
    }
  });

  describe("port", () => {

    it("listens on port 8000 as default", () => {
      server(app)
      expect(app.listen).toHaveBeenCalledWith(8000, expect.any(Function))
    });

    it("listens on env port", () => {
      process.env.PORT = 8888
      server(app)
      expect(app.listen).toHaveBeenCalledWith(8888, expect.any(Function))
    });

    it("listens on options port", () => {
      server(app, { port: 8888 })
      expect(app.listen).toHaveBeenCalledWith(8888, expect.any(Function))
    });

  });
});

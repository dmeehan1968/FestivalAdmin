const mockServer = jest.fn(() => Promise.resolve({}))
jest.mock('./httpServer', () => mockServer)

const mockConsole = () => {
  const originalConsole = Object.assign({}, global.console)
  global.console = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
  return () => {
    global.console = Object.assign({}, originalConsole)
  }
}

const preserveObjectKey = (obj, key) => {
  const original = obj[key]
  delete obj[key]
  return () => {
    obj[key] = original
  }
}

describe("index", () => {

  let port
  let server
  let bootstrap
  let restoreConsole
  let restoreObjectKey

  afterAll(() => {
    jest.resetModules()
  });

  beforeEach(() => {
    restoreConsole = mockConsole()
    restoreObjectKey = preserveObjectKey(process.env, 'PORT')
    server = require('./httpServer')
    server.mockClear()
    bootstrap = require('./index').bootstrap
  });

  afterEach(() => {
    restoreConsole()
    restoreObjectKey()
  });

  it("passes process.env.PORT undefined", () => {
    delete process.env.PORT
    bootstrap()
    expect(server.mock.calls[0][0].port).toBeUndefined()
  });

  it("passes process.env.PORT", () => {
    process.env.PORT = 8888
    bootstrap()
    expect(server.mock.calls[0][0].port).toBe(8888)
  });
});

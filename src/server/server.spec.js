const mockDatabase = jest.fn(() => Promise.resolve({}))
jest.mock('./database', () => mockDatabase)
const mockServer = jest.fn(() => Promise.resolve({}))
jest.mock('./httpServer', () => mockServer)
jest.mock('dotenv')

const saveProcessEnv = () => {
  const env = { ...process.env }
  return () => {
    Object.keys(process.env).forEach(key => delete process.env[key])
    Object.keys(env).forEach(key => process.env[key] = env[key])
  }
}

describe("server", () => {

  const server = require('./server').default
  let restoreProcessEnv

  afterAll(() => {
    jest.resetModules()
  });

  beforeEach(() => {
    restoreProcessEnv = saveProcessEnv()
    mockDatabase.mockClear()
    mockServer.mockClear()
  });

  afterEach(() => {
    restoreProcessEnv && restoreProcessEnv()
  });

  describe("database args", () => {

    it("calls database with expected process.env", () => {
      const expected = {
        host: 'testhost',
        schema: 'testschema',
        user: 'testuser',
        password: 'testpassword',
        timezone: 'testtimezone',
        dialect: 'testdialect',
        logging: expect.any(Boolean)
      }
      process.env = {
        ...process.env,
        DB_HOST: expected.host,
        DB_SCHEMA: expected.schema,
        DB_USER: expected.user,
        DB_PASSWORD: expected.password,
        DB_TIMEZONE: expected.timezone,
        DB_DIALECT: expected.dialect,
      }
      server()
      expect(mockDatabase).toHaveBeenCalledTimes(1)
      expect(mockDatabase.mock.calls[0].length).toEqual(1)
      expect(mockDatabase.mock.calls[0][0]).toEqual(expected)
    });

  });

  describe("httpServer args", () => {

    it("passes process.env.PORT undefined", () => {
      delete process.env.PORT
      expect.assertions(2)
      return server().then(() => {
        expect(mockServer).toHaveBeenCalledTimes(1)
        expect(mockServer.mock.calls[0][0].port).toBeUndefined()
      })
    });

    it("passes process.env.PORT", () => {
      process.env.PORT = 8888
      expect.assertions(2)
      return server().then(() => {
        expect(mockServer).toHaveBeenCalledTimes(1)
        expect(mockServer.mock.calls[0][0].port).toBe(8888)
      })
    });

  });

});

const express = jest.fn(() => {
  return {
    listen: jest.fn((port, callback) => {
      process.nextTick(callback)
      return {
        address() {
          return {
            port
          }
        }
      }
    }),
    use: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  }
})

export default express

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
  }
})

export default express

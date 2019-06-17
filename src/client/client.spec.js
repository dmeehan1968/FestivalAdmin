import { client } from './index'
import { shallow } from 'enzyme'

jest.mock('react-dom')
jest.mock('console')

import ReactDOM from 'react-dom'

describe('client', () => {

  let wrapper
  let restoreConsole
  const mockConsole = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  beforeEach(() => {
    client({ console: mockConsole })
  })

  describe('root content', () => {
    beforeEach(() => {
      wrapper = shallow(ReactDOM.hydrate.mock.calls[0][0])
    })

    it('uses React Router', () => {
      expect(wrapper.find('Router')).toHaveLength(1)
    })

    it('uses AdminApp', () => {
      expect(wrapper.find('AdminAppProvider')).toHaveLength(1)
    })

  })

  describe('document', () => {

    let getElementById

    beforeEach(() => {
      getElementById = jest.fn()
      client({
        document: {
          getElementById,
        },
        console: mockConsole,
      })
    })

    it('gets the root element from document', () => {
      expect(getElementById).toHaveBeenCalledWith('root')
    })
  })

  describe('with hot module reloading', () => {

    let accept

    beforeEach(() => {
      accept = jest.fn()
      client({
        module: {
          hot: {
            accept
          }
        },
        console: mockConsole,
      })
    })

    it('accepts hot modules', () => {
      expect(accept).toHaveBeenCalledTimes(1)
    })
  })

  describe('without hot module reloading', () => {

    beforeEach(() => {
    })

    it('accepts hot modules', () => {
      expect(() => {
        client({
          module: {},
          console: mockConsole,
        })
      }).not.toThrow()
    })
  })

})

import React from 'react'

import { AdminApp } from './index'
import { shallow } from 'enzyme'

describe('AdminApp', () => {

  let wrapper

  describe('without events', () => {

    beforeEach(() => {
      wrapper = shallow(<AdminApp />)
    })

    it('renders Event title', () => {
      expect(wrapper.find('h1').text()).toBe('Events')
    })

    it('renders No Events text', () => {
      expect(wrapper.text()).toMatch(/No Events/)
    })

    it('does not render lists', () => {
      expect(wrapper.find('ul')).toHaveLength(0)
    })

    it('does not render list items', () => {
      expect(wrapper.find('li')).toHaveLength(0)
    })

  })

})

const dummyEvents = [
  {
    id: 1,
    title: 'my first event',
    contacts: [
      {
        id: 1,
        firstName: 'Joe',
        lastName: 'Blow',
      }
    ]
  },
  {
    id: 2,
    title: 'my second event',
    contacts: [
      {
        id: 2,
        firstName: 'Betty',
        lastName: 'Boop',
      }
    ]
  },
]

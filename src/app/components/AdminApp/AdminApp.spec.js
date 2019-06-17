import React from 'react'

import { AdminApp } from './index'
import { shallow } from 'enzyme'

describe('AdminApp', () => {

  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AdminApp />)
  })

  it('renders Event title', () => {
    expect(wrapper.find('h1').text()).toBe('Events')
  })

  it('renders the event list', () => {
    expect(wrapper.find('Apollo(EventList)')).toHaveLength(1)
  })

  it('renders the event add form', () => {
    expect(wrapper.find('Apollo(EventAddForm)')).toHaveLength(1)
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

import React from 'react'

import { useQuery, useMutation } from 'react-apollo-hooks'

import { AdminApp } from './index'
import { shallow } from 'enzyme'

jest.mock('react-apollo-hooks')

describe('AdminApp', () => {

  let wrapper
  const queryResult = {
    loading: false,
    error: undefined,
    data: {
      events: [
        { id: 1, title: 'my first event' },
        { id: 2, title: 'my second event' },
      ]
    }
  }
  let eventAdd

  beforeEach(() => {
    useQuery.mockImplementation(() => queryResult)
    eventAdd = jest.fn()
    useMutation.mockImplementation(() => eventAdd)
    wrapper = shallow(<AdminApp />)
  })

  it('renders Event heading', () => {
    expect(wrapper.find('h1').text()).toBe('Events')
  })

  describe('event list', () => {

    let eventList

    beforeEach(() => {
      eventList = wrapper.find('EventList')
    })

    it('exists', () => {
      expect(eventList).toHaveLength(1)
    })

    it('receives props', () => {
      const { loading, error, events } = eventList.props()

      expect({ loading, error, data: { events }}).toEqual(queryResult)
    })

  })

  describe('event add form', () => {

    let eventAddForm

    beforeEach(() => {
      eventAddForm = wrapper.find('EventAddForm')
    })

    it('exists', () => {
      expect(eventAddForm).toHaveLength(1)
    })

    it('receives props', () => {
      const { eventAdd: eventAddProperty } = eventAddForm.props()
      const expected = { title: 'my added event' }
      eventAddProperty(expected)
      expect(eventAdd).toHaveBeenCalledWith({ variables: { event: expected }})
    })
  })

})

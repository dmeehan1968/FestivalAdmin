import React from 'react'
import { shallow } from 'enzyme'

import { useQuery } from 'react-apollo-hooks'

import EventList from './index'
import eventsQuery from 'app/graphql/eventsQuery'

jest.mock('react-apollo-hooks')

describe('EventList', () => {

  let wrapper

  beforeEach(() => {
    useQuery.mockReset()
  })

  describe('query', () => {

    it('uses eventsQuery', () => {
      wrapper = shallow(<EventList />)
      expect(useQuery).toHaveBeenCalledWith(eventsQuery)
    })
  })

  describe('loading', () => {

    beforeEach(() => {
      useQuery.mockImplementation(() => ({ loading: true, data: {events: []} }))
      wrapper = shallow(<EventList />)
    })

    it('shows loading', () => {
      expect(wrapper.text()).toMatch(/Loading\.{3}/);
    })

  })

  describe('error', () => {

    beforeEach(() => {
      useQuery.mockImplementation(() => ({ error: { message: 'Arrgh!' } }))
      wrapper = shallow(<EventList />)
    })

    it('shows error', () => {
      expect(wrapper.text()).toMatch(/Error/);
    })

  })

  describe('No data', () => {

    beforeEach(() => {
      useQuery.mockImplementation(() => ({ loading: false, data: {events: []} }))
      wrapper = shallow(<EventList />)
    })

    it('shows no events', () => {
      expect(wrapper.text()).toMatch(/No Events/)
    })

  })

  describe('events', () => {

    const events = [
      {
        id: 1,
        title: 'My first event',
      },
      {
        id: 2,
        title: 'My second event',
      },
    ]

    beforeEach(() => {
      useQuery.mockImplementation(() => ({ data: { events } }))
      wrapper = shallow(<EventList />)
    })

    it('shows expected events', () => {
      const nodes = wrapper.find('Event')
      expect(nodes).toHaveLength(events.length)
      nodes.forEach((node, index) => {
        expect(node.props().event).toEqual(events[index])
      })
    })

  })

})

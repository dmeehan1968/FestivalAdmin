import React from 'react'
import { shallow } from 'enzyme'

import EventList from './index'

describe('EventList', () => {

  let wrapper

  describe('loading', () => {

    beforeEach(() => {
      wrapper = shallow(<EventList loading={true} />)
    })

    it('shows loading', () => {
      expect(wrapper.text()).toMatch(/Loading\.{3}/);
    })

  })

  describe('error', () => {

    beforeEach(() => {
      wrapper = shallow(<EventList error={{ message: 'Arrgh!' }} />)
    })

    it('shows error', () => {
      expect(wrapper.text()).toMatch(/Error/);
    })

  })

  describe('No data', () => {

    beforeEach(() => {
      wrapper = shallow(<EventList events={[]}/>)
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
      wrapper = shallow(<EventList events={events} />)
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

import React from 'react'

import { AdminApp } from './index'
import { shallow } from 'enzyme'

describe('AdminApp', () => {

  it('renders Event title', () => {
    const wrapper = shallow(<AdminApp />)
    expect(wrapper.find('h1').text()).toBe('Events')
  })

})

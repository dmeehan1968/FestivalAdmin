import React from 'react'

import { AdminApp } from './index'
import { shallow } from 'enzyme'

describe('AdminApp', () => {

  it('renders Hello World', () => {
    const wrapper = shallow(<AdminApp />)
    expect(wrapper.text()).toBe('Hello World')
  })

})

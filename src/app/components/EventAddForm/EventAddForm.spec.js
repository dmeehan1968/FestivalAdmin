import React from 'react'
import { shallow } from 'enzyme'
import EventAddForm from './index'

describe('EventAddForm', () => {

  let sut
  let eventAdd
  
  beforeEach(() => {
    eventAdd = jest.fn()
    sut = shallow(<EventAddForm eventAdd={eventAdd} />)
  })

  it('form submission invokes action', () => {

    const expected = 'My First Event Title'
    const preventDefault = jest.fn()
    sut
      .find('input[type="text"]')
      .simulate('change', { target: { value: expected }})

    sut
      .find('form')
      .simulate('submit', { preventDefault })

    expect(eventAdd).toHaveBeenCalledWith({ title: expected })
    expect(preventDefault).toHaveBeenCalled()

  })
})

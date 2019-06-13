import React from 'react'
import { shallow } from 'enzyme'
import withStaticRouter from './index'

describe('withStaticRouter', () => {

  let wrapper
  let WrappedComponent
  const NoOpComponent = () => null

  beforeEach(() => {
    WrappedComponent = withStaticRouter(NoOpComponent)
    wrapper = shallow(<WrappedComponent location='/' context={{}} otherProp={true}/>)
  })

  it('has StaticRouter wrapper', () => {
    expect(wrapper.at(0).name()).toEqual('StaticRouter')
  })

  it('has passed location prop', () => {
    expect(wrapper.props().location).toEqual('/')
  })

  it('has passed context prop', () => {
    expect(wrapper.props().context).toEqual({})
  })

  it('passes other props to wrapped component', () => {
    expect(wrapper.find('NoOpComponent').props().otherProp).toBeTruthy()
  })
})

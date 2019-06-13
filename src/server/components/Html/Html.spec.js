import React from 'react'
import { shallow } from 'enzyme'
import Html from './index'

describe('Html', () => {

  let wrapper

  describe('defaults', () => {

    beforeEach(() => {
      wrapper = shallow(<Html />)
    })

    it('renders html node', () => {
      expect(wrapper.find('html')).toHaveLength(1)
    })

    it('renders head node', () => {
      expect(wrapper.find('head')).toHaveLength(1)
    })

    it('renders body node', () => {
      expect(wrapper.find('body')).toHaveLength(1)
    })

    it('renders react root', () => {
      expect(wrapper.find('#root')).toHaveLength(1)
    })

    it('does not render styles', () => {
      expect(wrapper.find('link')).toHaveLength(0)
      expect(wrapper.find('style')).toHaveLength(0)
    })

    it('does not render scripts', () => {
      expect(wrapper.find('script')).toHaveLength(0)
    })

  })

  describe('with css filenames as string', () => {

    const expected = ['1.css', '2.css']
    let links

    beforeEach(() => {
      wrapper = shallow(<Html styles={expected} />)
      links = wrapper.find('link')
    })

    it('has the expected number of links', () => {
      expect(links).toHaveLength(expected.length)
    })

    it('has text/css type', () => {
      expect(links.everyWhere(n => n.props().type === 'text/css')).toBe(true)
    })

    it('has stylesheet rel', () => {
      expect(links.everyWhere(n => n.props().rel === 'stylesheet')).toBe(true)
    })

    it('has expected href', () => {
      expect.assertions(expected.length)
      for (let i=0 ; i < expected.length ; i++) {
        const link = links.at(i)
        expect(link.props().href).toBe(expected[i])
      }
    })

  })

  describe('with style elements', () => {

    const expected = [
      <style key={1}>{`body { color: white; }`}</style>,
      <style key={2}>{`body { color: black; }`}</style>,
    ]
    let styles

    beforeEach(() => {
      wrapper = shallow(<Html styles={expected} />)
      styles = wrapper.find('style')
    })

    it('has the expected number of styles', () => {
      expect(styles).toHaveLength(expected.length)
    })

    it('has styles matching input', () => {
      expect.assertions(expected.length)
      for (let i=0 ; i < expected.length ; i++) {
        const style = styles.at(i)
        expect(style.equals(expected[i])).toBeTruthy()
      }
    })
  })

  describe('with scripts', () => {

    const expected = [
      <script key={1} type="text/javascript" src="1.js" />,
      <script key={2} type="text/javascript" src="2.js" />,
    ]
    let scripts

    beforeEach(() => {
      wrapper = shallow(<Html scripts={expected} />)
      scripts = wrapper.find('script')
    })

    it('has the expected number of scripts', () => {
      expect(scripts).toHaveLength(expected.length)
    })

    it('has scripts matching input', () => {
      expect.assertions(expected.length)
      for (let i=0 ; i < expected.length; i++) {
        const script = scripts.at(i)
        expect(script.equals(expected[i])).toBeTruthy()
      }
    })
  })

  describe('with children', () => {

    const expected = <div><h1>Hello World</h1></div>

    beforeEach(() => {
      wrapper = shallow(<Html>{expected}</Html>)
    })

    it('has expected root children', () => {
      expect(wrapper.find('#root').childAt(0).equals(expected)).toBeTruthy()
    })

  })
  
})

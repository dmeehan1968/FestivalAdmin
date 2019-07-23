import React from 'react'
import { Given, When, Then, Before, After } from 'cucumber'
import expect from 'expect'
import { mount } from 'enzyme'
import Auth from 'app/components/Auth'
import withJSDOM from '../utils/withJSDOM'
import sinon from 'sinon'

Before(function() {
  this.restoreJSDOM = withJSDOM()
})

After(function() {
  this.restoreJSDOM()
})

Given('the authentication form', function () {
  this.handleSubmit = sinon.mock({ handleSubmit: () => {} })
  this.sut = mount(<Auth handleSubmit={this.handleSubmit} canSubmit={true} />)
})

When('the {word} field contains "{}"', function(id, text) {
  const field = this.sut.find(`input[name="${id}"]`).first()
  expect(field).toBeDefined()
  field.simulate('change', { target: { name: id, value: text } })
  this.fields = {
    ...this.fields,
    [id]: text,
  }
})

When('the submit button is clicked', function() {
  const button = this.sut.find(`button[type="submit"]`).first()
  expect(button).toBeDefined()
  button.simulate('click')
})

Then('the {word} field should {word} validation', function(id, result) {
  this.sut.update()
  const input = this.sut.find(`input[name="${id}"]`).first()
  expect(input).toBeDefined()
  expect(input.prop('aria-invalid') ? 'fail' : 'pass').toEqual(result)
})

Then('the form should be submitted', function() {
  this.handleSubmit.expects('handleSubmit').once().withExactArgs(this.fields['email'], this.fields['password'])
})

Then('the submit button should be labelled "{}"', function(text) {
  const button = this.sut.find(`button[type="submit"]`).first()
  expect(button).toBeDefined()
  expect(button.text()).toEqual(text)
})

Then('{word} mode should be selected', function(mode) {
  const toggleButton = this.sut.find('ToggleButtonGroup').first()
  expect(toggleButton).toBeDefined()
  expect(toggleButton.prop('value')).toEqual(mode)
})

Then('the {word} button should be {word}', function(id, state) {
  this.sut.update()
  const button = this.sut.find(`button[type="submit"]`).first()
  expect(button).toBeDefined()
  expect(button.text().toLowerCase()).toEqual(id.toLowerCase())
  expect(button.prop('disabled')).toEqual(state === 'disabled')
})

Then('the {word} field should receive focus', function(id) {
  const input = this.sut.find(`input[name="${id}"]`).first()
  expect(input).toBeDefined()
  expect(input.prop('autoFocus')).toBeTruthy()
})

Then('the {word} field should exist', function(id) {
  expect(this.sut.find(`input[name="${id}"]`).first()).toBeDefined()
})

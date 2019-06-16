import 'jest-dom/extend-expect'
import {
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent
} from '@testing-library/dom'
import { showDialog } from './../Dialogue'
import { el } from './../DOM'

let parent
beforeEach(() => {
  parent = el('div')
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
  document.body.appendChild(parent.element)
})

afterEach(() => document.body.removeChild(parent.element))

window.getSelection = () => ({
  getRangeAt: () => ({
    getBoundingClientRect: () => ({
      top: 0,
      height: 0,
      left: 0
    })
  })
})

describe('Showing', () => {
  it('show dialogue', () => {
    showDialog(parent)
    expect(getByTestId(document, 'dialogue')).toBeVisible()
  })
})

describe('Saving', () => {
  it('callback', () => {
    const fn = jest.fn()
    showDialog(parent).succeeded(fn)
    getByTestId(document, 'dialogue-input').value = 'some link'
    getByText(document, 'Save').click()
    expect(fn).toHaveBeenCalledWith('some link')
  })

  it('close dialogue', () => {
    showDialog(parent)
    getByText(document, 'Save').click()
    expect(queryByTestId(document, 'dialogue')).not.toBeInTheDocument()
  })

  it('work with enter key', () => {
    const fn = jest.fn()
    showDialog(parent).succeeded(fn)
    getByTestId(document, 'dialogue-input').value = 'Hello'
    fireEvent.keyUp(getByTestId(document, 'dialogue-input'), { key: 'Enter' })
    expect(queryByTestId(document, 'dialogue')).not.toBeInTheDocument()
    expect(fn).toHaveBeenCalledWith('Hello')
  })
})

describe('Canceling', () => {
  it('callback', () => {
    const succeeded = jest.fn()
    const canceled = jest.fn()
    showDialog(parent)
      .succeeded(succeeded)
      .canceled(canceled)
    getByText(document, 'Cancel').click()
    expect(canceled).toHaveBeenCalled()
  })

  it('close dialogue', () => {
    showDialog(parent)
    getByText(document, 'Cancel').click()
    expect(queryByTestId(document, 'dialogue')).not.toBeInTheDocument()
  })

  it('work with escape key', () => {
    const fn = jest.fn()
    showDialog(parent).canceled(fn)
    fireEvent.keyUp(getByTestId(document, 'dialogue-input'), {
      key: 'Escape'
    })
    expect(queryByTestId(document, 'dialogue')).not.toBeInTheDocument()
    expect(fn).toHaveBeenCalled()
  })
})

it('show default value', () => {
  showDialog(parent, { defaultValue: 'https://' })
  expect(getByTestId(document, 'dialogue-input').value).toBe('https://')
})

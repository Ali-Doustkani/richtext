import 'jest-dom/extend-expect'
import { getByText, getByTestId, queryByTestId } from '@testing-library/dom'
import { showDialog } from './../Dialogue'
import { el } from './../DOM'

let parent
beforeEach(() => {
  parent = el('div')
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
    expect(fn).toBeCalledWith('some link')
  })

  it('close dialogue', () => {
    showDialog(parent)
    getByText(document, 'Save').click()
    expect(queryByTestId(document, 'dialogue')).not.toBeInTheDocument()
  })
})

describe('Canceling', () => {
  it('callback', () => {
    const fn = jest.fn()
    showDialog(parent).canceled(fn)
    getByText(document, 'Cancel').click()
    expect(fn).toBeCalled()
  })

  it('close dialogue', () => {
    showDialog(parent)
    getByText(document, 'Cancel').click()
    expect(queryByTestId(document, 'dialogue')).not.toBeInTheDocument()
  })
})

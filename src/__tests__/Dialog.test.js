import 'jest-dom/extend-expect'
import {
  getByText,
  getByTestId,
  queryByTestId,
  fireEvent
} from '@testing-library/dom'
import { showDialog } from './../Dialog'
import { el } from './../DOM'

let richtext
beforeEach(() => {
  richtext = el('div')
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
  document.body.appendChild(richtext.element)
})

afterEach(() => document.body.removeChild(richtext.element))

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
  it('show dialog', () => {
    showDialog({ richtext })
    expect(getByTestId(document, 'dialog')).toBeVisible()
  })

  it('show delete button in edit mode', () => {
    showDialog({ richtext, mode: 'edit' })
    expect(getByText(document, 'Save')).toBeVisible()
    expect(getByText(document, 'Delete')).toBeVisible()
    expect(getByText(document, 'Cancel')).toBeVisible()
  })

  it('show default value', () => {
    showDialog({ richtext, defaultValue: 'https://' })
    expect(getByTestId(document, 'dialog-input').value).toBe('https://')
  })
})

describe('Saving', () => {
  it('call callback', () => {
    const fn = jest.fn()
    showDialog({ richtext, succeeded: fn })
    getByTestId(document, 'dialog-input').value = 'some link'
    getByText(document, 'Save').click()
    expect(fn).toHaveBeenCalledWith('some link')
  })

  it('close dialog', () => {
    showDialog({ richtext })
    getByText(document, 'Save').click()
    expect(queryByTestId(document, 'dialog')).not.toBeInTheDocument()
  })

  it('work with enter key', () => {
    const fn = jest.fn()
    showDialog({ richtext, succeeded: fn })
    getByTestId(document, 'dialog-input').value = 'Hello'
    fireEvent.keyUp(getByTestId(document, 'dialog-input'), { key: 'Enter' })
    expect(queryByTestId(document, 'dialog')).not.toBeInTheDocument()
    expect(fn).toHaveBeenCalledWith('Hello')
  })

  it('save on edit mode', () => {
    const fn = jest.fn()
    showDialog({
      richtext,
      mode: 'edit',
      defaultValue: 'OldValue',
      succeeded: fn
    })
    expect(getByTestId(document, 'dialog-input').value).toBe('OldValue')
    getByTestId(document, 'dialog-input').value = 'NewValue'
    getByText(document, 'Save').click()
    expect(fn).toHaveBeenCalledWith('NewValue')
  })

  it('delete on edit mode', () => {
    const fn = jest.fn()
    showDialog({ richtext, mode: 'edit', deleted: fn })
    getByText(document, 'Delete').click()
    expect(fn).toHaveBeenCalled()
  })
})

describe('Canceling', () => {
  it('call callback', () => {
    const succeeded = jest.fn()
    const canceled = jest.fn()
    showDialog({ richtext, succeeded, canceled })
    getByText(document, 'Cancel').click()
    expect(canceled).toHaveBeenCalled()
  })

  it('close dialog', () => {
    showDialog({ richtext })
    getByText(document, 'Cancel').click()
    expect(queryByTestId(document, 'dialog')).not.toBeInTheDocument()
  })

  it('work with escape key', () => {
    const fn = jest.fn()
    showDialog({ richtext, canceled: fn })
    fireEvent.keyUp(getByTestId(document, 'dialog-input'), {
      key: 'Escape'
    })
    expect(queryByTestId(document, 'dialog')).not.toBeInTheDocument()
    expect(fn).toHaveBeenCalled()
  })

  it('cancel on edit mode', () => {
    const fn = jest.fn()
    showDialog({ richtext, mode: 'edit', canceled: fn })
    getByText(document, 'Cancel').click()
    expect(fn).toHaveBeenCalled()
  })
})

import { canBackspace, canDelete } from './../editor'
import { el, relativeRange } from '../DOM'

jest.mock('../DOM/Range')
window.getSelection = () => ({
  getRangeAt: () => null
})

describe('checking editor gluing with backspace', () => {
  it('is false when cursor is not at beginning', () => {
    const editor = el('p')
    el('article')
      .append(el('p'))
      .append(editor)
    relativeRange.mockImplementation(() => ({ start: 0, end: 1 }))

    expect(canBackspace(editor)).toBe(false)
  })

  it('is false when editor is the first', () => {
    const editor = el('p')
    relativeRange.mockImplementation(() => ({ start: 0, end: 0 }))

    expect(canBackspace(editor)).toBe(false)
  })

  it('is true when cursor is at the beginning and editor is not the first', () => {
    const editor = el('p')
    el('div')
      .append(el('p'))
      .append(editor)
    relativeRange.mockImplementation(() => ({ start: 0, end: 0 }))

    expect(canBackspace(editor)).toBe(true)
  })
})

describe('checking editor gluing with delete', () => {
  it('is false when cursor is not at end', () => {
    const editor = el('p').val('Hey')
    el('article').append(editor)
    relativeRange.mockImplementation(() => ({ start: 1, end: 1 }))

    expect(canDelete(editor)).toBe(false)
  })

  it('is false when editor is the last', () => {
    const editor = el('p').val('Hey')
    el('article').append(editor)
    relativeRange.mockImplementation(() => ({ start: 3, end: 3 }))

    expect(canDelete(editor)).toBe(false)
  })

  it('is true when cursor is at end and editor is not the last', () => {
    const editor = el('p').val('Hey')
    el('article')
      .append(editor)
      .append(el('p'))
    relativeRange.mockImplementation(() => ({ start: 3, end: 3 }))

    expect(canDelete(editor)).toBe(true)
  })
})

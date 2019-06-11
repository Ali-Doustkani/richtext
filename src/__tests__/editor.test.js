import * as Editor from './../editor'
import { relativeRange } from '../DOM/Range'
import { el } from '../DOM/Query'

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

    expect(Editor.canBackspace(editor)).toBe(false)
  })

  it('is false when editor is the first', () => {
    const editor = el('p')
    relativeRange.mockImplementation(() => ({ start: 0, end: 0 }))

    expect(Editor.canBackspace(editor)).toBe(false)
  })

  it('is true when cursor is at the beginning and editor is not the first', () => {
    const editor = el('p')
    el('div')
      .append(el('p'))
      .append(editor)
    relativeRange.mockImplementation(() => ({ start: 0, end: 0 }))

    expect(Editor.canBackspace(editor)).toBe(true)
  })
})

describe('checking editor gluing with delete', () => {
  it('is false when cursor is not at end', () => {
    const editor = el('p').val('Hey')
    el('article').append(editor)
    relativeRange.mockImplementation(() => ({ start: 1, end: 1 }))

    expect(Editor.canDelete(editor)).toBe(false)
  })

  it('is false when editor is the last', () => {
    const editor = el('p').val('Hey')
    el('article').append(editor)
    relativeRange.mockImplementation(() => ({ start: 3, end: 3 }))

    expect(Editor.canDelete(editor)).toBe(false)
  })

  it('is true when cursor is at end and editor is not the last', () => {
    const editor = el('p').val('Hey')
    el('article')
      .append(editor)
      .append(el('p'))
    relativeRange.mockImplementation(() => ({ start: 3, end: 3 }))

    expect(Editor.canDelete(editor)).toBe(true)
  })
})

describe('previous editor', () => {
  let richtext
  let editor
  beforeEach(() => (richtext = el('div')))

  it('return null for first <p>', () => {
    editor = el('p').appendTo(richtext)
    expect(Editor.previousEditor(editor)).toBeNull()
  })

  it('return previous element for a <p>', () => {
    const prev = el('p').appendTo(richtext)
    editor = el('p').appendTo(richtext)
    expect(Editor.previousEditor(editor).is(prev)).toBe(true)
  })

  it('return last <li> of previous list', () => {
    el('ul')
      .append(el('li').val('first'))
      .append(el('li').val('second'))
      .appendTo(richtext)
    editor = el('p').appendTo(richtext)
    expect(Editor.previousEditor(editor).val()).toBe('second')
  })

  it('return previous <li> in a list', () => {
    el('ul')
      .append(el('li').val('first'))
      .append(el('li').val('second'))
      .appendTo(richtext)
    editor = richtext
      .firstChild()
      .firstChild()
      .next()
    expect(Editor.previousEditor(editor).val()).toBe('first')
  })

  it('return previous element of list when editor is the first <li>', () => {
    const prev = el('p').appendTo(richtext)
    editor = el('ul')
      .append(el('li'))
      .appendTo(richtext)
      .firstChild()
    expect(Editor.previousEditor(editor).is(prev)).toBe(true)
  })

  it('return null of first <li> of a list with no previous element', () => {
    editor = el('ul')
      .append(el('li'))
      .firstChild()
    expect(Editor.previousEditor(editor)).toBeNull()
  })
})

describe('next editor', () => {
  let richtext
  let editor
  beforeEach(() => (richtext = el('div')))

  it('return null for last <p>', () => {
    editor = el('p').appendTo(richtext)
    expect(Editor.nextEditor(editor)).toBeNull()
  })

  it('return next element for a <p>', () => {
    editor = el('p').appendTo(richtext)
    const next = el('p').appendTo(richtext)
    expect(Editor.nextEditor(editor).is(next)).toBe(true)
  })

  it('return first <li> of next list', () => {
    editor = el('p').appendTo(richtext)
    el('ul')
      .append(el('li').val('first'))
      .append(el('li').val('second'))
      .appendTo(richtext)
    expect(Editor.nextEditor(editor).val()).toBe('first')
  })

  it('return next <li> in a list', () => {
    el('ul')
      .append(el('li').val('first'))
      .append(el('li').val('second'))
      .appendTo(richtext)
    editor = richtext.firstChild().firstChild()

    expect(Editor.nextEditor(editor).val()).toBe('second')
  })

  it('return next element of list when editor is the last <li>', () => {
    editor = el('ul')
      .append(el('li'))
      .appendTo(richtext)
      .firstChild()
    const next = el('p').appendTo(richtext)
    expect(Editor.nextEditor(editor).is(next)).toBe(true)
  })

  it('return null of last <li> of a list with no next element', () => {
    editor = el('ul')
      .append(el('li'))
      .firstChild()
    expect(Editor.nextEditor(editor)).toBeNull()
  })
})

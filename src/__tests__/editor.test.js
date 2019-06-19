import * as Editor from './../editor'
import { relativeRange } from '../Ranging/RangeComputer'
import { el } from '../DOM/Query'

jest.mock('../Ranging/RangeComputer')
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

describe('navigating from <li>s', () => {
  let richtext
  beforeEach(
    () =>
      (richtext = el('div')
        .append(el('p').val('p1'))
        .append(
          el('ul')
            .append(el('li').val('first'))
            .append(el('li').val('second'))
        )
        .append(el('p').val('p2')))
  )

  it('goto last <li>', () => {
    const editor = richtext.lastChild()
    expect(Editor.previousEditor(editor).val()).toBe('second')
  })

  it('goto first <li>', () => {
    const editor = richtext.firstChild()
    expect(Editor.nextEditor(editor).val()).toBe('first')
  })

  it('goto previous <li>', () => {
    const editor = richtext
      .firstChild()
      .next()
      .firstChild()
      .next()
    expect(Editor.previousEditor(editor).val()).toBe('first')
  })

  it('goto next <li>', () => {
    const editor = richtext
      .firstChild()
      .next()
      .firstChild()
    expect(Editor.nextEditor(editor).val()).toBe('second')
  })

  it('go out from list backward', () => {
    const editor = richtext
      .firstChild()
      .next()
      .firstChild()
    expect(Editor.previousEditor(editor).val()).toBe('p1')
  })

  it('go out from list forward', () => {
    const editor = richtext
      .firstChild()
      .next()
      .lastChild()
    expect(Editor.nextEditor(editor).val()).toBe('p2')
  })

  it('go out from first list backward', () => {
    richtext.firstChild().remove()
    const editor = richtext.firstChild().firstChild()
    expect(Editor.previousEditor(editor)).toBeNull()
  })

  it('go out from last list forward', () => {
    richtext.lastChild().remove()
    const editor = richtext.firstChild().lastChild()
    expect(Editor.nextEditor(editor)).toBeNull()
  })
})

describe('navigating in <p>s', () => {
  const richtext = el('div')
    .append(el('p').val('1'))
    .append(el('p').val('2'))

  it('return previous element for a <p>', () => {
    const editor = richtext.lastChild()
    expect(Editor.previousEditor(editor).val()).toBe('1')
  })

  it('return next element for a <p>', () => {
    const editor = richtext.firstChild()
    expect(Editor.nextEditor(editor).val()).toBe('2')
  })

  it('previous of first is null', () => {
    const editor = richtext.firstChild()
    expect(Editor.previousEditor(editor)).toBeNull()
  })

  it('next of last is null', () => {
    const editor = richtext.lastChild()
    expect(Editor.nextEditor(editor)).toBeNull()
  })
})

describe('navigating to <figure>s', () => {
  const richtext = el('div')
  el('p')
    .val('1')
    .appendTo(richtext)
  const cap = el('figcaption')
  el('figure')
    .append(el('img'))
    .append(cap)
    .appendTo(richtext)
  el('p')
    .val('2')
    .appendTo(richtext)

  it('previous is <figcaption>', () => {
    const editor = richtext.lastChild()
    expect(Editor.previousEditor(editor).is(cap)).toBe(true)
  })

  it('next is <figcaption>', () => {
    const editor = richtext.firstChild()
    expect(Editor.nextEditor(editor).is(cap)).toBe(true)
  })
})

describe('navigating from list to <figure>s', () => {
  const richtext = el('div')
    .append(
      el('figure')
        .append(el('img'))
        .append(el('figcaption').val('image 1'))
    )
    .append(el('ul').append(el('li')))
    .append(
      el('figure')
        .append(el('img'))
        .append(el('figcaption').val('image 2'))
    )
  const editor = richtext.child(1).firstChild()

  it('go to <figure> backward', () => {
    expect(Editor.previousEditor(editor).is('figcaption')).toBe(true)
    expect(Editor.previousEditor(editor).val()).toBe('image 1')
  })

  it('go to <figure> forward', () => {
    expect(Editor.nextEditor(editor).is('figcaption')).toBe(true)
    expect(Editor.nextEditor(editor).val()).toBe('image 2')
  })
})

describe('navigating from <figure> to <p>', () => {
  const richtext = el('div')
    .append(el('p').val('1'))
    .append(
      el('figure')
        .append(el('img'))
        .append(el('figcaption'))
    )
    .append(el('p').val('2'))
  const cap = richtext.child(1).lastChild()

  it('go backward', () => {
    expect(Editor.previousEditor(cap).is(richtext.firstChild())).toBe(true)
  })

  it('go forward', () => {
    expect(Editor.nextEditor(cap).is(richtext.lastChild())).toBe(true)
  })
})

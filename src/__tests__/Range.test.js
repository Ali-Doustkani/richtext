import { relativeRange, absoluteRange } from './../Range'
import { el } from './../DOM/Query'

describe('calculate realtive range', () => {
  it('select empty paragraph', () => {
    const p = el('p')
    expect(
      relativeRange(p, {
        commonAncestorContainer: p,
        startContainer: p,
        startOffset: 0,
        endContainer: p,
        endOffset: 0
      })
    ).toEqual({ start: 0, end: 0 })
  })

  it('select simple text', () => {
    const p_root = el('p')
      .val('simple text')
      .firstChild()
    expect(
      relativeRange(p_root, {
        commonAncestorContainer: p_root,
        startContainer: p_root,
        startOffset: 1,
        endContainer: p_root,
        endOffset: 3
      })
    ).toEqual({ start: 1, end: 3 })
  })

  it('select two elements in a paragraph', () => {
    const p_start = el('p')
      .append('abc')
      .append(el('b').val('defg'))
      .append('hi')
    const b_end = el('b')
      .val('jklmn')
      .appendTo(p_start)
    expect(
      relativeRange(p_start, {
        commonAncestorContainer: p_start,
        startContainer: p_start.firstChild(),
        startOffset: 2,
        endContainer: b_end.firstChild(),
        endOffset: 5
      })
    ).toEqual({ start: 2, end: 14 })
  })

  it('find common ancestor', () => {
    const div = el('div')
    const p_first = el('p')
      .append('ab')
      .append(el('b').val(el('i').val('c')))
      .append('d')
      .appendTo(div)
    const p_second = el('p')
      .append('e')
      .append(el('strong').val('f'))
      .append('ghij')
      .appendTo(div)
    expect(
      relativeRange(null, {
        commonAncestorContainer: div.element,
        startContainer: p_first.firstChild().element,
        startOffset: 1,
        endContainer: p_second.lastChild().element,
        endOffset: 1
      })
    ).toEqual({ start: 1, end: 7 })
  })

  it('select one root with different children', () => {
    const p_root = el('p').append('hello ')
    const strong_start = el('strong')
      .val('world')
      .appendTo(p_root)
      .firstChild()
    expect(
      relativeRange(p_root, {
        commonAncestorContainer: strong_start,
        startContainer: strong_start,
        startOffset: 0,
        endContainer: strong_start,
        endOffset: 5
      })
    ).toEqual({ start: 6, end: 11 })
  })

  it('select without selection', () => {
    const p_root = el('p').val('Hello')
    expect(
      relativeRange(p_root, {
        commonAncestorContainer: p_root,
        startContainer: p_root.firstChild(),
        startOffset: 4,
        endContainer: p_root.firstChild(),
        endOffset: 4
      })
    ).toEqual({ start: 4, end: 4 })
  })
})

describe('calculate absolute range', () => {
  it('select empty paragraph', () => {
    const p = el('p')
    expect(absoluteRange(p, { start: 10, end: 50 })).toEqual({
      startContainer: p.element,
      startOffset: 0,
      endContainer: p.element,
      endOffset: 0
    })
  })

  it('select simple text', () => {
    const p = el('p').val('Hello World')
    expect(absoluteRange(p, { start: 6, end: 11 })).toEqual({
      startContainer: p.firstChild().element,
      startOffset: 6,
      endContainer: p.firstChild().element,
      endOffset: 11
    })
  })

  describe('complex tree selection', () => {
    const p = el('p')
    el('b')
      .append(el('i').val('1'))
      .appendTo(p)
    p.append('234')
    el('b')
      .val('5')
      .appendTo(p)
    p.append('67')
    el('b')
      .append(el('i').val('89'))
      .appendTo(p)

    it('1', () =>
      expect(absoluteRange(p, { start: 1, end: 7 })).toEqual({
        startContainer: p
          .firstChild()
          .firstChild()
          .firstChild().element,
        startOffset: 1,
        endContainer: p.child(3).element,
        endOffset: 2
      }))

    it('2', () =>
      expect(absoluteRange(p, { start: 0, end: 9 })).toEqual({
        startContainer: p
          .firstChild()
          .firstChild()
          .firstChild().element,
        startOffset: 0,
        endContainer: p
          .child(4)
          .firstChild()
          .firstChild().element,
        endOffset: 2
      }))

    it('3', () =>
      expect(absoluteRange(p, { start: 2, end: 8 })).toEqual({
        startContainer: p.child(1).element,
        startOffset: 1,
        endContainer: p
          .child(4)
          .firstChild()
          .firstChild().element,
        endOffset: 1
      }))

    it('4', () => {
      expect(absoluteRange(p, { start: 7, end: 9 })).toEqual({
        startContainer: p.child(3).element,
        startOffset: 2,
        endContainer: p
          .child(4)
          .firstChild()
          .firstChild().element,
        endOffset: 2
      })
    })

    it('5', () =>
      expect(absoluteRange(p, { start: 1, end: 1 })).toEqual({
        startContainer: p
          .firstChild()
          .firstChild()
          .firstChild().element,
        startOffset: 1,
        endContainer: p
          .firstChild()
          .firstChild()
          .firstChild().element,
        endOffset: 1
      }))
  })
})

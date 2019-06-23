import { style } from './../../Stylist/Stylist'

const D = {
  bold: { tag: 'strong' },
  italic: { tag: 'i' },
  ol: { parent: true, tag: 'li', parentType: 'ol' },
  ul: { parent: true, tag: 'li', parentType: 'ul' }
}

describe('when input is plain text', () => {
  it('italic a section', () => {
    expect(
      style({
        type: D.italic,
        input: 'hello world',
        range: { start: 0, end: 5 }
      })
    ).toEqual([
      { text: 'hello', decors: [D.italic], active: true },
      { text: ' world', decors: [], active: false }
    ])
  })

  it('bold beginning', () => {
    expect(
      style({
        type: D.bold,
        input: 'one two three',
        range: { start: 0, end: 3 }
      })
    ).toEqual([
      { text: 'one', decors: [D.bold], active: true },
      { text: ' two three', decors: [], active: false }
    ])
  })

  it('bold ending', () => {
    expect(
      style({
        type: D.bold,
        input: 'ali',
        range: { start: 1, end: 3 }
      })
    ).toEqual([
      { text: 'a', decors: [], active: false },
      { text: 'li', decors: [D.bold], active: true }
    ])
  })

  it('bold middle', () => {
    expect(
      style({
        type: D.bold,
        input: 'one two three',
        range: { start: 4, end: 7 }
      })
    ).toEqual([
      { text: 'one ', decors: [], active: false },
      { text: 'two', decors: [D.bold], active: true },
      { text: ' three', decors: [], active: false }
    ])
  })

  it('bold middle with some elements not touched', () => {
    expect(
      style({
        type: D.bold,
        input: [
          { text: 'one' },
          { text: ' two' },
          { text: ' three' },
          { text: ' four' }
        ],
        range: { start: 5, end: 10 }
      })
    ).toEqual([
      { text: 'one t', decors: [], active: false },
      { text: 'wo th', decors: [D.bold], active: true },
      { text: 'ree four', decors: [], active: false }
    ])
  })

  it('bold completely', () => {
    expect(
      style({
        type: D.bold,
        input: 'ali',
        range: { start: 0, end: 3 }
      })
    ).toEqual([{ text: 'ali', decors: [D.bold], active: true }])
  })

  it('bold multiple elements completely', () => {
    expect(
      style({
        type: D.bold,
        input: [
          { text: 'one' },
          { text: 'two' },
          { text: 'three' },
          { text: 'four' }
        ],
        range: { start: 2, end: 12 }
      })
    ).toEqual([
      { text: 'on', decors: [], active: false },
      { text: 'etwothreef', decors: [D.bold], active: true },
      { text: 'our', decors: [], active: false }
    ])
  })

  it('anchor', () => {
    expect(
      style({
        type: { tag: 'a', href: 'link' },
        input: 'HelloWorld',
        range: { start: 0, end: 5 },
        href: 'link'
      })
    ).toEqual([
      { text: 'Hello', decors: [{ tag: 'a', href: 'link' }], active: true },
      { text: 'World', decors: [], active: false }
    ])
  })
})

describe('when some parts of input are styled', () => {
  it('bold before a bolded text', () => {
    expect(
      style({
        type: D.bold,
        input: [{ text: 'hello' }, { text: ' world!', decors: [D.bold] }],
        range: { start: 3, end: 8 }
      })
    ).toEqual([
      { text: 'hel', decors: [], active: false },
      { text: 'lo world!', decors: [D.bold], active: true }
    ])
  })

  it('bold after a bolded text', () => {
    expect(
      style({
        type: D.bold,
        input: [{ text: 'hello', decors: [D.bold] }, { text: ' world!' }],
        range: { start: 0, end: 7 }
      })
    ).toEqual([
      { text: 'hello w', decors: [D.bold], active: true },
      { text: 'orld!', decors: [], active: false }
    ])
  })

  it('expand bold', () => {
    expect(
      style({
        type: D.bold,
        input: [
          { text: 'first' },
          { text: 'second', decors: [D.bold] },
          { text: 'third' }
        ],
        range: { start: 6, end: 13 }
      })
    ).toEqual([
      { text: 'first', decors: [], active: false },
      { text: 'secondth', decors: [D.bold], active: true },
      { text: 'ird', decors: [], active: false }
    ])
  })
})

describe('when unstyling', () => {
  it('unbold the bolded text', () => {
    expect(
      style({
        type: D.bold,
        input: [{ text: 'first', decors: [D.bold] }, { text: ' second' }],
        range: { start: 0, end: 5 }
      })
    ).toEqual([{ text: 'first second', decors: [], active: true }])
  })

  it('unbold an ending section', () => {
    expect(
      style({
        type: D.bold,
        input: { text: 'first second', decors: [D.bold] },
        range: { start: 6, end: 12 }
      })
    ).toEqual([
      { text: 'first ', decors: [D.bold], active: false },
      { text: 'second', decors: [], active: true }
    ])
  })

  it('unbold a middle section', () => {
    expect(
      style({
        type: D.bold,
        input: [
          { text: '123' },
          { text: '4', decors: [D.bold] },
          { text: '5' }
        ],
        range: { start: 3, end: 4 }
      })
    ).toEqual([{ text: '12345', decors: [], active: true }])
  })

  it('unbold an italic and bold text', () => {
    expect(
      style({
        type: D.bold,
        input: { text: 'hello world', decors: [D.bold, D.italic] },
        range: { start: 2, end: 5 }
      })
    ).toEqual([
      { text: 'he', decors: [D.bold, D.italic], active: false },
      { text: 'llo', decors: [D.italic], active: true },
      { text: ' world', decors: [D.bold, D.italic], active: false }
    ])
  })
})

describe('when applying multiple styles', () => {
  it('italic a bold section', () => {
    expect(
      style({
        type: D.italic,
        input: [{ text: 'hello' }, { text: 'world', decors: [D.bold] }],
        range: { start: 5, end: 10 }
      })
    ).toEqual([
      { text: 'hello', decors: [], active: false },
      { text: 'world', decors: [D.bold, D.italic], active: true }
    ])
  })

  it('style before styled content', () => {
    expect(
      style({
        type: D.italic,
        input: [
          { text: 'first ' },
          { text: 'second ', decors: [D.bold] },
          { text: 'third' }
        ],
        range: { start: 0, end: 6 }
      })
    ).toEqual([
      { text: 'first ', decors: [D.italic], active: true },
      { text: 'second ', decors: [D.bold], active: false },
      { text: 'third', decors: [], active: false }
    ])
  })

  it('style already styled content', () => {
    expect(
      style({
        type: D.bold,
        input: { text: 'hello world', decors: [D.italic] },
        range: { start: 6, end: 11 }
      })
    ).toEqual([
      { text: 'hello ', decors: [D.italic], active: false },
      { text: 'world', decors: [D.italic, D.bold], active: true }
    ])
  })

  it('style after styled content', () => {
    expect(
      style({
        type: D.italic,
        input: [
          { text: 'first ' },
          { text: 'second ', decors: [D.bold] },
          { text: 'third' }
        ],
        range: { start: 13, end: 18 }
      })
    ).toEqual([
      { text: 'first ', decors: [], active: false },
      { text: 'second ', decors: [D.bold], active: false },
      { text: 'third', decors: [D.italic], active: true }
    ])
  })

  it('style multiple styled contents', () => {
    expect(
      style({
        type: D.bold,
        input: [
          { text: 'one' },
          { text: 'two', decors: [D.italic] },
          { text: 'three', decors: [D.bold] },
          { text: 'four' }
        ],
        range: { start: 1, end: 14 }
      })
    ).toEqual([
      { text: 'o', decors: [], active: false },
      { text: 'ne', decors: [D.bold], active: false },
      { text: 'two', decors: [D.italic, D.bold], active: false },
      { text: 'threefou', decors: [D.bold], active: true },
      { text: 'r', decors: [], active: false }
    ])
  })

  it('ignore hrefs when re-applying anchors', () => {
    expect(
      style({
        type: { tag: 'a', href: 'link2' },
        input: [
          { text: 'Hello', decors: [{ tag: 'a', href: 'link1' }] },
          { text: 'World', decors: [] }
        ],
        range: { start: 0, end: 10 }
      })
    ).toEqual([
      {
        text: 'HelloWorld',
        decors: [{ tag: 'a', href: 'link2' }],
        active: true
      }
    ])
  })
})

describe('when input is empty', () => {
  it('style', () => {
    expect(
      style({
        type: D.bold,
        input: [{ text: '' }],
        range: { start: 0, end: 0 }
      })
    ).toEqual([{ text: '', decors: [D.bold], active: true }])
  })

  it('unstyle', () => {
    expect(
      style({
        type: D.bold,
        input: [{ text: '', decors: [D.bold] }],
        range: { start: 0, end: 0 }
      })
    ).toEqual([{ text: '', decors: [], active: true }])
  })
})

import { style } from './../../Stylist/Stylist'

const effects = {
  bold: { tag: 'strong' },
  italic: { tag: 'i' }
}

describe('when input is plain text', () => {
  it('italic a section', () => {
    expect(
      style({
        type: effects.italic,
        input: 'hello world',
        from: 0,
        to: 5
      })
    ).toEqual([
      { text: 'hello', effects: [effects.italic], active: true },
      { text: ' world', effects: [], active: false }
    ])
  })

  it('bold beginning', () => {
    expect(
      style({
        type: effects.bold,
        input: 'one two three',
        from: 0,
        to: 3
      })
    ).toEqual([
      { text: 'one', effects: [effects.bold], active: true },
      { text: ' two three', effects: [], active: false }
    ])
  })

  it('bold ending', () => {
    expect(
      style({
        type: effects.bold,
        input: 'ali',
        from: 1,
        to: 3
      })
    ).toEqual([
      { text: 'a', effects: [], active: false },
      { text: 'li', effects: [effects.bold], active: true }
    ])
  })

  it('bold middle', () => {
    expect(
      style({
        type: effects.bold,
        input: 'one two three',
        from: 4,
        to: 7
      })
    ).toEqual([
      { text: 'one ', effects: [], active: false },
      { text: 'two', effects: [effects.bold], active: true },
      { text: ' three', effects: [], active: false }
    ])
  })

  it('bold middle with some elements not touched', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: 'one' },
          { text: ' two' },
          { text: ' three' },
          { text: ' four' }
        ],
        from: 5,
        to: 10
      })
    ).toEqual([
      { text: 'one t', effects: [], active: false },
      { text: 'wo th', effects: [effects.bold], active: true },
      { text: 'ree four', effects: [], active: false }
    ])
  })

  it('bold completely', () => {
    expect(
      style({
        type: effects.bold,
        input: 'ali',
        from: 0,
        to: 3
      })
    ).toEqual([{ text: 'ali', effects: [effects.bold], active: true }])
  })

  it('bold multiple elements completely', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: 'one' },
          { text: 'two' },
          { text: 'three' },
          { text: 'four' }
        ],
        from: 2,
        to: 12
      })
    ).toEqual([
      { text: 'on', effects: [], active: false },
      { text: 'etwothreef', effects: [effects.bold], active: true },
      { text: 'our', effects: [], active: false }
    ])
  })

  it('anchor', () => {
    expect(
      style({
        type: { tag: 'a', href: 'link' },
        input: 'HelloWorld',
        from: 0,
        to: 5,
        href: 'link'
      })
    ).toEqual([
      { text: 'Hello', effects: [{ tag: 'a', href: 'link' }], active: true },
      { text: 'World', effects: [], active: false }
    ])
  })
})

describe('when some parts of input are styled', () => {
  it('bold before a bolded text', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: 'hello' },
          { text: ' world!', effects: [effects.bold] }
        ],
        from: 3,
        to: 8
      })
    ).toEqual([
      { text: 'hel', effects: [], active: false },
      { text: 'lo world!', effects: [effects.bold], active: true }
    ])
  })

  it('bold after a bolded text', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: 'hello', effects: [effects.bold] },
          { text: ' world!' }
        ],
        from: 0,
        to: 7
      })
    ).toEqual([
      { text: 'hello w', effects: [effects.bold], active: true },
      { text: 'orld!', effects: [], active: false }
    ])
  })

  it('expand bold', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: 'first' },
          { text: 'second', effects: [effects.bold] },
          { text: 'third' }
        ],
        from: 6,
        to: 13
      })
    ).toEqual([
      { text: 'first', effects: [], active: false },
      { text: 'secondth', effects: [effects.bold], active: true },
      { text: 'ird', effects: [], active: false }
    ])
  })
})

describe('when unstyling', () => {
  it('unbold the bolded text', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: 'first', effects: [effects.bold] },
          { text: ' second' }
        ],
        from: 0,
        to: 5
      })
    ).toEqual([{ text: 'first second', effects: [], active: true }])
  })

  it('unbold an ending section', () => {
    expect(
      style({
        type: effects.bold,
        input: { text: 'first second', effects: [effects.bold] },
        from: 6,
        to: 12
      })
    ).toEqual([
      { text: 'first ', effects: [effects.bold], active: false },
      { text: 'second', effects: [], active: true }
    ])
  })

  it('unbold a middle section', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: '123' },
          { text: '4', effects: [effects.bold] },
          { text: '5' }
        ],
        from: 3,
        to: 4
      })
    ).toEqual([{ text: '12345', effects: [], active: true }])
  })

  it('unbold an italic and bold text', () => {
    expect(
      style({
        type: effects.bold,
        input: { text: 'hello world', effects: [effects.bold, effects.italic] },
        from: 2,
        to: 5
      })
    ).toEqual([
      { text: 'he', effects: [effects.bold, effects.italic], active: false },
      { text: 'llo', effects: [effects.italic], active: true },
      { text: ' world', effects: [effects.bold, effects.italic], active: false }
    ])
  })
})

describe('when applying multiple styles', () => {
  it('italic a bold section', () => {
    expect(
      style({
        type: effects.italic,
        input: [{ text: 'hello' }, { text: 'world', effects: [effects.bold] }],
        from: 5,
        to: 10
      })
    ).toEqual([
      { text: 'hello', effects: [], active: false },
      { text: 'world', effects: [effects.bold, effects.italic], active: true }
    ])
  })

  it('style before styled content', () => {
    expect(
      style({
        type: effects.italic,
        input: [
          { text: 'first ' },
          { text: 'second ', effects: [effects.bold] },
          { text: 'third' }
        ],
        from: 0,
        to: 6
      })
    ).toEqual([
      { text: 'first ', effects: [effects.italic], active: true },
      { text: 'second ', effects: [effects.bold], active: false },
      { text: 'third', effects: [], active: false }
    ])
  })

  it('style already styled content', () => {
    expect(
      style({
        type: effects.bold,
        input: { text: 'hello world', effects: [effects.italic] },
        from: 6,
        to: 11
      })
    ).toEqual([
      { text: 'hello ', effects: [effects.italic], active: false },
      { text: 'world', effects: [effects.italic, effects.bold], active: true }
    ])
  })

  it('style after styled content', () => {
    expect(
      style({
        type: effects.italic,
        input: [
          { text: 'first ' },
          { text: 'second ', effects: [effects.bold] },
          { text: 'third' }
        ],
        from: 13,
        to: 18
      })
    ).toEqual([
      { text: 'first ', effects: [], active: false },
      { text: 'second ', effects: [effects.bold], active: false },
      { text: 'third', effects: [effects.italic], active: true }
    ])
  })

  it('style multiple styled contents', () => {
    expect(
      style({
        type: effects.bold,
        input: [
          { text: 'one' },
          { text: 'two', effects: [effects.italic] },
          { text: 'three', effects: [effects.bold] },
          { text: 'four' }
        ],
        from: 1,
        to: 14
      })
    ).toEqual([
      { text: 'o', effects: [], active: false },
      { text: 'ne', effects: [effects.bold], active: false },
      { text: 'two', effects: [effects.italic, effects.bold], active: false },
      { text: 'threefou', effects: [effects.bold], active: true },
      { text: 'r', effects: [], active: false }
    ])
  })
})

describe('when input is empty', () => {
  it('style', () => {
    expect(
      style({
        type: effects.bold,
        input: [{ text: '' }],
        from: 0,
        to: 0
      })
    ).toEqual([{ text: '', effects: [effects.bold], active: true }])
  })

  it('unstyle', () => {
    expect(
      style({
        type: effects.bold,
        input: [{ text: '', effects: [effects.bold] }],
        from: 0,
        to: 0
      })
    ).toEqual([{ text: '', effects: [], active: true }])
  })
})

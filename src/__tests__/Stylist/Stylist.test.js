import { style } from './../../Stylist/Stylist'

const rules = {
  bold: { tag: 'strong' },
  italic: { tag: 'i' }
}

describe('when input is plain text', () => {
  it('italic a section', () => {
    expect(
      style({
        type: rules.italic,
        input: 'hello world',
        from: 0,
        to: 5
      })
    ).toEqual([
      { text: 'hello', effects: [rules.italic], active: true },
      { text: ' world', effects: [], active: false }
    ])
  })

  it('bold beginning', () => {
    expect(
      style({
        type: rules.bold,
        input: 'one two three',
        from: 0,
        to: 3
      })
    ).toEqual([
      { text: 'one', effects: [rules.bold], active: true },
      { text: ' two three', effects: [], active: false }
    ])
  })

  it('bold ending', () => {
    expect(
      style({
        type: rules.bold,
        input: 'ali',
        from: 1,
        to: 3
      })
    ).toEqual([
      { text: 'a', effects: [], active: false },
      { text: 'li', effects: [rules.bold], active: true }
    ])
  })

  it('bold middle', () => {
    expect(
      style({
        type: rules.bold,
        input: 'one two three',
        from: 4,
        to: 7
      })
    ).toEqual([
      { text: 'one ', effects: [], active: false },
      { text: 'two', effects: [rules.bold], active: true },
      { text: ' three', effects: [], active: false }
    ])
  })

  it('bold middle with some elements not touched', () => {
    expect(
      style({
        type: rules.bold,
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
      { text: 'wo th', effects: [rules.bold], active: true },
      { text: 'ree four', effects: [], active: false }
    ])
  })

  it('bold completely', () => {
    expect(
      style({
        type: rules.bold,
        input: 'ali',
        from: 0,
        to: 3
      })
    ).toEqual([{ text: 'ali', effects: [rules.bold], active: true }])
  })

  it('bold multiple elements completely', () => {
    expect(
      style({
        type: rules.bold,
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
      { text: 'etwothreef', effects: [rules.bold], active: true },
      { text: 'our', effects: [], active: false }
    ])
  })
})

describe('when some parts of input are styled', () => {
  it('bold before a bolded text', () => {
    expect(
      style({
        type: rules.bold,
        input: [{ text: 'hello' }, { text: ' world!', effects: [rules.bold] }],
        from: 3,
        to: 8
      })
    ).toEqual([
      { text: 'hel', effects: [], active: false },
      { text: 'lo world!', effects: [rules.bold], active: true }
    ])
  })

  it('bold after a bolded text', () => {
    expect(
      style({
        type: rules.bold,
        input: [{ text: 'hello', effects: [rules.bold] }, { text: ' world!' }],
        from: 0,
        to: 7
      })
    ).toEqual([
      { text: 'hello w', effects: [rules.bold], active: true },
      { text: 'orld!', effects: [], active: false }
    ])
  })

  it('expand bold', () => {
    expect(
      style({
        type: rules.bold,
        input: [
          { text: 'first' },
          { text: 'second', effects: [rules.bold] },
          { text: 'third' }
        ],
        from: 6,
        to: 13
      })
    ).toEqual([
      { text: 'first', effects: [], active: false },
      { text: 'secondth', effects: [rules.bold], active: true },
      { text: 'ird', effects: [], active: false }
    ])
  })
})

describe('when unstyling', () => {
  it('unbold the bolded text', () => {
    expect(
      style({
        type: rules.bold,
        input: [{ text: 'first', effects: [rules.bold] }, { text: ' second' }],
        from: 0,
        to: 5
      })
    ).toEqual([{ text: 'first second', effects: [], active: true }])
  })

  it('unbold an ending section', () => {
    expect(
      style({
        type: rules.bold,
        input: { text: 'first second', effects: [rules.bold] },
        from: 6,
        to: 12
      })
    ).toEqual([
      { text: 'first ', effects: [rules.bold], active: false },
      { text: 'second', effects: [], active: true }
    ])
  })

  it('unbold a middle section', () => {
    expect(
      style({
        type: rules.bold,
        input: [
          { text: '123' },
          { text: '4', effects: [rules.bold] },
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
        type: rules.bold,
        input: { text: 'hello world', effects: [rules.bold, rules.italic] },
        from: 2,
        to: 5
      })
    ).toEqual([
      { text: 'he', effects: [rules.bold, rules.italic], active: false },
      { text: 'llo', effects: [rules.italic], active: true },
      { text: ' world', effects: [rules.bold, rules.italic], active: false }
    ])
  })
})

describe('when applying multiple styles', () => {
  it('italic a bold section', () => {
    expect(
      style({
        type: rules.italic,
        input: [{ text: 'hello' }, { text: 'world', effects: [rules.bold] }],
        from: 5,
        to: 10
      })
    ).toEqual([
      { text: 'hello', effects: [], active: false },
      { text: 'world', effects: [rules.bold, rules.italic], active: true }
    ])
  })

  it('style before styled content', () => {
    expect(
      style({
        type: rules.italic,
        input: [
          { text: 'first ' },
          { text: 'second ', effects: [rules.bold] },
          { text: 'third' }
        ],
        from: 0,
        to: 6
      })
    ).toEqual([
      { text: 'first ', effects: [rules.italic], active: true },
      { text: 'second ', effects: [rules.bold], active: false },
      { text: 'third', effects: [], active: false }
    ])
  })

  it('style already styled content', () => {
    expect(
      style({
        type: rules.bold,
        input: { text: 'hello world', effects: [rules.italic] },
        from: 6,
        to: 11
      })
    ).toEqual([
      { text: 'hello ', effects: [rules.italic], active: false },
      { text: 'world', effects: [rules.italic, rules.bold], active: true }
    ])
  })

  it('style after styled content', () => {
    expect(
      style({
        type: rules.italic,
        input: [
          { text: 'first ' },
          { text: 'second ', effects: [rules.bold] },
          { text: 'third' }
        ],
        from: 13,
        to: 18
      })
    ).toEqual([
      { text: 'first ', effects: [], active: false },
      { text: 'second ', effects: [rules.bold], active: false },
      { text: 'third', effects: [rules.italic], active: true }
    ])
  })

  it('style multiple styled contents', () => {
    expect(
      style({
        type: rules.bold,
        input: [
          { text: 'one' },
          { text: 'two', effects: [rules.italic] },
          { text: 'three', effects: [rules.bold] },
          { text: 'four' }
        ],
        from: 1,
        to: 14
      })
    ).toEqual([
      { text: 'o', effects: [], active: false },
      { text: 'ne', effects: [rules.bold], active: false },
      { text: 'two', effects: [rules.italic, rules.bold], active: false },
      { text: 'threefou', effects: [rules.bold], active: true },
      { text: 'r', effects: [], active: false }
    ])
  })
})

describe('when input is empty', () => {
  it('style', () => {
    expect(
      style({
        type: rules.bold,
        input: [{ text: '' }],
        from: 0,
        to: 0
      })
    ).toEqual([{ text: '', effects: [rules.bold], active: true }])
  })

  it('unstyle', () => {
    expect(
      style({
        type: rules.bold,
        input: [{ text: '', effects: [rules.bold] }],
        from: 0,
        to: 0
      })
    ).toEqual([{ text: '', effects: [], active: true }])
  })
})

import style from './../../Stylist/Stylist'

beforeAll(() => {
  style.init({
    bold: { tag: 'strong' },
    italic: { tag: 'i' }
  })
})

it('bold beginning of a plain text', () => {
  expect(
    style({
      type: style.bold,
      input: 'one two three',
      from: 0,
      to: 3
    })
  ).toEqual([{ text: 'one', effects: [style.bold] }, { text: ' two three' }])
})

it('bold end of a plain text', () => {
  expect(
    style({
      type: style.bold,
      input: 'ali',
      from: 1,
      to: 3
    })
  ).toEqual([{ text: 'a' }, { text: 'li', effects: [style.bold] }])
})

it('bold middle of a plain text', () => {
  expect(
    style({
      type: style.bold,
      input: 'one two three',
      from: 4,
      to: 7
    })
  ).toEqual([
    { text: 'one ' },
    { text: 'two', effects: [style.bold] },
    { text: ' three' }
  ])
})

it('bold plain text completely', () => {
  expect(
    style({
      type: style.bold,
      input: 'ali',
      from: 0,
      to: 3
    })
  ).toEqual([{ text: 'ali', effects: [style.bold] }])
})

it('bold some new parts with overlap', () => {
  expect(
    style({
      type: style.bold,
      input: [{ text: 'hello' }, { text: ' world!', effects: [style.bold] }],
      from: 3,
      to: 8
    })
  ).toEqual([{ text: 'hel' }, { text: 'lo world!', effects: [style.bold] }])
})

it('bold some new parts with overlap', () => {
  expect(
    style({
      type: style.bold,
      input: [{ text: 'hello', effects: [style.bold] }, { text: ' world!' }],
      from: 0,
      to: 7
    })
  ).toEqual([{ text: 'hello w', effects: [style.bold] }, { text: 'orld!' }])
})

it("bold in the middle and doesn't touch some elements", () => {
  expect(
    style({
      type: style.bold,
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
    { text: 'one t' },
    { text: 'wo th', effects: [style.bold] },
    { text: 'ree four' }
  ])
})

it('bold multiple elements completely', () => {
  expect(
    style({
      type: style.bold,
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
    { text: 'on' },
    { text: 'etwothreef', effects: [style.bold] },
    { text: 'our' }
  ])
})

it('expand bold', () => {
  expect(
    style({
      type: style.bold,
      input: [
        { text: 'first' },
        { text: 'second', effects: [style.bold] },
        { text: 'third' }
      ],
      from: 6,
      to: 13
    })
  ).toEqual([
    { text: 'first' },
    { text: 'secondth', effects: [style.bold] },
    { text: 'ird' }
  ])
})

it('unbold the bolded text', () => {
  expect(
    style({
      type: style.bold,
      input: [{ text: 'first', effects: [style.bold] }, { text: ' second' }],
      from: 0,
      to: 5
    })
  ).toEqual([{ text: 'first second' }])
})

it('unbold an ending section', () => {
  expect(
    style({
      type: style.bold,
      input: { text: 'first second', effects: [style.bold] },
      from: 6,
      to: 12
    })
  ).toEqual([{ text: 'first ', effects: [style.bold] }, { text: 'second' }])
})

it('unbold a middle section', () => {
  expect(
    style({
      type: style.bold,
      input: [
        { text: '123' },
        { text: '4', effects: [style.bold] },
        { text: '5' }
      ],
      from: 3,
      to: 4
    })
  ).toEqual([{ text: '12345' }])
})

it('italic a section', () => {
  expect(
    style({
      type: style.italic,
      input: 'hello world',
      from: 0,
      to: 5
    })
  ).toEqual([{ text: 'hello', effects: [style.italic] }, { text: ' world' }])
})

it('italic a bold section', () => {
  expect(
    style({
      type: style.italic,
      input: [{ text: 'hello' }, { text: 'world', effects: [style.bold] }],
      from: 5,
      to: 10
    })
  ).toEqual([
    { text: 'hello' },
    { text: 'world', effects: [style.bold, style.italic] }
  ])
})

it('unbold an italic and bold text', () => {
  expect(
    style({
      type: style.bold,
      input: { text: 'hello world', effects: [style.bold, style.italic] },
      from: 2,
      to: 5
    })
  ).toEqual([
    { text: 'he', effects: [style.bold, style.italic] },
    { text: 'llo', effects: [style.italic] },
    { text: ' world', effects: [style.bold, style.italic] }
  ])
})

it('apply style to another part of text', () => {
  expect(
    style({
      type: style.italic,
      input: [{ text: 'hello', effects: [style.bold] }, { text: ' world' }],
      from: 6,
      to: 11
    })
  ).toEqual([
    { text: 'hello', effects: [style.bold] },
    { text: ' ' },
    { text: 'world', effects: [style.italic] }
  ])
})

it('apply style to a part before existing style', () => {
  expect(
    style({
      type: style.italic,
      input: [
        { text: 'first ' },
        { text: 'second ', effects: [style.bold] },
        { text: 'third' }
      ],
      from: 0,
      to: 6
    })
  ).toEqual([
    { text: 'first ', effects: [style.italic] },
    { text: 'second ', effects: [style.bold] },
    { text: 'third' }
  ])
})

it('apply style to a part that already contains style', () => {
  expect(
    style({
      type: style.bold,
      input: { text: 'hello world', effects: [style.italic] },
      from: 6,
      to: 11
    })
  ).toEqual([
    { text: 'hello ', effects: [style.italic] },
    { text: 'world', effects: [style.italic, style.bold] }
  ])
})

it('apply style to a part after existing style', () => {
  expect(
    style({
      type: style.italic,
      input: [
        { text: 'first ' },
        { text: 'second ', effects: [style.bold] },
        { text: 'third' }
      ],
      from: 13,
      to: 18
    })
  ).toEqual([
    { text: 'first ' },
    { text: 'second ', effects: [style.bold] },
    { text: 'third', effects: [style.italic] }
  ])
})

it('return undefined when there is no effect', () => {
  expect(
    style({
      type: style.bold,
      input: { text: 'hello', effects: [style.bold] },
      from: 0,
      to: 5
    })
  ).toEqual([{ text: 'hello' }])
})

it('bold a long text with different styles inside', () => {
  expect(
    style({
      type: style.bold,
      input: [
        { text: 'one' },
        { text: 'two', effects: [style.italic] },
        { text: 'three', effects: [style.bold] },
        { text: 'four' }
      ],
      from: 1,
      to: 14
    })
  ).toEqual([
    { text: 'o' },
    { text: 'ne', effects: [style.bold] },
    { text: 'two', effects: [style.italic, style.bold] },
    { text: 'threefou', effects: [style.bold] },
    { text: 'r' }
  ])
})

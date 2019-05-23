import style from './../../Stylist/Stylist'

const rules = {
  bold: { tag: 'strong' },
  italic: { tag: 'i' }
}

it('bold beginning of a plain text', () => {
  expect(
    style({
      type: rules.bold,
      input: 'one two three',
      from: 0,
      to: 3
    })
  ).toEqual([{ text: 'one', effects: [rules.bold] }, { text: ' two three' }])
})

it('bold end of a plain text', () => {
  expect(
    style({
      type: rules.bold,
      input: 'ali',
      from: 1,
      to: 3
    })
  ).toEqual([{ text: 'a' }, { text: 'li', effects: [rules.bold] }])
})

it('bold middle of a plain text', () => {
  expect(
    style({
      type: rules.bold,
      input: 'one two three',
      from: 4,
      to: 7
    })
  ).toEqual([
    { text: 'one ' },
    { text: 'two', effects: [rules.bold] },
    { text: ' three' }
  ])
})

it('bold plain text completely', () => {
  expect(
    style({
      type: rules.bold,
      input: 'ali',
      from: 0,
      to: 3
    })
  ).toEqual([{ text: 'ali', effects: [rules.bold] }])
})

it('bold some new parts with overlap', () => {
  expect(
    style({
      type: rules.bold,
      input: [{ text: 'hello' }, { text: ' world!', effects: [rules.bold] }],
      from: 3,
      to: 8
    })
  ).toEqual([{ text: 'hel' }, { text: 'lo world!', effects: [rules.bold] }])
})

it('bold some new parts with overlap', () => {
  expect(
    style({
      type: rules.bold,
      input: [{ text: 'hello', effects: [rules.bold] }, { text: ' world!' }],
      from: 0,
      to: 7
    })
  ).toEqual([{ text: 'hello w', effects: [rules.bold] }, { text: 'orld!' }])
})

it("bold in the middle and doesn't touch some elements", () => {
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
    { text: 'one t' },
    { text: 'wo th', effects: [rules.bold] },
    { text: 'ree four' }
  ])
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
    { text: 'on' },
    { text: 'etwothreef', effects: [rules.bold] },
    { text: 'our' }
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
    { text: 'first' },
    { text: 'secondth', effects: [rules.bold] },
    { text: 'ird' }
  ])
})

it('unbold the bolded text', () => {
  expect(
    style({
      type: rules.bold,
      input: [{ text: 'first', effects: [rules.bold] }, { text: ' second' }],
      from: 0,
      to: 5
    })
  ).toEqual([{ text: 'first second' }])
})

it('unbold an ending section', () => {
  expect(
    style({
      type: rules.bold,
      input: { text: 'first second', effects: [rules.bold] },
      from: 6,
      to: 12
    })
  ).toEqual([{ text: 'first ', effects: [rules.bold] }, { text: 'second' }])
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
  ).toEqual([{ text: '12345' }])
})

it('italic a section', () => {
  expect(
    style({
      type: rules.italic,
      input: 'hello world',
      from: 0,
      to: 5
    })
  ).toEqual([{ text: 'hello', effects: [rules.italic] }, { text: ' world' }])
})

it('italic a bold section', () => {
  expect(
    style({
      type: rules.italic,
      input: [{ text: 'hello' }, { text: 'world', effects: [rules.bold] }],
      from: 5,
      to: 10
    })
  ).toEqual([
    { text: 'hello' },
    { text: 'world', effects: [rules.bold, rules.italic] }
  ])
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
    { text: 'he', effects: [rules.bold, rules.italic] },
    { text: 'llo', effects: [rules.italic] },
    { text: ' world', effects: [rules.bold, rules.italic] }
  ])
})

it('apply style to another part of text', () => {
  expect(
    style({
      type: rules.italic,
      input: [{ text: 'hello', effects: [rules.bold] }, { text: ' world' }],
      from: 6,
      to: 11
    })
  ).toEqual([
    { text: 'hello', effects: [rules.bold] },
    { text: ' ' },
    { text: 'world', effects: [rules.italic] }
  ])
})

it('apply style to a part before existing style', () => {
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
    { text: 'first ', effects: [rules.italic] },
    { text: 'second ', effects: [rules.bold] },
    { text: 'third' }
  ])
})

it('apply style to a part that already contains style', () => {
  expect(
    style({
      type: rules.bold,
      input: { text: 'hello world', effects: [rules.italic] },
      from: 6,
      to: 11
    })
  ).toEqual([
    { text: 'hello ', effects: [rules.italic] },
    { text: 'world', effects: [rules.italic, rules.bold] }
  ])
})

it('apply style to a part after existing style', () => {
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
    { text: 'first ' },
    { text: 'second ', effects: [rules.bold] },
    { text: 'third', effects: [rules.italic] }
  ])
})

it('return undefined when there is no effect', () => {
  expect(
    style({
      type: rules.bold,
      input: { text: 'hello', effects: [rules.bold] },
      from: 0,
      to: 5
    })
  ).toEqual([{ text: 'hello' }])
})

it('bold a long text with different styles inside', () => {
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
    { text: 'o' },
    { text: 'ne', effects: [rules.bold] },
    { text: 'two', effects: [rules.italic, rules.bold] },
    { text: 'threefou', effects: [rules.bold] },
    { text: 'r' }
  ])
})

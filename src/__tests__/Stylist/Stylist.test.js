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
  ).toEqual([
    { text: 'one', effects: [rules.bold], active: true },
    { text: ' two three', active: false }
  ])
})

it('bold end of a plain text', () => {
  expect(
    style({
      type: rules.bold,
      input: 'ali',
      from: 1,
      to: 3
    })
  ).toEqual([
    { text: 'a', active: false },
    { text: 'li', effects: [rules.bold], active: true }
  ])
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
    { text: 'one ', active: false },
    { text: 'two', effects: [rules.bold], active: true },
    { text: ' three', active: false }
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
  ).toEqual([{ text: 'ali', effects: [rules.bold], active: true }])
})

it('bold some new parts before a bolded text', () => {
  expect(
    style({
      type: rules.bold,
      input: [{ text: 'hello' }, { text: ' world!', effects: [rules.bold] }],
      from: 3,
      to: 8
    })
  ).toEqual([
    { text: 'hel', active: false },
    { text: 'lo world!', effects: [rules.bold], active: true }
  ])
})

it('bold some new parts after a bolded text', () => {
  expect(
    style({
      type: rules.bold,
      input: [{ text: 'hello', effects: [rules.bold] }, { text: ' world!' }],
      from: 0,
      to: 7
    })
  ).toEqual([
    { text: 'hello w', effects: [rules.bold], active: true },
    { text: 'orld!', active: false }
  ])
})

it('bold in the middle and some elements not touched', () => {
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
    { text: 'one t', active: false },
    { text: 'wo th', effects: [rules.bold], active: true },
    { text: 'ree four', active: false }
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
    { text: 'on', active: false },
    { text: 'etwothreef', effects: [rules.bold], active: true },
    { text: 'our', active: false }
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
    { text: 'first', active: false },
    { text: 'secondth', effects: [rules.bold], active: true },
    { text: 'ird', active: false }
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
  ).toEqual([{ text: 'first second', active: true }])
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
    { text: 'second', active: true }
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
  ).toEqual([{ text: '12345', active: true }])
})

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
    { text: ' world', active: false }
  ])
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
    { text: 'hello', active: false },
    { text: 'world', effects: [rules.bold, rules.italic], active: true }
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
    { text: 'he', effects: [rules.bold, rules.italic], active: false },
    { text: 'llo', effects: [rules.italic], active: true },
    { text: ' world', effects: [rules.bold, rules.italic], active: false }
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
    { text: 'hello', effects: [rules.bold], active: false },
    { text: ' ', active: false },
    { text: 'world', effects: [rules.italic], active: true }
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
    { text: 'first ', effects: [rules.italic], active: true },
    { text: 'second ', effects: [rules.bold], active: false },
    { text: 'third', active: false }
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
    { text: 'hello ', effects: [rules.italic], active: false },
    { text: 'world', effects: [rules.italic, rules.bold], active: true }
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
    { text: 'first ', active: false },
    { text: 'second ', effects: [rules.bold], active: false },
    { text: 'third', effects: [rules.italic], active: true }
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
  ).toEqual([{ text: 'hello', active: true }])
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
    { text: 'o', active: false },
    { text: 'ne', effects: [rules.bold], active: false },
    { text: 'two', effects: [rules.italic, rules.bold], active: false },
    { text: 'threefou', effects: [rules.bold], active: true },
    { text: 'r', active: false }
  ])
})

it('style an empty input', () => {
  expect(
    style({
      type: rules.bold,
      input: [{ text: '' }],
      from: 0,
      to: 0
    })
  ).toEqual([{ text: '', effects: [rules.bold], active: true }])
})

it('unstyle an empty input', () => {
  expect(
    style({
      type: rules.bold,
      input: [{ text: '', effects: [rules.bold] }],
      from: 0,
      to: 0
    })
  ).toEqual([{ text: '', effects: [], active: true }])
})

import { breakAt, glue } from './../../Stylist/Break'

const effects = {
  bold: {
    tag: 'b'
  },
  header: {
    parent: true,
    tag: 'h1',
    toString: () => 'sdfsdf'
  }
}

it('creates a new array for result', () => {
  const model = [{ text: '123456' }]
  const [m1, m2] = breakAt(model, 3)
  expect(m1).not.toBe(model)
  expect(m2).not.toBe(model)
})

it('break at a point in a single-item model', () => {
  const [m1, m2] = breakAt([{ text: 'hello world' }], 6)
  expect(m1).toEqual([{ text: 'hello ', active: false }])
  expect(m2).toEqual([{ text: 'world', active: true }])
})

it('break at a point in a multi-item model', () => {
  const [m1, m2] = breakAt(
    [{ text: 'one', effects: ['a'] }, { text: 'two' }],
    2
  )
  expect(m1).toEqual([{ text: 'on', effects: ['a'], active: false }])
  expect(m2).toEqual([
    { text: 'e', effects: ['a'], active: false },
    { text: 'two', active: true }
  ])
})

it('break a selection from a single-item model', () => {
  const [m1, m2] = breakAt([{ text: 'hello world' }], { start: 4, end: 9 })
  expect(m1).toEqual([{ text: 'hell', active: false }])
  expect(m2).toEqual([{ text: 'ld', active: true }])
})

it('break a selection from middle of an item to its next', () => {
  const [m1, m2] = breakAt(
    [
      { text: '1', effects: ['a'] },
      { text: '234', effects: ['b'] },
      { text: '5678', effects: ['a', 'c'] },
      { text: 'abc' }
    ],
    { start: 2, end: 6 }
  )
  expect(m1).toEqual([
    { text: '1', effects: ['a'], active: false },
    { text: '2', effects: ['b'], active: false }
  ])
  expect(m2).toEqual([
    { text: '78', effects: ['a', 'c'], active: false },
    { text: 'abc', active: true }
  ])
})

it('break a long selection', () => {
  const [m1, m2] = breakAt(
    [
      { text: '12' },
      { text: '34' },
      { text: '56' },
      { text: '78' },
      { text: '90' }
    ],
    { start: 3, end: 7 }
  )
  expect(m1).toEqual([
    { text: '12', active: false },
    { text: '3', active: false }
  ])
  expect(m2).toEqual([
    { text: '8', active: false },
    { text: '90', active: true }
  ])
})

it('break end of line', () => {
  const [m1, m2] = breakAt([{ text: '123456' }], 6)
  expect(m1).toEqual([{ text: '123456', active: false }])
  expect(m2).toEqual([{ text: '', active: true }])
})

it('break beginning of line', () => {
  const [m1, m2] = breakAt([{ text: '123456' }], 0)
  expect(m1).toEqual([])
  expect(m2).toEqual([{ text: '123456', active: true }])
})

it('is active in the last item when breaking', () => {
  const [m1, m2] = breakAt([{ text: 'HelloWorld' }], 5)
  expect(m1).toEqual([{ text: 'Hello', active: false }])
  expect(m2).toEqual([{ text: 'World', active: true }])
})

it('glue same effects', () => {
  const m1 = [{ text: '123', effects: [1] }, { text: 'abc', effects: ['e1'] }]
  const m2 = [{ text: 'def', effects: ['e1'] }]
  expect(glue(m1, m2)).toEqual([
    { text: '123', effects: [1], active: true },
    { text: 'abcdef', effects: ['e1'], active: false }
  ])
})

it('glue different effects', () => {
  const m1 = [{ text: 'Hello', effects: [1] }]
  const m2 = [{ text: 'World', effects: [2] }]
  expect(glue(m1, m2)).toEqual([
    { text: 'Hello', effects: [1], active: true },
    { text: 'World', effects: [2], active: false }
  ])
})

it('glue when first model is empty', () => {
  const m1 = []
  const m2 = [{ text: 'Hello World' }]
  expect(glue(m1, m2)).toEqual([{ text: 'Hello World', active: true }])
})

it('glue when second model is empty', () => {
  const m1 = [{ text: 'Hello World' }]
  const m2 = []
  expect(glue(m1, m2)).toEqual([{ text: 'Hello World', active: true }])
})

it('glue when both models are empty', () => {
  expect(glue([], [])).toEqual([{ text: '', active: true }])
})

it('glue a regular model to a parent model', () => {
  const regular = [{ text: 'Hello', effects: [effects.bold] }]
  const parent = [{ text: 'World', effects: [effects.header] }]
  expect(glue(regular, parent)).toEqual([
    { text: 'Hello', effects: [effects.bold], active: true },
    { text: 'World', active: false }
  ])
})

it('is active in the first item when breaking', () => {
  expect(
    glue(
      [{ text: 'Hello', effects: [effects.bold] }],
      [{ text: 'World', effects: [effects.header] }]
    )
  ).toEqual([
    { text: 'Hello', effects: [effects.bold], active: true },
    { text: 'World', active: false }
  ])
})

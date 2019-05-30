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
  expect(m1).toEqual([{ text: 'hello ' }])
  expect(m2).toEqual([{ text: 'world' }])
})

it('break at a point in a multi-item model', () => {
  const [m1, m2] = breakAt(
    [{ text: 'one', effects: ['a'] }, { text: 'two' }],
    2
  )
  expect(m1).toEqual([{ text: 'on', effects: ['a'] }])
  expect(m2).toEqual([{ text: 'e', effects: ['a'] }, { text: 'two' }])
})

it('break a selection from a single-item model', () => {
  const [m1, m2] = breakAt([{ text: 'hello world' }], { start: 4, end: 9 })
  expect(m1).toEqual([{ text: 'hell' }])
  expect(m2).toEqual([{ text: 'ld' }])
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
    { text: '1', effects: ['a'] },
    { text: '2', effects: ['b'] }
  ])
  expect(m2).toEqual([{ text: '78', effects: ['a', 'c'] }, { text: 'abc' }])
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
  expect(m1).toEqual([{ text: '12' }, { text: '3' }])
  expect(m2).toEqual([{ text: '8' }, { text: '90' }])
})

it('break end of line', () => {
  const [m1, m2] = breakAt([{ text: '123456' }], 6)
  expect(m1).toEqual([{ text: '123456' }])
  expect(m2).toEqual([])
})

it('break beginning of line', () => {
  const [m1, m2] = breakAt([{ text: '123456' }], 0)
  expect(m1).toEqual([])
  expect(m2).toEqual([{ text: '123456' }])
})

it('glue same effects', () => {
  const m1 = [{ text: '123', effects: [1] }, { text: 'abc', effects: ['e1'] }]
  const m2 = [{ text: 'def', effects: ['e1'] }]
  expect(glue(m1, m2)).toEqual([
    { text: '123', effects: [1] },
    { text: 'abcdef', effects: ['e1'] }
  ])
})

it('glue different effects', () => {
  const m1 = [{ text: 'Hello', effects: [1] }]
  const m2 = [{ text: 'World', effects: [2] }]
  expect(glue(m1, m2)).toEqual([
    { text: 'Hello', effects: [1] },
    { text: 'World', effects: [2] }
  ])
})

it('glue when first model is empty', () => {
  const m1 = []
  const m2 = [{ text: 'Hello World' }]
  expect(glue(m1, m2)).toEqual([{ text: 'Hello World' }])
})

it('glue when second model is empty', () => {
  const m1 = [{ text: 'Hello World' }]
  const m2 = []
  expect(glue(m1, m2)).toEqual([{ text: 'Hello World' }])
})

it('glue a regular model to a parent model', () => {
  const regular = [{ text: 'Hello', effects: [effects.bold] }]
  const parent = [{ text: 'World', effects: [effects.header] }]
  expect(glue(regular, parent)).toEqual([
    { text: 'Hello', effects: [effects.bold] },
    { text: 'World' }
  ])
})

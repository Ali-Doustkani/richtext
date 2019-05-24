import { breakAt } from './../../Stylist/Break'

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

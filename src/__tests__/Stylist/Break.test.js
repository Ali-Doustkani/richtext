import { breakAt, glue } from './../../Stylist/Break'

const ef = {
  b: {
    tag: 'b'
  },
  h: {
    parent: true,
    tag: 'h1'
  }
}

describe('when breaking', () => {
  it('create a new array for result', () => {
    const model = [{ text: '123456', effects: [] }]
    const [m1, m2] = breakAt(model, 3)
    expect(m1).not.toBe(model)
    expect(m2).not.toBe(model)
  })

  it('at a point in a single-item model', () => {
    const [m1, m2] = breakAt([{ text: 'HelloWorld', effects: [ef.b, ef.h] }], 5)
    expect(m1).toEqual([
      { text: 'Hello', effects: [ef.b, ef.h], active: false }
    ])
    expect(m2).toEqual([{ text: 'World', effects: [ef.b, ef.h], active: true }])
  })

  it('at a point in a multi-item model', () => {
    const [m1, m2] = breakAt(
      [{ text: 'one', effects: ['a'] }, { text: 'two', effects: [] }],
      2
    )
    expect(m1).toEqual([{ text: 'on', effects: ['a'], active: false }])
    expect(m2).toEqual([
      { text: 'e', effects: ['a'], active: false },
      { text: 'two', effects: [], active: true }
    ])
  })

  it('a selection from a single-item model', () => {
    const [m1, m2] = breakAt([{ text: 'hello world', effects: [] }], {
      start: 4,
      end: 9
    })
    expect(m1).toEqual([{ text: 'hell', effects: [], active: false }])
    expect(m2).toEqual([{ text: 'ld', effects: [], active: true }])
  })

  it('a selection from middle of an item to its next', () => {
    const [m1, m2] = breakAt(
      [
        { text: '1', effects: ['a'] },
        { text: '234', effects: ['b'] },
        { text: '5678', effects: ['a', 'c'] },
        { text: 'abc', effects: [] }
      ],
      { start: 2, end: 6 }
    )
    expect(m1).toEqual([
      { text: '1', effects: ['a'], active: false },
      { text: '2', effects: ['b'], active: false }
    ])
    expect(m2).toEqual([
      { text: '78', effects: ['a', 'c'], active: false },
      { text: 'abc', effects: [], active: true }
    ])
  })

  it('a long selection', () => {
    const [m1, m2] = breakAt(
      [
        { text: '12', effects: [] },
        { text: '34', effects: [] },
        { text: '56', effects: [] },
        { text: '78', effects: [] },
        { text: '90', effects: [] }
      ],
      { start: 3, end: 7 }
    )
    expect(m1).toEqual([
      { text: '12', effects: [], active: false },
      { text: '3', effects: [], active: false }
    ])
    expect(m2).toEqual([
      { text: '8', effects: [], active: false },
      { text: '90', effects: [], active: true }
    ])
  })

  it('end of line', () => {
    const [m1, m2] = breakAt([{ text: '123456', effects: [ef.b, ef.h] }], 6)
    expect(m1).toEqual([
      { text: '123456', effects: [ef.b, ef.h], active: false }
    ])
    expect(m2).toEqual([{ text: '', effects: [ef.b, ef.h], active: true }])
  })

  it('beginning of line', () => {
    const [m1, m2] = breakAt([{ text: '123456', effects: [ef.b, ef.h] }], 0)
    expect(m1).toEqual([{ text: '', effects: [ef.b, ef.h], active: false }])
    expect(m2).toEqual([
      { text: '123456', effects: [ef.b, ef.h], active: true }
    ])
  })

  it('on empty line', () => {
    const [m1, m2] = breakAt([{ text: '', effects: [ef.h] }], 0)
    expect(m1).toEqual([{ text: '', effects: [ef.h], active: false }])
    expect(m2).toEqual([{ text: '', effects: [ef.h], active: true }])
  })

  it('activate the last item', () => {
    const [m1, m2] = breakAt([{ text: 'HelloWorld', effects: [] }], 5)
    expect(m1).toEqual([{ text: 'Hello', effects: [], active: false }])
    expect(m2).toEqual([{ text: 'World', effects: [], active: true }])
  })
})

describe('when gluing', () => {
  it('same effects', () => {
    const m1 = [{ text: '123', effects: [1] }, { text: 'abc', effects: ['e1'] }]
    const m2 = [{ text: 'def', effects: ['e1'] }]
    expect(glue(m1, m2)).toEqual([
      { text: '123', effects: [1], active: true },
      { text: 'abcdef', effects: ['e1'], active: false }
    ])
  })

  it('different effects', () => {
    const m1 = [{ text: 'Hello', effects: [1] }]
    const m2 = [{ text: 'World', effects: [2] }]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello', effects: [1], active: true },
      { text: 'World', effects: [2], active: false }
    ])
  })

  it('when first model is empty', () => {
    const m1 = []
    const m2 = [{ text: 'Hello World', effects: [] }]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello World', effects: [], active: true }
    ])
  })

  it('when second model is empty', () => {
    const m1 = [{ text: 'Hello World', effects: [] }]
    const m2 = []
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello World', effects: [], active: true }
    ])
  })

  it('when both models are empty', () => {
    expect(glue([], [])).toEqual([{ text: '', effects: [], active: true }])
  })

  it('a regular model to a parent model', () => {
    const regular = [{ text: 'Hello', effects: [ef.b] }]
    const parent = [{ text: 'World', effects: [ef.h] }]
    expect(glue(regular, parent)).toEqual([
      { text: 'Hello', effects: [ef.b], active: true },
      { text: 'World', effects: [], active: false }
    ])
  })

  it('take parent effects from the first model', () => {
    const m1 = [{ text: 'Hello', effects: [ef.b, ef.h] }]
    const m2 = [
      { text: 'Beautiful', effects: [] },
      { text: 'World', effects: [ef.b] }
    ]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello', effects: [ef.b, ef.h], active: true },
      { text: 'Beautiful', effects: [ef.h], active: false },
      { text: 'World', effects: [ef.b, ef.h], active: false }
    ])
  })

  it('remove parent effect from the second model', () => {
    const m1 = [{ text: 'Hello', effects: [ef.b] }]
    const m2 = [{ text: 'World', effects: [ef.h] }]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello', effects: [ef.b], active: true },
      { text: 'World', effects: [], active: false }
    ])
  })

  it('activate the first item', () => {
    expect(
      glue(
        [{ text: 'Hello', effects: [ef.b] }],
        [{ text: 'World', effects: [] }]
      )
    ).toEqual([
      { text: 'Hello', effects: [ef.b], active: true },
      { text: 'World', effects: [], active: false }
    ])
  })
})

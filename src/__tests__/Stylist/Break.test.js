import { breakAt, glue } from './../../Stylist/Break'

const D = {
  bold: {
    tag: 'b'
  },
  head: {
    parent: true,
    tag: 'h1'
  }
}

describe('when breaking', () => {
  it('create a new array for result', () => {
    const model = [{ text: '123456', decors: [] }]
    const [m1, m2] = breakAt(model, 3)
    expect(m1).not.toBe(model)
    expect(m2).not.toBe(model)
  })

  it('at a point in a single-item model', () => {
    const [m1, m2] = breakAt(
      [{ text: 'HelloWorld', decors: [D.bold, D.head] }],
      5
    )
    expect(m1).toEqual([
      { text: 'Hello', decors: [D.bold, D.head], active: false }
    ])
    expect(m2).toEqual([
      { text: 'World', decors: [D.bold, D.head], active: true }
    ])
  })

  it('at a point in a multi-item model', () => {
    const [m1, m2] = breakAt(
      [{ text: 'one', decors: ['a'] }, { text: 'two', decors: [] }],
      2
    )
    expect(m1).toEqual([{ text: 'on', decors: ['a'], active: false }])
    expect(m2).toEqual([
      { text: 'e', decors: ['a'], active: false },
      { text: 'two', decors: [], active: true }
    ])
  })

  it('a selection from a single-item model', () => {
    const [m1, m2] = breakAt([{ text: 'hello world', decors: [] }], {
      start: 4,
      end: 9
    })
    expect(m1).toEqual([{ text: 'hell', decors: [], active: false }])
    expect(m2).toEqual([{ text: 'ld', decors: [], active: true }])
  })

  it('a selection from middle of an item to its next', () => {
    const [m1, m2] = breakAt(
      [
        { text: '1', decors: ['a'] },
        { text: '234', decors: ['b'] },
        { text: '5678', decors: ['a', 'c'] },
        { text: 'abc', decors: [] }
      ],
      { start: 2, end: 6 }
    )
    expect(m1).toEqual([
      { text: '1', decors: ['a'], active: false },
      { text: '2', decors: ['b'], active: false }
    ])
    expect(m2).toEqual([
      { text: '78', decors: ['a', 'c'], active: false },
      { text: 'abc', decors: [], active: true }
    ])
  })

  it('a long selection', () => {
    const [m1, m2] = breakAt(
      [
        { text: '12', decors: [] },
        { text: '34', decors: [] },
        { text: '56', decors: [] },
        { text: '78', decors: [] },
        { text: '90', decors: [] }
      ],
      { start: 3, end: 7 }
    )
    expect(m1).toEqual([
      { text: '12', decors: [], active: false },
      { text: '3', decors: [], active: false }
    ])
    expect(m2).toEqual([
      { text: '8', decors: [], active: false },
      { text: '90', decors: [], active: true }
    ])
  })

  it('end of line', () => {
    const [m1, m2] = breakAt([{ text: '123456', decors: [D.bold, D.head] }], 6)
    expect(m1).toEqual([
      { text: '123456', decors: [D.bold, D.head], active: false }
    ])
    expect(m2).toEqual([{ text: '', decors: [D.bold, D.head], active: true }])
  })

  it('beginning of line', () => {
    const [m1, m2] = breakAt([{ text: '123456', decors: [D.bold, D.head] }], 0)
    expect(m1).toEqual([{ text: '', decors: [D.bold, D.head], active: false }])
    expect(m2).toEqual([
      { text: '123456', decors: [D.bold, D.head], active: true }
    ])
  })

  it('on empty line', () => {
    const [m1, m2] = breakAt([{ text: '', decors: [D.head] }], 0)
    expect(m1).toEqual([{ text: '', decors: [D.head], active: false }])
    expect(m2).toEqual([{ text: '', decors: [D.head], active: true }])
  })

  it('activate the last item', () => {
    const [m1, m2] = breakAt([{ text: 'HelloWorld', decors: [] }], 5)
    expect(m1).toEqual([{ text: 'Hello', decors: [], active: false }])
    expect(m2).toEqual([{ text: 'World', decors: [], active: true }])
  })
})

describe('when gluing', () => {
  it('same decors', () => {
    const m1 = [{ text: '123', decors: [1] }, { text: 'abc', decors: ['e1'] }]
    const m2 = [{ text: 'def', decors: ['e1'] }]
    expect(glue(m1, m2)).toEqual([
      { text: '123', decors: [1], active: true },
      { text: 'abcdef', decors: ['e1'], active: false }
    ])
  })

  it('different decors', () => {
    const m1 = [{ text: 'Hello', decors: [1] }]
    const m2 = [{ text: 'World', decors: [2] }]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello', decors: [1], active: true },
      { text: 'World', decors: [2], active: false }
    ])
  })

  it('when first model is empty', () => {
    const m1 = []
    const m2 = [{ text: 'Hello World', decors: [] }]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello World', decors: [], active: true }
    ])
  })

  it('when second model is empty', () => {
    const m1 = [{ text: 'Hello World', decors: [] }]
    const m2 = []
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello World', decors: [], active: true }
    ])
  })

  it('when both models are empty', () => {
    expect(glue([], [])).toEqual([{ text: '', decors: [], active: true }])
  })

  it('a regular model to a parent model', () => {
    const regular = [{ text: 'Hello', decors: [D.bold] }]
    const parent = [{ text: 'World', decors: [D.head] }]
    expect(glue(regular, parent)).toEqual([
      { text: 'Hello', decors: [D.bold], active: true },
      { text: 'World', decors: [], active: false }
    ])
  })

  it('take parent decors from the first model', () => {
    const m1 = [{ text: 'Hello', decors: [D.bold, D.head] }]
    const m2 = [
      { text: 'Beautiful', decors: [] },
      { text: 'World', decors: [D.bold] }
    ]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello', decors: [D.bold, D.head], active: true },
      { text: 'Beautiful', decors: [D.head], active: false },
      { text: 'World', decors: [D.bold, D.head], active: false }
    ])
  })

  it('remove parent decor from the second model', () => {
    const m1 = [{ text: 'Hello', decors: [D.bold] }]
    const m2 = [{ text: 'World', decors: [D.head] }]
    expect(glue(m1, m2)).toEqual([
      { text: 'Hello', decors: [D.bold], active: true },
      { text: 'World', decors: [], active: false }
    ])
  })

  it('activate the first item', () => {
    expect(
      glue(
        [{ text: 'Hello', decors: [D.bold] }],
        [{ text: 'World', decors: [] }]
      )
    ).toEqual([
      { text: 'Hello', decors: [D.bold], active: true },
      { text: 'World', decors: [], active: false }
    ])
  })
})

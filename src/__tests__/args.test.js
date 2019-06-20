import { checkOptions } from './../args'

it('throw if a decor is null', () => {
  const decors = { bold: null }
  expect(() => checkOptions({ decors })).toThrow()
})

it('throw if tag is not string', () => {
  const decors = { bold: { tag: 123 } }
  expect(() => checkOptions({ decors })).toThrow()
})

it('do not throw if object is valid', () => {
  const decors = { bold: { tag: 'em' } }
  expect(() => checkOptions({ decors })).not.toThrow()
})

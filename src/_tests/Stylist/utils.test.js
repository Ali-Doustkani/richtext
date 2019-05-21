import { remove, merge, when } from '../../Stylist/utils'

test('when', () => {
  const cond1 = () => true
  const cond2 = () => true
  const cond3 = () => false
  let output

  when(cond1)
    .then(() => (output = 1))
    .otherwise(cond2)
    .then(() => (output = 2))
    .otherwise(cond3)
    .then(() => (output = 3))
    .run()

  expect(output).toBe(1)
})

test('remove item from array', () => {
  const array = [1, 2, 3]
  const result = remove(array, 2)
  expect(result).not.toBe(array)
  expect(result).toEqual([1, 3])
})

test('merge an element to an array, with no duplicate', () => {
  // const array = [1, 2, 3]
  const bold = { tag: 'strong' }
  const italic = { tag: 'i' }
  const highlight = { tag: 'div' }
  const array = [bold, italic]
  const result = merge(array, highlight)
  expect(result).not.toBe(array)
  expect(result).toEqual([bold, italic, highlight])
})

test('merge element with no array', () => {
  const result = merge(undefined, 3)
  expect(result).toEqual([3])
})
